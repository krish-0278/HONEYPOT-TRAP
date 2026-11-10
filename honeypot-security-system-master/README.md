# 🛡️ HONEYPOT SECURITY SYSTEM v2.4

> **Enterprise Cyber Deception Platform & 3D Threat Intelligence Security Operations Center (SOC)**
> *"Deception is Your First Line of Defense."*

[![Node Version](https://img.shields.io/badge/node.js-v18%2B-339933?style=for-the-badge&logo=node.js)](https://nodejs.org/)
[![Three.js](https://img.shields.io/badge/Three.js-WebGL%203D-000000?style=for-the-badge&logo=three.js)](https://threejs.org/)
[![License](https://img.shields.io/badge/License-ISC-0ea5e9?style=for-the-badge)](LICENSE)
[![MITRE ATT&CK](https://img.shields.io/badge/MITRE-ATT%26CK%20Aligned-ef4444?style=for-the-badge)](https://attack.mitre.org/)
[![Status](https://img.shields.io/badge/Deception%20Grid-ARMED-10b981?style=for-the-badge)](#)

---

## 📌 Executive Summary

**Honeypot Security System** is a production-grade cyber deception and threat intelligence platform. Inspired by modern enterprise Security Operations Center (SOC) platforms like CrowdStrike Falcon, SentinelOne, and Datadog Cloud SIEM, it transforms passive server defenses into an active, intelligent deception grid.

Instead of merely rejecting unauthorized intrusions, the system lures malicious actors into isolated, realistic decoy environments (mimicking authentication gateways, internal database vaults, root bash shells, and configuration dumps). It intercepts raw payloads, analyzes adversary tactics, calculates AI risk scores, and streams real-time threat intelligence onto an interactive 3D cybersecurity globe and SOC monitoring dashboard.

---

## 🌟 Key Highlights

### 1. 🌐 Impressive 3D Cyber Landing Page
- **Interactive 3D Digital Globe:** Built with Three.js, rendering a rotating dot-matrix Earth with glowing atmospheric halos, pulsing defense sensor hubs, and animated bezier attack vectors.
- **Dynamic Mouse Parallax:** Smooth 3D scene tilt with velocity damping and responsive camera framing.
- **Real-Time Telemetry Counters:** Animated count-up statistics tied directly to live backend forensic metrics (`/api/overview`).
- **Interactive Attack Vector Simulator:** Test SQL injection, XSS, automated crawlers, or brute force in real-time with instant visual confirmation.
- **6-Stage Deception Workflow:** Interactive timeline detailing the lifecycle from decoy deployment to threat visualization.

### 2. 📊 Enterprise SOC Dashboard (`/admin.html`)
- **11 Dedicated Functional Views:**
  1. **Overview:** Executive stat widgets, hourly attack velocity trend chart, threat severity donut, recent security incidents feed, and sensor status grid.
  2. **Live Monitoring:** Real-time streaming log feed with auto-poll toggle (2s/5s/paused), severity filters, and one-click payload inspection.
  3. **Honeypot Management:** Inventory of all 6 active decoys with status toggles (Armed/Paused), hit counters, and a **"Deploy New Decoy"** modal wizard.
  4. **Attack Logs:** Searchable forensic table with pagination, multi-parameter filtering, date ranges, **Export to CSV**, and **Export to JSON**.
  5. **Threat Intelligence:** 3D global adversary reconnaissance globe, top attacker IP leaderboard, and **MITRE ATT&CK® matrix mapping** (T1190, T1110, T1059, T1595).
  6. **IP Analysis:** Forensic IP investigator with threat index gauge, request velocity, signature classification, and simulated quarantine controls.
  7. **Alerts Triage:** Multi-tier alarm inbox (Critical, High, Medium, Low) with audio-visual alarm banners and acknowledge/resolve workflows.
  8. **Analytics:** Multi-chart suite visualizing attack category distributions, automated bots vs. standard browsers, and 24-hour incident heatmaps.
  9. **Reports:** Executive security audit generator with summary risk assessments, date range selectors, CSV export, and print-ready PDF styling (`@media print`).
  10. **Settings:** AI heuristic sensitivity sliders (brute force limits, cumulative risk thresholds), ambient CRT scanline toggles, and audio alarm controls.
  11. **User Profile:** Analyst session security credentials, station IP, and active decoy nodes.

### 3. 🍯 6 Active Deceptive Honeypot Traps
| Honeypot Decoy | Protocol / Route | Vector Intercepted | Deceptive Response |
| :--- | :--- | :--- | :--- |
| **Enterprise SSO Portal** | `HTTP /login.html` | Credential Spray, Brute Force, XSS | Simulated login challenge & trap redirect |
| **Database Vault Trap** | `MySQL /fake-db.html` | SQL Injection (`' OR 1=1`) | Simulated phpMyAdmin dump of synthetic user table |
| **Root Linux Shell** | `SSH /server-files.html` | CLI Crawlers, Bot Enumeration | Interactive Ubuntu 24.04 LTS bash terminal emulator |
| **Leaked Config Vault** | `HTTP /config.html` | Token / Secret Scraping | Fake `.env` and `config.php` honeytoken keys |
| **Legacy Backup Archive**| `HTTP /backup.html` | Directory Traversal | Pseudo-encrypted `backup.zip` file tree |
| **Access Log Tripwire** | `HTTP /logs.html` | Reconnaissance / Snooping | Realistic `tail -f access.log` telemetry stream |

### 4. 🤖 AI Threat Evaluation & Pattern Engine
- **Dynamic Risk Scoring:**
  - SQL Injection (`' OR 1=1 --`, `UNION SELECT`) &rarr; **Risk Score: 5 (Critical)**
  - Automation Tools (cURL, sqlmap, python-requests, empty User-Agent) &rarr; **Risk Score: 5 (Critical)**
  - Cross-Site Scripting (`<script>`, `javascript:`, `onerror=`) &rarr; **Risk Score: 4 (High)**
  - Sub-500ms Bot Speed Attacks &rarr; **Risk Score: 4 (High)**
  - Credential Brute Force (&ge;3 rapid failed attempts) &rarr; **Risk Score: 3 (Medium)**
  - Normal Authentication &rarr; **Risk Score: 0 (Benign / Decoy Portal)**
- **Cumulative Threat Level:** Tracks attacker IPs over time; elevates repeat offenders to `HIGH` threat status and flags automated intrusion patterns.

---

## 🏗️ Architecture & Technology Stack

```
                              ┌─────────────────────────────────────────┐
                              │            ADVERSARY TRAFFIC            │
                              └────────────────────┬────────────────────┘
                                                   │
                       ┌───────────────────────────┴───────────────────────────┐
                       ▼                                                       ▼
            ┌─────────────────────┐                                 ┌─────────────────────┐
            │   HTTP SSO PORTAL   │                                 │ AUTOMATED SCRAPERS  │
            │   (/login.html)     │                                 │ (sqlmap, cURL, bot) │
            └──────────┬──────────┘                                 └──────────┬──────────┘
                       │                                                       │
                       └───────────────────────────┬───────────────────────────┘
                                                   ▼
                                 ┌───────────────────────────────────┐
                                 │   HONEYPOT HEURISTIC EVALUATOR    │
                                 │       (Express.js Backend)        │
                                 └─────────────────┬─────────────────┘
                                                   │
                 ┌─────────────────────────────────┼─────────────────────────────────┐
                 ▼                                 ▼                                 ▼
      ┌─────────────────────┐           ┌─────────────────────┐           ┌─────────────────────┐
      │   DECEPTIVE LURES   │           │ FORENSIC TELEMETRY  │           │   ENTERPRISE SOC    │
      │ • /fake-db.html     │           │ • logs.json (Disk)  │           │   (/admin.html)     │
      │ • /server-files.html│           │ • MySQL DB (Hybrid) │           │ • 3D Cyber Globe    │
      │ • /config.html      │           │ • AI Pattern Engine │           │ • Live Real-time    │
      └─────────────────────┘           └─────────────────────┘           │ • MITRE Matrix      │
                                                                          └─────────────────────┘
```

- **Frontend:**
  - **Three.js (WebGL):** Hardware-accelerated 3D cyber globe, animated quadratic bezier packet trajectories, and interactive radar sweep rings.
  - **Chart.js:** Responsive radar, donut, line, and bar charts with cyberpunk color schemes.
  - **Modern CSS3 Design System (`cyber-core.css`):** Glassmorphism panels (`backdrop-filter`), cyber grid textures, ambient CRT scanline overlay, glowing neon borders, and print styles.
  - **Zero Heavy Framework Lock-In:** Pure vanilla JavaScript component architecture with sub-millisecond DOM updates and zero build-step overhead.
- **Backend:**
  - **Node.js + Express 5:** High-throughput event interception pipeline.
  - **Hybrid Forensic Storage:** Dual-write persistence to MySQL with automatic, seamless fallback to high-speed disk storage (`logs.json`). Over 1,600+ pre-seeded real attack events.

---

## 🚀 Quickstart Guide

### Prerequisites
- [Node.js](https://nodejs.org/) (v18.0.0 or higher)
- npm (v9.0.0 or higher)

### 1. Clone & Navigate
```bash
git clone https://github.com/your-username/honeypot-security-system.git
cd honeypot-security-system
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Launch the Platform
```bash
npm start
```

### 4. Access Web Portals
Once started, open your web browser to any of the following endpoints:

| Interface | URL | Description |
| :--- | :--- | :--- |
| **3D Landing Page** | `http://localhost:3000/` | Interactive 3D globe, live statistics & features |
| **Enterprise SOC Console** | `http://localhost:3000/admin.html` | Real-time security operations center dashboard |
| **Authentication Trap** | `http://localhost:3000/login.html` | Single Sign-On decoy login portal |
| **Database Vault Trap** | `http://localhost:3000/fake-db.html` | phpMyAdmin SQL injection dump console |
| **Terminal Shell Decoy** | `http://localhost:3000/server-files.html` | Interactive Ubuntu bash terminal environment |
| **REST Telemetry API** | `http://localhost:3000/api/overview` | JSON endpoint for external SIEM integration |

---

## 🧪 Testing & Verifying Honeypot Traps

You can test and demonstrate the honeypot detection mechanisms using your browser or terminal:

### 1. Test SQL Injection Trap
- Open `http://localhost:3000/login.html`.
- Enter `admin` as the username and `' OR 1=1 --` as the password.
- **Result:** The system classifies the vector as `sql_injection` (Risk Score: 5), routes you to `fake-db.html` (serving synthetic user records), logs the incident, and triggers an alarm on `/admin.html`.

### 2. Test Automated Bot & cURL Trap
Run the following in your terminal:
```bash
curl -X POST http://localhost:3000/login \
  -H "User-Agent: sqlmap/1.7#dev" \
  -d "username=admin&password=secretpassword"
```
- **Result:** The backend detects the automation tool User-Agent, logs the intrusion as `automation_tool`, and responds with deceptive terminal access output (`whoami -> root`).

### 3. Test One-Click Simulator
- On either the landing page (`/`) or SOC console (`/admin.html`), click **"Simulate Attack"** or **"Test Trap"**.
- Select your target vector, username, and IP, then click **"Trigger Vector"**.
- **Result:** The event is piped through the AI engine, counters update instantly, and an audio-visual alarm flashes on the SOC dashboard.

---

## 📡 REST API Documentation

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/overview` | Summary stats: total attacks, active honeypots, critical incidents, top IPs |
| `GET` | `/api/honeypots` | Inventory of all 6 active decoy sensors with health and hit metrics |
| `POST` | `/api/test-attack` | Safely triggers a simulated intrusion vector into the logging pipeline |
| `GET` | `/api/export/csv` | Streams a complete forensic CSV dump of all captured security events |
| `GET` | `/api/system-status` | Node.js process uptime, memory usage, and sensor health |
| `GET` | `/logs` | Returns full list of forensic events (ordered newest first) |
| `GET` | `/stats` | Attack category breakdown counts |
| `POST` | `/login` | Honeypot entry point evaluating credentials, User-Agent, and velocity |

---

## 📂 Repository Structure

```
honeypot-security-system/
├── package.json                         # Root NPM configuration & start script
├── README.md                            # Comprehensive project documentation
└── honeypot-security-system-master/
    ├── server.js                        # Express 5 deception engine & REST APIs
    ├── logs.json                        # Forensic log database (1,600+ incidents)
    ├── package.json                     # Server dependencies (express, three, chart.js, etc.)
    └── public/                          # Production Web Assets
        ├── index.html                   # 3D Cyber Landing Page with Three.js
        ├── admin.html                   # Enterprise SOC Operations Center Console
        ├── login.html                   # Deceptive Corporate SSO Auth Gateway
        ├── fake-db.html                 # Decoy phpMyAdmin Database Dump Vault
        ├── server-files.html            # Interactive Root Bash Terminal Emulator
        ├── config.html                  # Leaked Configuration Honeytoken Decoy
        ├── backup.html                  # Extracted Archive Lure
        ├── logs.html                    # Exposed Access.log Stream Tripwire
        ├── dashboard.html               # Benign Employee Intranet Workspace
        ├── css/
        │   └── cyber-core.css           # Enterprise Cyberpunk Design System
        ├── js/
        │   └── cyber-globe.js           # Three.js 3D Globe & Threat Visualizer
        └── vendor/
            ├── three.min.js             # Local Three.js WebGL engine bundle
            └── chart.min.js             # Local Chart.js data visualization bundle
```

---

## 🔒 Defensive Security Mandate

This application is strictly designed as a **defensive security monitoring tool** and educational deception grid.
- **No Third-Party Attacks:** The software does not scan, probe, or interact with external third-party systems.
- **Isolated Containment:** Attackers interacting with decoys are served synthetic, non-sensitive records without access to internal system components.
- **No Plaintext Secret Leaks:** Production API keys and database credentials are fully isolated from client-facing code.

---

## 📄 License

This project is licensed under the **ISC License**. Developed for modern cybersecurity operations, defensive engineering, and academic threat research.
