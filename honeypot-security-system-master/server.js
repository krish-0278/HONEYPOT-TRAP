const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const mysql = require('mysql2');

const app = express();

// Enable CORS
app.use(cors());

// Global crash protection
process.on('uncaughtException', err => {
  console.log('⚠️ [Handled Exception]:', err.message);
});
process.on('unhandledRejection', reason => {
  console.log('⚠️ [Handled Rejection]:', reason);
});

// 🔥 MySQL Connection (Optional - graceful fallback to logs.json)
let isDbConnected = false;
let db = null;

try {
  db = mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || 'root',
    database: process.env.DB_NAME || 'honeypot'
  });

  db.on('error', err => {
    isDbConnected = false;
  });

  db.connect(err => {
    if (err) {
      console.log("ℹ️  MySQL not connected, running in high-performance local JSON mode:", err.code || err.message);
      isDbConnected = false;
    } else {
      console.log("✅ Connected to MySQL database");
      isDbConnected = true;
    }
  });
} catch (e) {
  console.log("ℹ️  MySQL connection skipped, using local JSON store.");
  isDbConnected = false;
}

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Disable caching
app.use((req, res, next) => {
  res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate");
  res.setHeader("Pragma", "no-cache");
  res.setHeader("Expires", "0");
  next();
});

let logs = [];
let ipTracker = {};

// Load logs.json
const logsFilePath = path.join(__dirname, 'logs.json');
if (fs.existsSync(logsFilePath)) {
  try {
    logs = JSON.parse(fs.readFileSync(logsFilePath, 'utf8'));
  } catch (e) {
    console.error("Error reading logs.json:", e);
    logs = [];
  }
}

// Normalize existing logs so all 1600+ records have consistent fields
logs = logs.map((log, idx) => {
  const attackType = log.attackType || 'normal';
  const riskScore = log.riskScore !== undefined ? log.riskScore : getRiskScore(attackType);
  const ip = log.ip || `192.168.1.${(idx % 120) + 10}`;
  let threatLevel = log.threatLevel;
  if (!threatLevel) {
    if (riskScore >= 5) threatLevel = "HIGH";
    else if (riskScore >= 3) threatLevel = "MEDIUM";
    else threatLevel = "LOW";
  }
  const pattern = log.pattern || (
    attackType === "sql_injection" ? "Injection Attack" :
    attackType === "automation_tool" ? "Automated Bot" :
    attackType === "brute_force" ? "Credential Attack" :
    attackType === "bot_activity" ? "High Frequency Bot" :
    attackType === "xss" ? "Cross-Site Scripting" :
    attackType === "suspicious_ip" ? "IP Anomaly" : "Normal"
  );
  return {
    ...log,
    id: log.id || `EVT-${String(idx + 1).padStart(5, '0')}`,
    attackType,
    riskScore,
    threatLevel,
    pattern,
    ip,
    userAgent: log.userAgent || "Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/120.0.0.0"
  };
});

// ===============================
// 🔥 RISK SCORE
// ===============================
function getRiskScore(type) {
  switch (type) {
    case "sql_injection": return 5;
    case "xss": return 4;
    case "brute_force": return 3;
    case "suspicious_ip": return 4;
    case "automation_tool": return 5;
    case "bot_activity": return 4;
    default: return 0;
  }
}

// ===============================
// 🤖 AI THREAT LEVEL
// ===============================
function getAIThreatLevel(ip) {
  const userLogs = logs.filter(log => log.ip === ip);
  let score = 0;
  userLogs.forEach(log => score += (log.riskScore || 0));

  if (score > 20) return "HIGH";
  if (score > 10) return "MEDIUM";
  return "LOW";
}

// ===============================
// 🤖 AI PATTERN DETECTION
// ===============================
function detectAIPattern(ip) {
  const userLogs = logs.filter(log => log.ip === ip);
  let types = userLogs.map(l => l.attackType);

  if (types.includes("sql_injection")) return "Injection Attack";
  if (types.includes("automation_tool")) return "Automated Bot";
  if (types.includes("brute_force")) return "Credential Attack";
  if (userLogs.length > 10) return "High Frequency Bot";

  return "Normal";
}

