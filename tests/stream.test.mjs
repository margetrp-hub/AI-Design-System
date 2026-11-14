import test from "node:test";
import assert from "node:assert/strict";
import { createServer } from "node:http";
import { readSse, createTaskLogSession } from "../packages/stream/index.js";
import { createTaskDemo } from "../server/task-demo.mjs";

function response(text, chunkSize = 1) {
  const bytes = new TextEncoder().encode(text);
  return new Response(
    new ReadableStream({
      start(controller) {
        for (let i = 0; i < bytes.length; i += chunkSize)
          controller.enqueue(bytes.slice(i, i + chunkSize));
        controller.close();
      },
    }),
    { headers: { "Content-Type": "text/event-stream; charset=utf-8" } },
  );
}
async function all(stream) {
  const list = [];
  for await (const event of stream) list.push(event);
  return list;
}
test("SSE fragmented UTF-8, CRLF, comments, multiple data lines and persistent event ID", async () => {
  const events = await all(
    readSse(
      response(
        ": heartbeat\r\nid: 12\r\nevent: delta\r\ndata: 中文💡\r\ndata: 第二行\r\nretry: 100\r\n\r\ndata: next\r\n\r\nid:\n\ndata: reset\n\n",
      ),
    ),
  );
  assert.deepEqual(events, [
    { event: "delta", id: "12", retry: 100, data: "中文💡\n第二行" },
    { event: "message", id: "12", data: "next" },
    { event: "message", id: "", data: "reset" },
  ]);
});
test("EOF does not dispatch an incomplete event; size, HTTP and MIME failures are observable", async () => {
  assert.deepEqual(await all(readSse(response("data: unfinished"))), []);
  await assert.rejects(
    all(readSse(response("data: " + "x".repeat(50)), { maxEventBytes: 20 })),
    /size limit/,
  );
  await assert.rejects(
    all(readSse(new Response("failed", { status: 503 }))),
    /HTTP 503/,
  );
  await assert.rejects(
    all(readSse(new Response("not SSE"))),
    /text\/event-stream/,
  );
});
test("abort cancels pending reader and consumer return disposes the stream", async () => {
  let cancelled = 0;
  const controller = new AbortController(),
    stream = new Response(
      new ReadableStream({
        cancel() {
          cancelled++;
        },
      }),
      { headers: { "Content-Type": "text/event-stream" } },
    );
  const pending = readSse(stream, { signal: controller.signal }).next();
  controller.abort();
  await assert.rejects(pending, /abort/i);
  assert.equal(cancelled, 1);
  let returned = false;
  const reader = readSse(
    new Response(
      new ReadableStream({
        start(c) {
          c.enqueue(new TextEncoder().encode("data: first\n\n"));
        },
        cancel() {
          returned = true;
        },
      }),
      { headers: { "Content-Type": "text/event-stream" } },
    ),
  );
  await reader.next();
  await reader.return();
  assert.equal(returned, true);
});
test("real task SSE: completion, interruption replay, failure retry, cancel receipt and paused reception", async (t) => {
  const demo = createTaskDemo({ delay: 8 });
  let rejectCancel = false;
  const server = createServer((req, res) => {
    if (rejectCancel && req.url.endsWith("/cancel")) {
      res.writeHead(503);
      res.end();
      return;
    }
    void demo.handler(req, res);
  });
  await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
  const url = `http://127.0.0.1:${server.address().port}`;
  t.after(() => {
    demo.dispose();
    server.closeAllConnections();
    server.close();
  });
  let snapshot, action;
  const session = createTaskLogSession({
    url,
    onChange: (state) => {
      snapshot = state;
      action?.(state);
    },
  });
  t.after(() => session.destroy());
  await session.start();
  assert.equal(snapshot.status, "success");
  assert.equal(snapshot.connection, "idle");
  assert.ok(snapshot.entries.length > 10);
  const count = snapshot.entries.length,
    old = snapshot.runId;
  await session.start({ fault: "disconnect" });
  assert.equal(snapshot.connection, "disconnected");
  assert.equal(snapshot.status, "running");
  const interrupted = snapshot.runId;
  await session.resume();
  assert.equal(snapshot.runId, interrupted);
  assert.equal(snapshot.status, "success");
  assert.equal(snapshot.entries.length, count);
  assert.equal(new Set(snapshot.entries.map((e) => e.id)).size, count);
  await session.resume();
  assert.equal(snapshot.connection, "idle");
  assert.equal(snapshot.entries.length, count);
  await session.start({ fault: "failure" });
  assert.equal(snapshot.status, "failed");
  assert.ok(snapshot.entries.some((e) => e.level === "error"));
  await session.start();
  assert.equal(snapshot.status, "success");
  assert.notEqual(snapshot.runId, old);
  let cancelPromise;
  action = (state) => {
    if (state.entries.length >= 5 && !cancelPromise)
      cancelPromise = session.cancel();
  };
  await session.start();
  await cancelPromise;
  assert.equal(snapshot.status, "cancelled");
  assert.ok(snapshot.entries.some((e) => e.message.includes("服务端已取消")));
  action = (state) => {
    if (state.entries.length === 5) {
      action = undefined;
      session.pause();
    }
  };
  await session.start();
  assert.equal(snapshot.connection, "paused");
  assert.equal(snapshot.status, "running");
  const pausedCursor = snapshot.cursor;
  await session.resume();
  assert.equal(snapshot.status, "success");
  assert.ok(snapshot.cursor > pausedCursor);
  let rejected = false;
  rejectCancel = true;
  action = (state) => {
    if (state.entries.length === 5 && !rejected) {
      rejected = true;
      void session.cancel();
    }
  };
  await session.start();
  assert.equal(snapshot.status, "success");
  assert.match(snapshot.error, /取消未确认/);
  rejectCancel = false;
});
