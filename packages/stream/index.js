/** SSE framing only. EOF is not a business-success signal; the host requires its own done event. */
export { createTaskLogSession } from "./task.js";
export async function* readSse(
  response,
  { signal, maxEventBytes = 1024 * 1024 } = {},
) {
  if (!response.ok) throw Error(`SSE HTTP ${response.status}`);
  if (
    !/^text\/event-stream(?:;|$)/i.test(
      response.headers.get("content-type") ?? "",
    )
  )
    throw Error("Expected text/event-stream");
  if (!response.body) throw Error("SSE response has no body");
  const reader = response.body.getReader(),
    decoder = new TextDecoder();
  let buffer = "",
    data = [],
    event = "message",
    id,
    retry,
    size = 0,
    skipLF = false;
  const abort = () => {
    void reader.cancel(signal?.reason).catch(() => {});
  };
  signal?.addEventListener("abort", abort, { once: true });
  try {
    while (true) {
      if (signal?.aborted)
        throw signal.reason ?? new DOMException("Aborted", "AbortError");
      const chunk = await reader.read();
      if (signal?.aborted)
        throw signal.reason ?? new DOMException("Aborted", "AbortError");
      if (chunk.done) break;
      buffer += decoder.decode(chunk.value, { stream: true });
      if (skipLF) {
        if (buffer.startsWith("\n")) buffer = buffer.slice(1);
        skipLF = false;
      }
      let match;
      while ((match = /[\r\n]/.exec(buffer))) {
        const line = buffer.slice(0, match.index),
          ending = buffer[match.index];
        buffer = buffer.slice(match.index + 1);
        if (ending === "\r") {
          if (buffer.startsWith("\n")) buffer = buffer.slice(1);
          else if (!buffer) skipLF = true;
        }
        size += new TextEncoder().encode(line).length;
        if (size > maxEventBytes) throw Error("SSE event exceeds size limit");
        if (line === "") {
          if (data.length)
            yield {
              event,
              data: data.join("\n"),
              ...(id !== undefined ? { id } : {}),
              ...(retry !== undefined ? { retry } : {}),
            };
          data = [];
          event = "message";
          retry = undefined;
          size = 0;
        } else if (!line.startsWith(":")) {
          const colon = line.indexOf(":"),
            field = colon < 0 ? line : line.slice(0, colon),
            raw = colon < 0 ? "" : line.slice(colon + 1),
            value = raw.startsWith(" ") ? raw.slice(1) : raw;
          if (field === "data") data.push(value);
          else if (field === "event") event = value || "message";
          else if (field === "id" && !value.includes("\0")) id = value;
          else if (field === "retry" && /^\d+$/.test(value))
            retry = Number(value);
        }
      }
      if (new TextEncoder().encode(buffer).length + size > maxEventBytes)
        throw Error("SSE event exceeds size limit");
    }
    // An unterminated event is discarded per SSE framing. The host sees EOF without done.
  } finally {
    signal?.removeEventListener("abort", abort);
    await reader.cancel().catch(() => {});
    reader.releaseLock();
  }
}
export async function* openSse(
  url,
  { body, lastEventId, maxEventBytes, fetcher = fetch, ...init } = {},
) {
  const headers = new Headers(init.headers);
  headers.set("Accept", "text/event-stream");
  if (body !== undefined) headers.set("Content-Type", "application/json");
  if (lastEventId !== undefined) headers.set("Last-Event-ID", lastEventId);
  const response = await fetcher(url, {
    ...init,
    method: init.method ?? (body === undefined ? "GET" : "POST"),
    headers,
    body: body === undefined ? undefined : JSON.stringify(body),
  });
  yield* readSse(response, { signal: init.signal ?? undefined, maxEventBytes });
}
