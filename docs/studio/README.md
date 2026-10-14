# AIROBOT / 爱洛智能 — Physical AI Developer Platform

**The Personal Computer for Physical AI.**

A complete browser-local frontend prototype: Public Website, Developer Docs and AIROBOT Studio Console. Built with native ES modules, modern CSS and semantic HTML. No runtime framework, package installation, API key or backend is required.

## Product status

Every device, camera scene, episode, training curve, simulation and deployment is **Simulated Data**. Robot drawings are original procedural concept illustrations, not physical hardware photographs. Python and ROS 2 examples describe proposed SDK interfaces; there is no released SDK package. Public hubs and organizational features are Preview / Coming Soon. No customer, revenue, partnership or benchmark claims are made.

## Run locally

Requires Node.js 20+.

```sh
cd docs/studio
npm run dev
# Open http://127.0.0.1:4173
npm test
npm run build
```

For this standalone local folder, simply run the same commands from its root. Build copies browser assets to `dist/`. Alternatively, use `python -m http.server 4173` in this directory. Serve via HTTP; do not open `index.html` with `file://`.

## GitHub Pages

This platform lives at `docs/studio/`, alongside the existing site. In repository **Settings → Pages**, choose **Deploy from a branch → main → /docs**. The platform will appear at:

`https://alex0ai.github.io/airobot-neo01/studio/`

All application routes use hash navigation, e.g. `#/console/dashboard`, so direct links and refreshes work on GitHub Pages without rewrites or a custom 404. Assets use relative URLs and work at nested project paths. To publish elsewhere, deploy the contents of `dist/` or this folder's `index.html`, `favicon.svg` and `src/`.

Google Fonts is an optional external stylesheet; system font fallbacks keep the interface usable when offline. No third-party photos, video assets, analytics or tracking scripts are included.

## Routes

- Public: Home, Product, Platform, Hardware, Data Engine, Teleoperation, Simulation, Train, Deploy, Developers, Interactive Demo, Early Access.
- Ecosystem/company: Model Hub, Dataset Hub, Benchmarks, Research, Community, Universities, Roadmap, Pricing, About, Team, Security.
- Console: Dashboard, Robots, Live Control, Datasets, Training Runs, Models, Simulation, Deployments, Skills, Activity & Logs.
- Docs: Getting Started, Quickstart, AIROBOT One, AIROBOT SDK, Python SDK, ROS 2, Teleoperation, Data Collection, Dataset Format, Training, Simulation, Deployment, Skills, API Reference, Examples, Troubleshooting.

49 routes share layouts and a reusable design system. Unsupported routes display a recovery page.

## Interactive workflow

1. Connect an online sample robot.
2. Enable its synthetic camera.
3. Change a joint target (bounded to ±90°).
4. Record and stop an episode.
5. Save it as a named dataset snapshot.
6. Start training; synthetic progress completes in approximately 13 seconds while the tab is active.
7. A model with training-run lineage is registered automatically.
8. Evaluate the model in simulation (approximately 6.5 seconds).
9. Deploy the evaluated model to an online simulated robot.
10. Add a named skill and inspect all linked artifacts in Console.

Console supports search, status filters, inspect dialogs, dataset metadata and log exports, training queue start/cancel, simulation jobs, skill execution, and emergency stop. The early-access form downloads a local interest brief; it does not submit personal information or claim registration.

## Engineering structure

```text
src/
  api/client.js           REST adapter (inactive in mock mode)
  components/            Shared layout, tables, dialogs, code, SVG visualization
  config.js              Brand, routes, adapter configuration
  data/content.js        Public page and documentation content
  data/mock.js           Independent seed fixtures
  hooks/use-platform.js  Framework-neutral subscription and job lifecycle
  pages/                 Public, docs, Console, interactive demo views
  services/store.js      Browser-local persistence and subscriptions
  services/platform.js   Workflow transitions, guards, jobs, provenance
  services/transports.js WebSocket / WebRTC / auth integration seams
  types/index.d.ts       Typed integration contracts
  app.js                 Routing and delegated UI event handling
  styles.css             Shared tokens, responsive layouts, visual system
scripts/                 Local static server and build
tests/                   Workflow, safety-gate and routing tests
```

Views render escaped text; user input is not inserted as executable HTML. State changes are centralized in the platform service. Browser state is versioned at `airobot.studio.v1`; **Reset Demo** restores fixtures. Reload deliberately disconnects control/camera and stops recording. Background jobs are a deterministic frontend simulation; they resume through page ticks and do not represent durable cloud jobs. Browser storage is untrusted and must never be used as production authorization.

## Backend integration plan

| Capability | Integration boundary | Production work |
| --- | --- | --- |
| REST API | `src/api/client.js` | Authorized workspace endpoints, validation, structured errors |
| ROS 2 / Python SDK | `RobotTransport`, proposed Docs contracts | Device gateway, time sync, validated command limits |
| Robot WebSocket | `RobotWebSocketTransport` | Session auth, reconnect, heartbeat, backpressure, command acknowledgments |
| WebRTC camera | `WebRTCCameraTransport` | Authenticated SDP/ICE signaling and stream lifecycle |
| Telemetry | `Telemetry` interface | Validated samples, timestamps, stale-state detection |
| PostgreSQL | Backend behind REST | Migrations, transactions, per-organization access |
| Authentication / teams | `AuthProvider` | Server sessions, role policies, workspace membership |
| Dataset storage | Dataset / Episode models | Object storage, signed uploads, manifests, checksums |
| Cloud GPU training | Training run transitions | Durable queue, worker scheduler, checkpoint storage |
| Model registry | Model lineage | Artifact blobs, signatures, model cards |
| Simulation backend | Simulation job transitions | Worker execution, measured trials, evaluation reports |
| Real edge deployment | Deployment guard | Signed packages, authorization, staged rollout and rollback |

`config.mode` documents the current mock mode; changing it alone does not enable a real backend. Implement and inject service adapters, authentication and capability checks before enabling real operations. Firmware must enforce motion safety independently of browser controls.

## Validation

`npm test` exercises end-to-end artifact lineage, operation guards, persistence/reset, route destinations and denied storage. `npm run build` produces static browser assets. Browser QA should cover all routes at desktop/mobile widths, the full ten-step flow, Docs search/copy, form validation, filters and reload behavior. No real robot, GPU, WebRTC feed or backend was tested.

## Brand

AIROBOT is the primary brand; 爱洛智能 is the secondary Chinese name. One is hardware; Studio is the development platform; Data manages collection and datasets; Sim handles simulation; SDK is the developer interface; Hub is the planned ecosystem.

## Visual direction

Product-led editorial layout inspired by the user-selected Microduck page: oversized condensed typography, warm cream (#faf7f1), near-black (#221c19), yellow accents, large concept visuals and numbered workflow sections. All brand, copy, illustrations and application UI are AIROBOT-specific. No Pollen Robotics product assets are presented as AIROBOT hardware. Theme overrides are centralized in src/theme.css.

Optional browser QA: install Playwright in your development environment, then run node tests/browser-qa.cjs. The test supports AIROBOT_PLAYWRIGHT for an existing package path and uses installed Microsoft Edge. Screenshots are local QA artifacts, not required for production.

