const express = require('express');
const session = require('express-session');
const bcrypt = require('bcryptjs');
const fs = require('fs');

const app = express();
const PORT = 3000;
const DB_FILE = 'stocknest_db.json';

// ==========================================
// 1. DATABASE & MARKET ENGINE
// ==========================================
let DB = { users: [] };
if (fs.existsSync(DB_FILE)) {
    try { DB = JSON.parse(fs.readFileSync(DB_FILE, 'utf8')); } 
    catch (e) { console.log(">> DB Reset."); }
}

const saveDB = () => fs.writeFileSync(DB_FILE, JSON.stringify(DB, null, 2));
const findUser = (id) => DB.users.find(u => String(u.id) === String(id));
const findUserByName = (name) => DB.users.find(u => u.username === name.toLowerCase());

const Market = {
   Stocks: {
    'RELIANCE': { price: 1419.60, vol: 0.002, history: [] },
    'TCS': { price: 2692.20, vol: 0.003, history: [] },
    'INFY': { price: 1369.10, vol: 0.004, history: [] },
    'WIPRO': { price: 214.09, vol: 0.004, history: [] },
    'HCLTECH': { price: 1455.20, vol: 0.003, history: [] },
    'PERSISTENT': { price: 5479.00, vol: 0.005, history: [] },
    'LTIM': { price: 5227.50, vol: 0.004, history: [] },
    'HDFCBANK': { price: 903.90, vol: 0.002, history: [] },
    'ICICIBANK': { price: 1414.60, vol: 0.003, history: [] },
    'SBIN': { price: 1198.60, vol: 0.004, history: [] },
    'KOTAKBANK': { price: 420.65, vol: 0.002, history: [] },
    'AXISBANK': { price: 1332.30, vol: 0.003, history: [] },
    'BAJFINANCE': { price: 1024.75, vol: 0.005, history: [] },
    'PNB': { price: 118.76, vol: 0.006, history: [] },
    'ZOMATO': { price: 380.25, vol: 0.015, history: [] },
    'TATAMOTORS': { price: 380.25, vol: 0.006, history: [] },
    'MARUTI': { price: 15237.00, vol: 0.002, history: [] },
    'EICHERMOT': { price: 8065.00, vol: 0.004, history: [] },
    'ITC': { price: 313.75, vol: 0.001, history: [] },
    'ASIANPAINT': { price: 2366.40, vol: 0.002, history: [] },
    'TITAN': { price: 4179.20, vol: 0.003, history: [] },
    'BRITANNIA': { price: 5980.50, vol: 0.002, history: [] },
    'LT': { price: 4173.90, vol: 0.003, history: [] },
    'ADANIENT': { price: 2136.60, vol: 0.010, history: [] },
    'POWERGRID': { price: 287.20, vol: 0.002, history: [] },
    'ONGC': { price: 267.40, vol: 0.003, history: [] },
    'TATASTEEL': { price: 203.18, vol: 0.004, history: [] },
    'JSWSTEEL': { price: 1232.00, vol: 0.004, history: [] },
    'HINDALCO': { price: 909.00, vol: 0.005, history: [] },
    'SUNPHARMA': { price: 1697.50, vol: 0.002, history: [] },
    'CIPLA': { price: 1331.50, vol: 0.003, history: [] },
    'DRREDDY': { price: 1268.10, vol: 0.003, history: [] },
    'APOLLOHOSP': { price: 7542.50, vol: 0.004, history: [] },
    'MRF': { price: 150105.00, vol: 0.001, history: [] },
    'BITCOIN': { price: 5200000.00, vol: 0.015, history: [] },
    'ETHEREUM': { price: 280000.00, vol: 0.020, history: [] }
},
   IPOs: [
        { name: 'Reliance Jio', price: 950 },
        { name: 'NSE India', price: 3200 },
        { name: 'Swiggy', price: 345 },
        { name: 'PhonePe', price: 880 },
        { name: 'Ola Electric', price: 76 },
        { name: 'Zepto', price: 420 },
        { name: 'boAt', price: 510 },
        { name: 'PhysicsWallah', price: 145 },
        { name: 'Ather Energy', price: 620 },
        { name: 'MobiKwik', price: 290 }
    ]
};

// Initialize History
for (let s in Market.Stocks) for(let i=0; i<30; i++) Market.Stocks[s].history.push(Market.Stocks[s].price);

// Live Market Heartbeat
setInterval(() => {
    for (let sym in Market.Stocks) {
        const s = Market.Stocks[sym];
        const move = s.price * s.vol * (Math.random() - 0.5);
        s.price = parseFloat((s.price + move).toFixed(2));
        s.history.push(s.price);
        if (s.history.length > 30) s.history.shift();
    }
}, 1000);