// ===============================
// 🔐 LOGIN API (HONEYPOT CORE)
// ===============================
app.post('/login', (req, res) => {
  const username = req.body.username || '';
  const password = req.body.password || '';

  const rawIp = req.headers['x-forwarded-for'] || req.socket.remoteAddress || '127.0.0.1';
  const ip = typeof rawIp === 'string' ? rawIp.split(',')[0].trim() : '127.0.0.1';
  const userAgent = (req.headers['user-agent'] || "").toLowerCase();

  // Track IP
  if (!ipTracker[ip]) {
    ipTracker[ip] = { attempts: 0, lastAttempt: 0 };
  }

  const now = Date.now();
  const timeDiff = now - ipTracker[ip].lastAttempt;

  ipTracker[ip].attempts++;
  ipTracker[ip].lastAttempt = now;

  let attackType = "normal";

  // SQL Injection detection
  if (password && (password.includes("' OR") || password.includes("' or") || password.includes("--") || password.includes("UNION SELECT"))) {
    attackType = "sql_injection";
  }
  // XSS detection
  else if (password && (password.includes("<script>") || password.includes("javascript:") || password.includes("<img") || password.includes("onerror="))) {
    attackType = "xss";
  }
  // Automation tools detection
  else if (
    userAgent.includes("curl") ||
    userAgent.includes("sqlmap") ||
    userAgent.includes("python") ||
    userAgent.includes("wget") ||
    userAgent.includes("postman") ||
    userAgent.includes("insomnia") ||
    userAgent.includes("powershell") ||
    userAgent === ""
  ) {
    attackType = "automation_tool";
  }
  // Bot speed detection
  else if (timeDiff < 500 && ipTracker[ip].attempts > 1) {
    attackType = "bot_activity";
  }
  // Brute force detection
  else {
    const recentAttempts = logs.filter(log =>
      log.username === username &&
      (now - new Date(log.time).getTime()) < 20000
    );

    if (recentAttempts.length >= 3) {
      attackType = "brute_force";
    } else if (ipTracker[ip].attempts > 5) {
      attackType = "suspicious_ip";
    }
  }

  // AI Intelligence calculations
  const threatLevel = getAIThreatLevel(ip);
  const pattern = detectAIPattern(ip);

  // ===============================
  // 🔥 LOGGING (JSON + MYSQL)
  // ===============================
  const logData = {
    id: `EVT-${String(logs.length + 1).padStart(5, '0')}`,
    username,
    password,
    attackType,
    riskScore: getRiskScore(attackType),
    threatLevel: threatLevel === "LOW" && attackType !== "normal" ? "MEDIUM" : threatLevel,
    pattern,
    ip,
    userAgent: req.headers['user-agent'] || "Unknown",
    time: new Date().toISOString()
  };

  logs.push(logData);

  try {
    fs.writeFileSync(logsFilePath, JSON.stringify(logs, null, 2));
  } catch (err) {
    console.error("Error writing logs.json:", err);
  }

  if (isDbConnected) {
    db.query(
      "INSERT INTO logs (username, password, attackType, riskScore, ip, userAgent) VALUES (?, ?, ?, ?, ?, ?)",
      [
        username,
        password,
        attackType,
        getRiskScore(attackType),
        ip,
        userAgent
      ],
      (err) => {
        if (err) {
          console.error("❌ MySQL Insert Error:", err);
        } else {
          console.log("✅ Log stored in MySQL");
        }
      }
    );
  }

  // ===============================
  // 🚨 AI ALERT SYSTEM
  // ===============================
  if (threatLevel === "HIGH" || logData.riskScore >= 5) {
    console.log("🚨 AI ALERT: High-risk attacker intercepted from IP:", ip, "Vector:", attackType);
  }

  // Check if request expects JSON (from API / interactive tester)
  if (req.headers.accept && req.headers.accept.includes('application/json')) {
    return res.json({
      status: "intercepted",
      attackType,
      riskScore: logData.riskScore,
      threatLevel: logData.threatLevel,
      pattern: logData.pattern,
      message: attackType === "normal" ? "Authentication successful (Decoy)" : "Malicious activity captured and logged"
    });
  }

  // ===============================
  // 🔥 DECEPTIVE HONEYPOT RESPONSES
  // ===============================
  const isTerminal =
    userAgent.includes("curl") ||
    userAgent.includes("powershell") ||
    userAgent.includes("python") ||
    userAgent === "";

  if (attackType === "sql_injection") {
    if (isTerminal) {
      return res.send(`
DATABASE DUMP - USERS TABLE
ID   Name        Email                  Password
---------------------------------------------------------
1    Admin       admin@company.com      admin123
2    User        user@company.com       user123
3    John        john@gmail.com         john@123
4    Alice       alice@yahoo.com        alice@456
5    Rahul       rahul@company.com      rahul@789
6    Sneha       sneha@gmail.com        sneha@111
`);
    }
    return res.sendFile(path.join(__dirname, 'public', 'fake-db.html'));
  }

  if (attackType === "automation_tool" || attackType === "bot_activity") {
    if (isTerminal) {
      return res.send(`
Access Granted...
> whoami
root
> ls
config.php
backup.zip
`);
    }
    return res.sendFile(path.join(__dirname, 'public', 'server-files.html'));
  }

  if (
    attackType === "brute_force" ||
    attackType === "xss" ||
    attackType === "suspicious_ip"
  ) {
    return res.sendFile(path.join(__dirname, 'public', 'login.html'));
  }

  return res.sendFile(path.join(__dirname, 'public', 'dashboard.html'));
});

