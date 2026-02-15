const Layout = (content, user, activePage, script = '') => `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>StockNest | ${activePage}</title>
    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
    <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;600;800&family=JetBrains+Mono&display=swap" rel="stylesheet">
    <style>
        :root { 
            --bg: #020617; --nav: rgba(15, 23, 42, 0.9); --card: rgba(30, 41, 59, 0.4); 
            --border: rgba(255,255,255,0.08); --primary: #6366f1; --accent: #8b5cf6;
            --success: #10b981; --danger: #ef4444; --text: #f8fafc; --muted: #94a3b8;
        }
        * { box-sizing: border-box; font-family: 'Outfit', sans-serif; margin: 0; padding: 0; }
        body { background: var(--bg); color: var(--text); overflow-x: hidden; min-height: 100vh;
               background-image: radial-gradient(circle at 50% -20%, #1e1b4b 0%, var(--bg) 80%); }
        .navbar { display: flex; justify-content: space-between; align-items: center; padding: 0 50px; height: 80px; 
                  background: var(--nav); backdrop-filter: blur(15px); border-bottom: 1px solid var(--border); position: sticky; top:0; z-index: 1000; }
        .logo { font-size: 22px; font-weight: 800; letter-spacing: -1px; color: #fff; text-transform: uppercase; }
        .logo span { color: var(--primary); }
        .nav-links { display: flex; gap: 30px; }
        .nav-item { color: var(--muted); text-decoration: none; font-weight: 500; font-size: 14px; transition: 0.3s; position: relative; }
        .nav-item:hover, .nav-item.active { color: #fff; }
        .nav-item.active::after { content: ''; position: absolute; bottom: -31px; left: 0; width: 100%; height: 3px; background: var(--primary); box-shadow: 0 0 15px var(--primary); }
        .container { max-width: 1300px; margin: 0 auto; padding: 40px; }
        .card { background: var(--card); border: 1px solid var(--border); border-radius: 20px; padding: 30px; backdrop-filter: blur(10px); height: 100%; box-shadow: 0 20px 50px rgba(0,0,0,0.3); }
        .grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(350px, 1fr)); gap: 25px; margin-bottom: 25px; }
        .btn { padding: 14px 24px; border-radius: 12px; border: none; font-weight: 700; cursor: pointer; color: #fff; transition: 0.3s; text-transform: uppercase; font-size: 12px; letter-spacing: 1px; }
        .btn-success { background: linear-gradient(135deg, #10b981, #059669); }
        .btn-danger { background: linear-gradient(135deg, #ef4444, #dc2626); }
        .btn:hover { transform: translateY(-3px); box-shadow: 0 10px 20px rgba(0,0,0,0.2); filter: brightness(1.2); }
        input, select { background: rgba(0,0,0,0.3); border: 1px solid var(--border); color: #fff; padding: 14px; border-radius: 10px; width: 100%; margin-bottom: 15px; outline: none; }
        input:focus { border-color: var(--primary); background: rgba(0,0,0,0.5); }
        table { width: 100%; border-collapse: collapse; }
        th { text-align: left; font-size: 11px; color: var(--muted); text-transform: uppercase; letter-spacing: 1px; padding-bottom: 15px; }
        td { padding: 16px 0; border-top: 1px solid var(--border); font-size: 14px; }
        .mono { font-family: 'JetBrains Mono', monospace; }
        .badge { padding: 4px 10px; border-radius: 6px; font-size: 10px; font-weight: 800; }
        .badge-buy { background: rgba(16, 185, 129, 0.1); color: var(--success); }
        .badge-sell { background: rgba(239, 68, 68, 0.1); color: var(--danger); }
    </style>
</head>
<body>
    <nav class="navbar">
        <div class="logo">STOCK<span>NEST</span></div>
        <div class="nav-links">
            <a href="/dashboard" class="nav-item ${activePage==='Dash'?'active':''}">Dashboard</a>
            <a href="/market" class="nav-item ${activePage==='Market'?'active':''}">Market</a>
            <a href="/portfolio" class="nav-item ${activePage==='Port'?'active':''}">Portfolio</a>
            <a href="/banking" class="nav-item ${activePage==='Bank'?'active':''}">Banking</a>
            <a href="/ipo" class="nav-item ${activePage==='IPO'?'active':''}">IPOs</a>
        </div>
        <div style="display:flex; align-items:center; gap:20px">
            <div style="text-align:right"><div style="font-size:10px; color:var(--muted)">BALANCE</div><div class="mono" style="color:var(--success); font-weight:800">₹${user.cash.toLocaleString()}</div></div>
            <a href="/logout" class="btn" style="background:rgba(239,68,68,0.1); color:var(--danger); padding:8px 15px; border:1px solid rgba(239,68,68,0.2)">Logout</a>
        </div>
    </nav>
    <div class="container">${content}</div>
    <script>${script}</script>
</body>
</html>
`;