// ==========================================
// 2. MIDDLEWARE & SESSION
// ==========================================
app.use(express.urlencoded({ extended: true }));
app.use(session({ 
    secret: 'stocknest_ultra_secret', resave: true, saveUninitialized: true, 
    cookie: { maxAge: 86400000, secure: false } 
}));

const protect = (req, res, next) => {
    if (req.session.userId && findUser(req.session.userId)) return next();
    res.redirect('/login');
};

// ==========================================
// 4. FUNCTIONAL ROUTES
// ==========================================

app.get('/', (req, res) => res.redirect('/dashboard'));

// --- Import UI Template ---
const { Layout, AuthPages, DashPage, MarketPage, BankPage, IPOPage, PortPage } = require('./frontend');

app.get('/login', (req, res) => res.send(AuthPages.login));
app.get('/register', (req, res) => res.send(AuthPages.register));

app.post('/register', async (req, res) => { 
    const hash = await bcrypt.hash(req.body.password, 10); 
    DB.users.push({ id: Date.now().toString(), username: req.body.username.toLowerCase(), password: hash, cash: 100000, holdings: [], transactions: [] }); 
    saveDB(); res.redirect('/login'); 
});

app.post('/login', async (req, res) => { 
    const user = findUserByName(req.body.username); 
    if(user && await bcrypt.compare(req.body.password, user.password)) { 
        req.session.userId = user.id; 
        req.session.save(() => res.redirect('/dashboard')); 
    } else res.redirect('/login?error=1');
});

app.get('/dashboard', protect, (req, res) => {
    const user = findUser(req.session.userId);
    res.send(DashPage(user, Market));
});

app.get('/market', protect, (req, res) => {
    const user = findUser(req.session.userId);
    res.send(MarketPage(user, Market));
});

app.get('/banking', protect, (req, res) => {
    const user = findUser(req.session.userId);
    res.send(BankPage(user));
});

app.post('/banking', protect, (req, res) => {
    const user = findUser(req.session.userId);
    const amt = parseFloat(req.body.amount);
    if(req.body.type === 'DEPOSIT') {
        user.cash += amt;
        user.transactions.push({ type: 'DEPOSIT', symbol: 'CASH', qty: 1, price: amt, date: Date.now() });
    } else if (user.cash >= amt) {
        user.cash -= amt;
        user.transactions.push({ type: 'WITHDRAW', symbol: 'CASH', qty: 1, price: amt, date: Date.now() });
    }
    saveDB(); res.redirect('/banking');
});

app.get('/ipo', protect, (req, res) => {
    const user = findUser(req.session.userId);
    res.send(IPOPage(user, Market));
});

app.post('/ipo', protect, (req, res) => {
    const user = findUser(req.session.userId);
    const price = parseFloat(req.body.price);
    const units = 10;
    if(user.cash >= price * units) {
        user.cash -= (price * units);
        let h = user.holdings.find(x => x.symbol === req.body.name);
        if(h) { h.avg = ((h.avg * h.qty) + (units * price)) / (h.qty + units); h.qty += units; }
        else user.holdings.push({ symbol: req.body.name, qty: units, avg: price });
        user.transactions.push({ type: 'IPO_SUB', symbol: req.body.name, qty: units, price: price, date: Date.now() });
        saveDB();
    }
    res.redirect('/dashboard');
});

app.get('/portfolio', protect, (req, res) => {
    const user = findUser(req.session.userId);
    res.send(PortPage(user, Market));
});

app.post('/trade', protect, (req, res) => {
    const { symbol, qty, action } = req.body;
    const user = findUser(req.session.userId);
    const q = parseInt(qty); const p = Market.Stocks[symbol]?.price;
    if(action === 'BUY' && user.cash >= q * p) {
        user.cash -= (q * p);
        let h = user.holdings.find(x => x.symbol === symbol);
        if(h) { h.avg = ((h.avg * h.qty) + (q * p)) / (h.qty + q); h.qty += q; }
        else user.holdings.push({ symbol, qty: q, avg: p });
        user.transactions.push({ type: 'BUY', symbol, qty: q, price: p, date: Date.now() });
    } else if (action === 'SELL') {
        let h = user.holdings.find(x => x.symbol === symbol);
        if(h && h.qty >= q) {
            user.cash += (q * p); h.qty -= q;
            if(h.qty === 0) user.holdings = user.holdings.filter(x => x.symbol !== symbol);
            user.transactions.push({ type: 'SELL', symbol, qty: q, price: p, date: Date.now() });
        }
    }
    saveDB(); res.redirect('/dashboard');
});

app.get('/api/chart/:symbol', (req, res) => res.json(Market.Stocks[req.params.symbol]?.history || []));
app.get('/logout', (req, res) => { req.session.destroy(); res.redirect('/login'); });

app.listen(PORT, () => console.log(`🚀 StockNest Terminal Online: http://localhost:${PORT}`));