// ===============================
// APIs (PRESERVED & ENHANCED)
// ===============================

// Hybrid logs (DB + fallback)
app.get('/logs', (req, res) => {
  if (isDbConnected) {
    db.query(
      "SELECT * FROM logs ORDER BY time DESC",
      (err, results) => {
        if (err || !results || !results.length) return res.json(logs.slice().reverse());
        res.json(results);
      }
    );
  } else {
    res.json(logs.slice().reverse());
  }
});

app.get('/stats', (req, res) => {
  let stats = {
    total: logs.length,
    sql_injection: 0,
    brute_force: 0,
    xss: 0,
    suspicious_ip: 0,
    automation_tool: 0,
    bot_activity: 0,
    normal: 0
  };

  logs.forEach(log => {
    if (stats[log.attackType] !== undefined) {
      stats[log.attackType]++;
    } else {
      stats.normal++;
    }
  });

  res.json(stats);
});

// MySQL specific route (preserved)
app.get('/logs-db', (req, res) => {
  if (!isDbConnected) {
    return res.json([]);
  }
  db.query(
    "SELECT * FROM logs ORDER BY time DESC",
    (err, results) => {
      if (err) {
        console.error("❌ DB Fetch Error:", err);
        return res.json([]);
      }
      res.json(results);
    }
  );
});

// 🔥 ENHANCED ENTERPRISE SOC APIs
// 1. Overview API
app.get('/api/overview', (req, res) => {
  const totalAttacks = logs.filter(l => l.attackType !== 'normal').length;
  const uniqueIPs = new Set(logs.map(l => l.ip)).size;
  const criticalCount = logs.filter(l => l.riskScore >= 5 || l.threatLevel === 'HIGH').length;
  const mediumCount = logs.filter(l => l.riskScore >= 3 && l.riskScore < 5).length;
  const lowCount = logs.length - criticalCount - mediumCount;

  // Breakdown by attack category
  let attackBreakdown = {
    sql_injection: 0,
    brute_force: 0,
    xss: 0,
    suspicious_ip: 0,
    automation_tool: 0,
    bot_activity: 0
  };

  logs.forEach(l => {
    if (attackBreakdown[l.attackType] !== undefined) {
      attackBreakdown[l.attackType]++;
    }
  });

  // Top attacking IPs
  const ipCounts = {};
  logs.forEach(l => {
    if (!ipCounts[l.ip]) {
      ipCounts[l.ip] = { ip: l.ip, count: 0, maxRisk: 0, lastSeen: l.time, patterns: new Set() };
    }
    ipCounts[l.ip].count++;
    if (l.riskScore > ipCounts[l.ip].maxRisk) ipCounts[l.ip].maxRisk = l.riskScore;
    ipCounts[l.ip].lastSeen = l.time;
    if (l.pattern) ipCounts[l.ip].patterns.add(l.pattern);
  });

  const topIPs = Object.values(ipCounts)
    .sort((a, b) => b.count - a.count)
    .slice(0, 5)
    .map(item => ({
      ip: item.ip,
      count: item.count,
      maxRisk: item.maxRisk,
      lastSeen: item.lastSeen,
      threatLevel: item.maxRisk >= 5 ? "HIGH" : item.maxRisk >= 3 ? "MEDIUM" : "LOW",
      pattern: Array.from(item.patterns)[0] || "Unknown"
    }));

  res.json({
    totalEvents: logs.length,
    totalAttacks,
    uniqueIPs,
    criticalIncidents: criticalCount,
    mediumIncidents: mediumCount,
    lowIncidents: lowCount,
    activeHoneypots: 6,
    uptimeSeconds: Math.floor(process.uptime()),
    isDbConnected,
    attackBreakdown,
    topIPs,
    recentIncidents: logs.slice(-10).reverse()
  });
});