module.exports = {
    Layout,
    AuthPages: {
        login: `<html><head><link href="https://fonts.googleapis.com/css2?family=Outfit&display=swap" rel="stylesheet"></head>
                <body style="background:#020617; color:#fff; display:flex; justify-content:center; align-items:center; height:100vh; font-family:'Outfit';">
                    <div style="background:rgba(30,41,59,0.5); padding:50px; border-radius:30px; border:1px solid rgba(255,255,255,0.1); width:400px; text-align:center; backdrop-filter:blur(20px);">
                        <h1 style="margin-bottom:10px; font-weight:800; letter-spacing:-1px; text-transform:uppercase;">STOCK<span>NEST</span></h1>
                        <p style="color:#64748b; margin-bottom:30px; font-size:14px;">Enterprise Trading Terminal</p>
                        <form action="/login" method="POST">
                            <input name="username" placeholder="Username" required style="background:#000; border:1px solid #334155; color:#fff; padding:15px; width:100%; border-radius:12px; margin-bottom:15px;">
                            <input name="password" type="password" placeholder="Password" required style="background:#000; border:1px solid #334155; color:#fff; padding:15px; width:100%; border-radius:12px; margin-bottom:25px;">
                            <button style="width:100%; padding:15px; background:#6366f1; border:none; color:#fff; border-radius:12px; font-weight:800; cursor:pointer;">SIGN IN</button>
                        </form>
                        <p style="margin-top:20px; font-size:12px; color:#64748b">New operative? <a href="/register" style="color:#6366f1; text-decoration:none;">Register Terminal</a></p>
                    </div>
                </body></html>`,
        register: `<html><head><link href="https://fonts.googleapis.com/css2?family=Outfit&display=swap" rel="stylesheet"></head>
                   <body style="background:#020617; color:#fff; display:flex; justify-content:center; align-items:center; height:100vh; font-family:'Outfit';">
                    <div style="background:rgba(30,41,59,0.5); padding:50px; border-radius:30px; border:1px solid rgba(255,255,255,0.1); width:400px; text-align:center; backdrop-filter:blur(20px);">
                        <h2 style="margin-bottom:10px; font-weight:800;">Register Terminal</h2>
                        <form action="/register" method="POST">
                            <input name="username" placeholder="Choose Username" required style="background:#000; border:1px solid #334155; color:#fff; padding:15px; width:100%; border-radius:12px; margin:15px 0;">
                            <input name="password" type="password" placeholder="Set Password" required style="background:#000; border:1px solid #334155; color:#fff; padding:15px; width:100%; border-radius:12px; margin-bottom:25px;">
                            <button style="width:100%; padding:15px; background:#10b981; border:none; color:#fff; border-radius:12px; font-weight:800; cursor:pointer;">CREATE ACCOUNT</button>
                        </form>
                        <a href="/login" style="color:#64748b; font-size:12px; text-decoration:none;">Back to Login</a>
                    </div>
                   </body></html>`
    },
    DashPage: (user, Market) => {
        let invested = 0, current = 0;
        user.holdings.forEach(h => {
            let price = Market.Stocks[h.symbol]?.price || 0;
            invested += h.qty * h.avg;
            current += h.qty * price;
        });
        return Layout(`
            <h2 style="margin-bottom:30px; font-weight:800;">Portfolio Overview</h2>
            <div class="grid">
                <div class="card">
                    <p style="color:var(--muted); font-size:12px; font-weight:700;">TOTAL LIQUIDITY</p>
                    <h1 class="mono" style="margin:10px 0; font-size:36px;">₹${(user.cash + current).toLocaleString()}</h1>
                    <p style="font-size:13px; color:var(--success)">+₹${(current - invested).toLocaleString()} Growth Performance</p>
                </div>
                <div class="card">
                    <h3>Market Pulse</h3>
                    <div style="display:flex; flex-direction:column; gap:12px; margin-top:15px;">
                        ${Object.keys(Market.Stocks).slice(0, 3).map(s => `
                            <div style="display:flex; justify-content:space-between"><span>${s}</span><span class="mono">₹${Market.Stocks[s].price}</span></div>
                        `).join('')}
                    </div>
                </div>
            </div>
            <div class="card" style="margin-top:25px">
                <h3>Transaction Ledger</h3>
                <table>
                    <thead><tr><th>Type</th><th>Security</th><th>Qty</th><th>Price</th></tr></thead>
                    <tbody>
                        ${user.transactions.slice(-6).reverse().map(t => `
                            <tr><td><span class="badge ${t.type.includes('BUY')?'badge-buy':'badge-sell'}">${t.type}</span></td><td>${t.symbol}</td><td>${t.qty}</td><td class="mono">₹${(t.price||0).toLocaleString()}</td></tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>`, user, 'Dash');
    },
    MarketPage: (user, Market) => Layout(`
        <div class="grid" style="grid-template-columns: 2.5fr 1fr">
            <div class="card">
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:25px">
                    <h3>Live Trading Terminal</h3>
                    <select id="chartSym" style="width:180px; margin:0" onchange="updateChart()">
                        ${Object.keys(Market.Stocks).map(s => `<option value="${s}">${s}</option>`).join('')}
                    </select>
                </div>
                <div style="height:400px"><canvas id="liveChart"></canvas></div>
            </div>
            <div class="card">
                <h3>Execution Desk</h3>
                <form action="/trade" method="POST" style="margin-top:20px">
                    <label style="font-size:11px; color:var(--muted); display:block; margin-bottom:8px">SECURITY</label>
                    <select name="symbol" id="tradeSym">
                        ${Object.keys(Market.Stocks).map(s => `<option value="${s}">${s}</option>`).join('')}
                    </select>
                    <label style="font-size:11px; color:var(--muted); display:block; margin-bottom:8px">UNITS</label>
                    <input name="qty" type="number" value="1" min="1">
                    <div style="display:grid; grid-template-columns: 1fr 1fr; gap:15px; margin-top:10px">
                        <button name="action" value="BUY" class="btn btn-success">BUY / LONG</button>
                        <button name="action" value="SELL" class="btn btn-danger">SELL / SHORT</button>
                    </div>
                </form>
            </div>
        </div>`, user, 'Market', `
        let chart;
        const ctx = document.getElementById('liveChart').getContext('2d');
        async function updateChart() {
            const sym = document.getElementById('chartSym').value;
            const res = await fetch('/api/chart/' + sym);
            const data = await res.json();
            if(!chart || chart.data.datasets[0].label !== sym) {
                if(chart) chart.destroy();
                const grad = ctx.createLinearGradient(0, 0, 0, 400);
                grad.addColorStop(0, 'rgba(99, 102, 241, 0.4)'); grad.addColorStop(1, 'rgba(99, 102, 241, 0)');
                chart = new Chart(ctx, {
                    type: 'line',
                    data: { labels: Array(30).fill(''), datasets: [{ label: sym, data: data, borderColor: '#6366f1', borderWidth: 3, fill: true, backgroundColor: grad, tension: 0.4, pointRadius: 0 }] },
                    options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { y: { grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: '#64748b' } }, x: { display: false } }, animation: { duration: 0 } }
                });
            } else { chart.data.datasets[0].data = data; chart.update(); }
        }
        setInterval(updateChart, 1000); updateChart();`),
    BankPage: (user) => Layout(`
        <div class="card" style="max-width:450px; margin: 50px auto; text-align:center">
            <h3 style="margin-bottom:10px">Secure Capital Vault</h3>
            <p style="color:var(--muted); font-size:14px">Manage Liquid Reserves</p>
            <div class="mono" style="font-size:48px; margin:30px 0; font-weight:800; color:var(--success)">₹${user.cash.toLocaleString()}</div>
            <form action="/banking" method="POST">
                <input name="amount" type="number" placeholder="Enter Transaction Value" required min="1">
                <div style="display:grid; grid-template-columns:1fr 1fr; gap:15px">
                    <button name="type" value="DEPOSIT" class="btn btn-success">Deposit</button>
                    <button name="type" value="WITHDRAW" class="btn btn-danger">Withdraw</button>
                </div>
            </form>
        </div>`, user, 'Bank'),
    IPOPage: (user, Market) => Layout(`
        <h2 style="margin-bottom:30px; font-weight:800">Primary Market Subscriptions</h2>
        <div class="grid">
            ${Market.IPOs.map(i => `
                <div class="card" style="text-align:center">
                    <div style="color:var(--primary); font-size:10px; font-weight:800; letter-spacing:2px">OPEN OFFER</div>
                    <h2 style="margin:15px 0">${i.name}</h2>
                    <div class="mono" style="font-size:22px; margin-bottom:25px">Lot Price: ₹${i.price}</div>
                    <form action="/ipo" method="POST">
                        <input type="hidden" name="name" value="${i.name}">
                        <input type="hidden" name="price" value="${i.price}">
                        <button class="btn btn-success" style="width:100%">SUBSCRIBE (10 UNITS)</button>
                    </form>
                </div>`).join('')}
        </div>`, user, 'IPO'),
    PortPage: (user, Market) => Layout(`
        <div class="card">
            <h3>Asset Inventory</h3>
            <table style="margin-top:20px">
                <thead><tr><th>Security</th><th>Units</th><th>Avg Cost</th><th>Live Value</th><th>Return</th></tr></thead>
                <tbody>
                    ${user.holdings.map(h => {
                        const live = Market.Stocks[h.symbol]?.price || h.avg;
                        const pnl = (live - h.avg) * h.qty;
                        return `<tr><td><b>${h.symbol}</b></td><td>${h.qty}</td><td>₹${h.avg.toFixed(2)}</td><td class="mono">₹${live}</td><td class="mono" style="color:${pnl>=0?'var(--success)':'var(--danger)'}; font-weight:700">₹${pnl.toFixed(2)}</td></tr>`;
                    }).join('')}
                </tbody>
            </table>
        </div>`, user, 'Port')
};