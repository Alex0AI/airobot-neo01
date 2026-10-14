# AIROBOT / 爱洛智能

## The Personal Computer for Physical AI.

Physical AI 时代的个人计算平台。

[Open Platform](https://alex0ai.github.io/airobot-neo01/studio/) · [AIROBOT Console](https://alex0ai.github.io/airobot-neo01/studio/#/console/dashboard) · [Developer Docs](https://alex0ai.github.io/airobot-neo01/studio/#/docs/getting-started) · [Interactive Demo](https://alex0ai.github.io/airobot-neo01/studio/#/demo)

A complete frontend product prototype for the Physical AI development stack:

**Hardware → Teleoperation → Data Collection → Dataset → Training → Simulation → Deployment → Skills**

### What is included

- 23 public website routes, including Product, Platform, Hardware, Data Engine, Train, Simulation, Deploy and ecosystem pages.
- 16 documentation topics with navigation, search, highlighted code, copy and Previous / Next.
- 10 Console routes covering fleet, live control, datasets, training, models, simulation, deployments, skills and logs.
- Interactive ten-step workflow with connected local artifacts and browser persistence.
- Responsive design in warm cream, charcoal and yellow; original procedural concept illustrations.
- Independent API, services, mock data, types, hooks, components and configuration.

### Run locally

Requires Node.js 20+; no runtime dependencies to install.

```sh
cd docs/studio
npm run dev
# http://127.0.0.1:4173
npm test
npm run build
```

### Publish with GitHub Pages

Configure **Settings → Pages → Deploy from a branch → main → /docs**. The new platform is at **/studio/**. Hash routes support direct navigation and refresh without server rewrites. The previous product concept site remains at the root URL.

See [platform README](docs/studio/README.md) for all routes, architecture, local workflows and deployment instructions, and [backend integration boundaries](docs/studio/INTEGRATION.md) for production work.

### Prototype boundaries

All robots, telemetry, camera scenes, episodes, training curves, evaluation results and deployments are **Simulated Data**. The frontend does not connect to real robots, cloud compute, authentication or storage services. SDK / Python / ROS 2 snippets describe proposed interfaces, not a released package. Early Access downloads a local interest brief and does not submit personal information. No customers, revenue, partnerships, benchmark results or hardware availability are claimed.

### Brand architecture

AIROBOT · 爱洛智能 / AIROBOT One / AIROBOT Studio / AIROBOT Data / AIROBOT Sim / AIROBOT SDK / AIROBOT Hub.

### Validation

Six Node domain tests cover artifact lineage, command guards, persistence, denied storage and route definitions. Browser QA covers 49 routes at desktop/mobile widths and the complete interactive workflow. The platform uses original SVG illustrations; no Pollen Robotics robot photos are presented as AIROBOT hardware.

### Legacy product concept

The earlier NEO-01 concept site is preserved under `docs/`. Its third-party media references are documented in [MEDIA_ATTRIBUTION.md](MEDIA_ATTRIBUTION.md). The new platform does not depend on those media assets. Project licensing remains to be determined.