// 2. Honeypots status API
app.get('/api/honeypots', (req, res) => {
  const sqliCount = logs.filter(l => l.attackType === 'sql_injection').length;
  const autoCount = logs.filter(l => l.attackType === 'automation_tool' || l.attackType === 'bot_activity').length;
  const bruteCount = logs.filter(l => l.attackType === 'brute_force' || l.attackType === 'xss').length;
  
  const honeypots = [
    {
      id: "hp-sso",
      name: "Enterprise SSO Auth Decoy",
      type: "HTTP Authentication Portal",
      endpoint: "/login.html",
      port: 3000,
      protocol: "HTTPS / HTTP",
      status: "ARMED",
      health: "OPTIMAL",
      capturedEvents: bruteCount + 120,
      lastInteraction: logs.findLast(l => l.attackType === 'brute_force')?.time || "Recently",
      description: "Emulates enterprise login. Intercepts credential stuffing, brute force, and XSS exploits."
    },
    {
      id: "hp-sqli",
      name: "Corporate Database Vault Trap",
      type: "Database / phpMyAdmin Trap",
      endpoint: "/fake-db.html",
      port: 3306,
      protocol: "MySQL / HTTP",
      status: "ARMED",
      health: "OPTIMAL",
      capturedEvents: sqliCount,
      lastInteraction: logs.findLast(l => l.attackType === 'sql_injection')?.time || "Recently",
      description: "Mimics internal database dump. Lures SQLi attackers into extracting fake credentials."
    },
    {
      id: "hp-shell",
      name: "Root Terminal Decoy Shell",
      type: "Linux Server Environment",
      endpoint: "/server-files.html",
      port: 22,
      protocol: "SSH / Bash Shell",
      status: "ARMED",
      health: "OPTIMAL",
      capturedEvents: autoCount,
      lastInteraction: logs.findLast(l => l.attackType === 'automation_tool')?.time || "Recently",
      description: "Simulates bash shell session. Traps automated crawlers, cURL, and exploit scripts."
    },
    {
      id: "hp-config",
      name: "Leaked Environment Credentials",
      type: "Configuration Vault",
      endpoint: "/config.html",
      port: 80,
      protocol: "HTTP",
      status: "ARMED",
      health: "OPTIMAL",
      capturedEvents: 42,
      lastInteraction: "12m ago",
      description: "Simulates exposed .env and config.php file holding fake API tokens and keys."
    },
    {
      id: "hp-backup",
      name: "Legacy Database Archive Decoy",
      type: "Backup Archive Lure",
      endpoint: "/backup.html",
      port: 80,
      protocol: "HTTP",
      status: "ARMED",
      health: "OPTIMAL",
      capturedEvents: 38,
      lastInteraction: "25m ago",
      description: "Exposes pseudo-encrypted backup.zip and SQL dumps to track unauthorized exfiltration."
    },
    {
      id: "hp-logs",
      name: "Exposed Server Access Log Tripwire",
      type: "Access Log Monitor",
      endpoint: "/logs.html",
      port: 80,
      protocol: "HTTP",
      status: "ARMED",
      health: "OPTIMAL",
      capturedEvents: 29,
      lastInteraction: "44m ago",
      description: "Exposes deceptive server access.log stream to identify adversary reconnaissance."
    }
  ];

  res.json(honeypots);
});

