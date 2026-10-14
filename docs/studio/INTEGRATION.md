# Backend integration boundaries

The current renderer uses the synchronous mock `platform` service. A production adapter should implement the same domain commands as asynchronous operations, return server-issued identifiers and publish state through subscriptions. Do not change `config.mode` without replacing the service implementation.

## Domain commands

| Command | Input | Preconditions | Result |
| --- | --- | --- | --- |
| connect | robotId | Authorized, online device | Connected transport |
| camera | robotId | Connected device | Stream lifecycle |
| move | joint target | Connected, enabled, bounded | Acknowledged command |
| record / finish-record | episode settings | Active stream, authorized device | Episode with observation/action manifest |
| save-dataset | episode IDs, name | Valid episodes | Immutable dataset version |
| train | dataset ID/version | Valid dataset and compute policy | Durable training job |
| simulate | model ID, environment | Available model artifact | Evaluation job |
| deploy | model ID, robot ID | Passed evaluation and online authorized target | Staged deployment |
| skill | deployment ID, name | Valid deployment | Task behavior record |

## Safe production rollout

Enforce authorization, input validation, rate limits, motion bounds and emergency-stop behavior in the gateway/firmware. The browser must not be the safety authority. WebSocket messages need a validated schema, monotonic timestamps, heartbeat, reconnect, acknowledgments and stale-sample handling. Implement authenticated WebRTC signaling separately from command transport.

Keep storage and compute behind authenticated REST endpoints. Use an actual database for workspace, organization, membership, dataset, run, model and deployment records, and object storage for observations/checkpoints. Queue cloud jobs durably; stream progress via SSE or WebSocket. Jobs need idempotency keys, cancellation, retry policies and audit events.

Frontend `localStorage` is demo state only. Do not store credentials, sensitive datasets or authorization decisions there. Migrate from local demo IDs to server-issued scoped IDs before live access.
