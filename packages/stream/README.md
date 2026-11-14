# @ai-design-system/stream

Framework-neutral Fetch SSE framing and an optional task-log client. No model SDK, hidden reconnect, fabricated typing, or business side effects. Vue and React use the same transport module. Types ship with the package.

```ts
import {openSse} from '@ai-design-system/stream'
const controller = new AbortController()
for await (const event of openSse('/api/run/stream', {
  body: {runId, prompt}, lastEventId: cursor, signal: controller.signal,
  headers: {Authorization: `Bearer ${token}`}
})) {
  // Validate your own payload and run identity, append new IDs only.
  // Only your service's terminal receipt confirms completion.
}
// controller.abort() ends reception. It does not cancel a server-side job.
```

`readSse(response, {signal?, maxEventBytes?})` parses a response you already fetched. UTF-8 chunk boundaries, LF/CR/CRLF, multiline data, comments, id and retry fields are supported. Default event size limit is 1MiB. HTTP/type/size errors throw, pending reads are cancelled on abort, and early iterator return releases its reader. An incomplete final event is discarded. EOF alone is not success. `retry` is exposed, not executed; reconnect policy belongs to the host.

## Optional task client

```ts
import {createTaskLogSession} from '@ai-design-system/stream'
const session = createTaskLogSession({
  url:'/api/tasks',
  headers:()=>({Authorization:`Bearer ${currentToken()}`}),
  onChange:snapshot=>render(snapshot),
  maxEntries:5000,
})
await session.start({kind:'inspect'})
// session.pause(): disconnect subscription only
// session.resume(): same runId + Last-Event-ID; never creates another job
// session.cancel(): request server cancellation; wait for its receipt
// session.destroy(): dispose subscription on unmount; job ownership stays server-side
```

The client expects this small protocol. Existing services can instead map their own events with `openSse`; they do not need to adopt this protocol.

| Endpoint | Contract |
| --- | --- |
| POST /tasks | JSON payload plus client-generated `runId`. Creation must be idempotent by runId. Reply `{runId,status}`. Never automatically retried. |
| GET /tasks/:runId/events | `text/event-stream`, Last-Event-ID cursor. Replay missing events then attach live without a gap. IDs are consecutive positive integers within the run. |
| POST /tasks/:runId/cancel | Idempotent cancellation. Reply `{runId,status:cancelled|success|failed}`; a job that already finished retains its real terminal result. |

Each event has `id: N`. `event: log` carries `{runId,time,level,message}`, where level is debug/info/warning/error/success. `event: status` carries `{runId,status}` where status is running/success/failed/cancelled. Close only after a terminal status. Log text is plain text, not HTML or interpreted ANSI escape sequences.

Snapshot separates task `status` from `connection` (idle/connecting/live/paused/disconnected), plus entries/cursor/runId/error/cancelling/discarded. Repeated IDs are ignored; gaps or another run's payload stop consumption with an explicit error. A missing terminal event leaves a reconnect action. Cancellation failures retain the current task and expose the error instead of claiming cancellation. The client retains at most5000 entries by default and tracks how many were released; UiTaskLog renders at most500 by default and discloses its bound. Durable logs/archival belong to the service.

Creation with an uncertain network result keeps the original runId. Reconcile through the event endpoint; do not create another billed or destructive operation. Authentication, authorization, expired-history reconciliation, task persistence, external cancellation and server audit belong to the consumer service. This client is not a production scheduler.

UiTaskLog pins its bounded reading window when following is paused, even if new entries exceed the display or retention limit. Reception and the total count continue, with a new-log indicator. Follow-latest releases the snapshot; changing a filter or runId starts a fresh view. Pass runId for distinct jobs. Copy uses all retained matching entries, not just the visible window.

## Local example

The workshop and package examples use examples/shared/demo-stream.ts, a browser-only simulated transport injected through the optional fetcher property of openSse/createTaskLogSession. No network request, source inspection or background job is performed. Normal, disconnect, failure, replay and cancellation states are design fixtures. Closing the view disposes all fixture timers. Static hosting works without a service.

The default fetcher is the real Fetch API. Production consumers supply their own endpoints and business payload validation. Framing is tested against actual streamed HTTP bytes in tests/stream.test.mjs; online UI simulations do not prove production integration. Reference: [WHATWG SSE](https://html.spec.whatwg.org/multipage/server-sent-events.html).