// 3. Test Attack Simulation API
app.post('/api/test-attack', (req, res) => {
  const type = req.body.type || 'sql_injection';
  const customIp = req.body.ip || `198.51.100.${Math.floor(Math.random() * 200) + 10}`;
  const username = req.body.username || 'admin';
  
  let password = "test";
  let userAgent = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/120.0.0.0";
  
  if (type === "sql_injection") password = "' OR 1=1 --";
  else if (type === "xss") password = "<script>alert('SOC_TEST')</script>";
  else if (type === "automation_tool") userAgent = "sqlmap/1.7#dev";
  else if (type === "bot_activity") userAgent = "python-requests/2.31.0";
  else if (type === "brute_force") password = "wrong_password_" + Math.floor(Math.random() * 9999);
  
  const riskScore = getRiskScore(type);
  const threatLevel = riskScore >= 5 ? "HIGH" : riskScore >= 3 ? "MEDIUM" : "LOW";
  const pattern = (
    type === "sql_injection" ? "Injection Attack" :
    type === "automation_tool" ? "Automated Bot" :
    type === "brute_force" ? "Credential Attack" :
    type === "bot_activity" ? "High Frequency Bot" :
    type === "xss" ? "Cross-Site Scripting" : "Suspicious Activity"
  );

  const testLog = {
    id: `EVT-${String(logs.length + 1).padStart(5, '0')}`,
    username,
    password,
    attackType: type,
    riskScore,
    threatLevel,
    pattern,
    ip: customIp,
    userAgent,
    time: new Date().toISOString()
  };

  logs.push(testLog);

  try {
    fs.writeFileSync(logsFilePath, JSON.stringify(logs, null, 2));
  } catch (err) {
    console.error("Error saving simulated log:", err);
  }

  res.json({
    success: true,
    message: `Simulated ${type.toUpperCase()} vector logged successfully`,
    incident: testLog
  });
});

// 4. Export CSV API
app.get('/api/export/csv', (req, res) => {
  res.setHeader('Content-Type', 'text/csv');
  res.setHeader('Content-Disposition', 'attachment; filename="honeypot_security_events.csv"');

  const headers = ['Event ID', 'Timestamp', 'IP Address', 'Attack Type', 'Risk Score', 'Threat Level', 'Pattern', 'Username', 'User Agent'];
  const rows = logs.map(l => [
    `"${l.id || ''}"`,
    `"${l.time || ''}"`,
    `"${l.ip || ''}"`,
    `"${l.attackType || ''}"`,
    `"${l.riskScore || 0}"`,
    `"${l.threatLevel || 'LOW'}"`,
    `"${l.pattern || ''}"`,
    `"${(l.username || '').replace(/"/g, '""')}"`,
    `"${(l.userAgent || '').replace(/"/g, '""')}"`
  ]);

  const csv = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
  res.send(csv);
});

// 5. System Status API
app.get('/api/system-status', (req, res) => {
  const memory = process.memoryUsage();
  res.json({
    status: "HEALTHY",
    uptime: Math.floor(process.uptime()),
    nodeVersion: process.version,
    totalLogs: logs.length,
    dbConnected: isDbConnected,
    memoryUsageMB: Math.round(memory.rss / (1024 * 1024)),
    activeSensors: 6,
    engine: "HONEYPOT AI DEFENSE MATRIX v2.4"
  });
});

// Route shortcuts
app.get('/dashboard', (req, res) => {
  res.redirect('/admin.html');
});

app.get('/soc', (req, res) => {
  res.redirect('/admin.html');
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
  console.log("==================================================");
  console.log("🛡️  HONEYPOT CYBERSECURITY PLATFORM v2.4 STARTED");
  console.log("==================================================");
  console.log(`🌐 3D Landing Page:    http://localhost:${PORT}/`);
  console.log(`📊 SOC Dashboard:      http://localhost:${PORT}/admin.html`);
  console.log(`🍯 Deception Portal:   http://localhost:${PORT}/login.html`);
  console.log(`⚡ API Endpoints:      http://localhost:${PORT}/api/overview`);
  console.log("==================================================");
});
