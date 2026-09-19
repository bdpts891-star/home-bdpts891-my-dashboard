# PROKRITO-LIVE

**Real-Time Audio & Video Social Live Streaming Platform**

This repository contains the responsive PROKRITO-LIVE Command Center dashboard experience. It is implemented as a lightweight, dependency-free web UI so it can be previewed immediately in any browser or deployed to GitHub Pages.

## Included in this first slice

- Premium, responsive admin command center with dark navigation shell
- Platform KPI cards for users, activity, revenue and host earnings
- Interactive activity chart with revenue/users/rooms states and date selector
- Live room monitoring table with room type, engagement and status
- Active room breakdown and AI engagement insight banner
- Navigation for users, hosts, wallet, gifts, events, moderation, AI and settings
- Mobile navigation drawer and toast feedback for key actions

## Run locally

Open `index.html` directly, or serve the folder with any static server:

```bash
python3 -m http.server 8000
```

The real-time, WebRTC, payment, wallet and moderation services described in the product brief should be connected through the platform API and event gateway in the next implementation slices. The UI is structured to keep those modules independently extensible.
