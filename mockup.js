import React, { useMemo, useState, useEffect } from "react";

// Warm, creamy color version - adapted onto your base, zero-dependency

const txns = [
  { id: "t1", date: "2025-08-05", desc: "Kroger Groceries", category: "Groceries", account: "Chase Checking", amount: -82.34 },
  { id: "t2", date: "2025-08-04", desc: "Spotify Family", category: "Subscriptions", account: "Amex Gold", amount: -16.99 },
  { id: "t3", date: "2025-08-04", desc: "Salary — Toyota", category: "Income", account: "Chase Checking", amount: 3100.0 },
  { id: "t4", date: "2025-08-03", desc: "Exxon Fuel", category: "Transport", account: "Amex Gold", amount: -48.2 },
  { id: "t5", date: "2025-08-02", desc: "Target — Home", category: "Home", account: "Chase Checking", amount: -59.91 },
];

const budgets = [
  { id: "b1", name: "Groceries", limit: 600, spent: 338 },
  { id: "b2", name: "Dining Out", limit: 250, spent: 198 },
  { id: "b3", name: "Transport", limit: 220, spent: 126 },
  { id: "b4", name: "Entertainment", limit: 150, spent: 95 },
];

const subscriptions = [
  { id: "s1", name: "Spotify Family", cost: 16.99, renews: "2025-08-15" },
  { id: "s2", name: "YouTube Premium", cost: 13.99, renews: "2025-08-18" },
  { id: "s3", name: "Notion Plus", cost: 8.0, renews: "2025-08-28" },
];

const accounts = [
  { id: "a1", name: "Chase Checking", type: "checking", balance: 4250.23 },
  { id: "a2", name: "Ally Savings", type: "savings", balance: 12250.5 },
  { id: "a3", name: "Amex Gold", type: "credit_card", balance: -745.78, apr: 24.99, creditLimit: 10000 },
  { id: "a4", name: "Auto Loan", type: "loan", balance: -14250.0, apr: 4.75 },
  { id: "a5", name: "Brokerage", type: "investment", balance: 15890.32 },
  { id: "a6", name: "Cash", type: "cash", balance: 120.0 },
];

const cashFlow = [
  { m: "Mar", in: 5200, out: 3700 },
  { m: "Apr", in: 5200, out: 3820 },
  { m: "May", in: 5200, out: 3960 },
  { m: "Jun", in: 5200, out: 4100 },
  { m: "Jul", in: 5200, out: 3890 },
  { m: "Aug", in: 5200, out: 3620 },
];

const spendByCat = [
  { name: "Groceries", value: 338, color: "#a855f7" },     // purple-500
  { name: "Dining", value: 198, color: "#14b8a6" },       // teal-500
  { name: "Transport", value: 126, color: "#f97316" },    // orange-500
  { name: "Home", value: 96, color: "#eab308" },         // yellow-600
  { name: "Other", value: 88, color: "#ec4899" },        // pink-500
];

const goals = [
  { id: "g1", name: "Emergency Fund", target: 10000, current: 6200, color: "#a855f7" },
  { id: "g2", name: "Travel", target: 3000, current: 1200, color: "#14b8a6" },
  { id: "g3", name: "Debt Free", target: 14250, current: 2000, color: "#ec4899" },
  { id: "g4", name: "New Laptop", target: 1800, current: 450, color: "#f97316" },
];

const accountMeta = {
  a3: { payBy: "2025-08-20", interestYTD: 129.45 },
  a4: { payBy: "2025-09-05", interestYTD: 432.1 },
};

const fmt = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" });
const shortDate = (iso) => new Date(iso + "T00:00:00").toLocaleDateString();
const netWorth = accounts.reduce((acc, a) => acc + a.balance, 0);

// helpers
const clampPercent = (n) => Math.max(0, Math.min(100, Number.isFinite(n) ? n : 0));
const fmtPct = (n) => `${clampPercent(n)}%`;

function polylinePoints(values, width, height) {
  const min = Math.min(...values);
  const max = Math.max(...values);
  return values
    .map((v, i) => {
      const x = (i / (values.length - 1)) * width;
      const y = height - ((v - min) / (max - min || 1)) * height;
      return `${x},${y}`;
    })
    .join(" ");
}

// LineSpark with warm gradient
function LineSpark({ data, width = 320, height = 120 }) {
  // Accept either objects with `.in` or raw numbers
  const values = data.map((d) => (typeof d === 'number' ? d : d.in));
  const denom = Math.max(1, values.length - 1);
  const min = Math.min(...values);
  const max = Math.max(...values);

  const coords = values.map((v, i) => {
    const x = (i / denom) * width;
    const y = height - ((v - min) / (max - min || 1)) * height;
    return [x, y];
  });

  const lineD = 'M ' + coords.map(([x, y]) => `${x} ${y}`).join(' L ');
  const areaD = `M 0 ${height} L ${coords.map(([x, y]) => `${x} ${y}`).join(' L ')} L ${width} ${height} Z`;

  const id = 'g-line-' + Math.random();
  const fillId = 'g-fill-' + Math.random();
  
  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full">
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#a855f7" stopOpacity="1">
            <animate attributeName="stop-color" values="#a855f7;#f97316;#a855f7" dur="4s" repeatCount="indefinite" />
          </stop>
          <stop offset="50%" stopColor="#f97316" stopOpacity="1">
            <animate attributeName="stop-color" values="#f97316;#14b8a6;#f97316" dur="4s" repeatCount="indefinite" />
          </stop>
          <stop offset="100%" stopColor="#14b8a6" stopOpacity="1">
            <animate attributeName="stop-color" values="#14b8a6;#a855f7;#14b8a6" dur="4s" repeatCount="indefinite" />
          </stop>
        </linearGradient>
        {/* Soft vertical fade under the line */}
        <linearGradient id={fillId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#a855f7" stopOpacity="0.25" />
          <stop offset="60%" stopColor="#f97316" stopOpacity="0.15" />
          <stop offset="100%" stopColor="#14b8a6" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={areaD} fill={`url(#${fillId})`} />
      <path 
        d={lineD}
        fill="none"
        stroke={`url(#${id})`}
        strokeWidth="3"
        strokeLinecap="round"
        style={{ filter: 'drop-shadow(0 2px 4px rgba(168, 85, 247, 0.2))' }}
      />
    </svg>
  );
}

// Donut with hover effects
function Donut({ segments, size = 160, thickness = 16 }) {
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const total = segments.reduce((a, s) => a + s.value, 0) || 1;
  const r = (size - thickness) / 2;
  const C = 2 * Math.PI * r;
  let offset = 0;
  
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <g transform={`translate(${size / 2}, ${size / 2})`}>
        <circle r={r} fill="none" stroke="#fef3c7" strokeWidth={thickness} opacity="0.5" />
        {segments.map((s, i) => {
          const len = (s.value / total) * C;
          const dash = `${len} ${C - len}`;
          const isHovered = hoveredIndex === i;
          const el = (
            <circle
              key={i}
              r={r}
              fill="none"
              stroke={s.color}
              strokeWidth={isHovered ? thickness + 4 : thickness}
              strokeDasharray={dash}
              strokeDashoffset={-offset}
              transform="rotate(-90)"
              style={{
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                filter: isHovered ? `drop-shadow(0 0 8px ${s.color}44)` : 'none',
                cursor: 'pointer'
              }}
              onMouseEnter={() => setHoveredIndex(i)}
              onMouseLeave={() => setHoveredIndex(null)}
            />
          );
          offset += len;
          return el;
        })}
      </g>
    </svg>
  );
}

// GoalRing with gradient
function GoalRing({ size = 56, thickness = 8, pct = 0, color = "#a855f7" }) {
  const r = (size - thickness) / 2;
  const C = 2 * Math.PI * r;
  const p = clampPercent(pct);
  const len = (p / 100) * C;
  const id = "goal-gradient-" + Math.random();
  
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <defs>
        <linearGradient id={id}>
          <stop offset="0%" stopColor={color} />
          <stop offset="100%" stopColor={color} stopOpacity="0.3" />
        </linearGradient>
      </defs>
      <g transform={`translate(${size / 2}, ${size / 2})`}>
        <circle r={r} fill="none" stroke="#fef3c7" strokeWidth={thickness} opacity="0.5" />
        <circle 
          r={r} 
          fill="none" 
          stroke={`url(#${id})`} 
          strokeWidth={thickness} 
          strokeDasharray={`${len} ${C - len}`} 
          transform="rotate(-90)"
          strokeLinecap="round"
          style={{
            transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
            filter: `drop-shadow(0 0 4px ${color}33)`
          }}
        />
        <text x="0" y="0" textAnchor="middle" dominantBaseline="middle" fill="#78716c" fontSize="14" fontWeight="bold">
          {Math.round(p)}%
        </text>
      </g>
    </svg>
  );
}

function BarMini({ label, value, max, color = "#a855f7" }) {
  const pct = Math.min(100, Math.round((value / (max || 1)) * 100));
  const [animatedWidth, setAnimatedWidth] = useState(0);
  
  useEffect(() => {
    const timer = setTimeout(() => setAnimatedWidth(pct), 100);
    return () => clearTimeout(timer);
  }, [pct]);
  
  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between text-xs">
        <span className="text-stone-600">{label}</span>
        <span className={pct >= 90 ? "text-rose-500 font-semibold" : "text-stone-500"}>{pct}%</span>
      </div>
      <div className="h-2 w-full rounded-full bg-amber-50 overflow-hidden">
        <div 
          className="h-full rounded-full transition-all duration-700 ease-out relative overflow-hidden"
          style={{ 
            width: `${animatedWidth}%`, 
            background: `linear-gradient(90deg, ${color}, ${color}dd)`,
            boxShadow: `inset 0 1px 2px ${color}22`
          }}
        >
          <div className="absolute inset-0 bg-white/30 animate-pulse" />
        </div>
      </div>
    </div>
  );
}

// ---------- dev smoke tests ----------
(function __smokeTests() {
  try {
    console.assert(fmtPct(50) === "50%", "fmtPct 50 failed");
    console.assert(fmtPct(120) === "100%", "fmtPct clamp high failed");
    console.assert(fmtPct(-5) === "0%", "fmtPct clamp low failed");
    const pts = polylinePoints([0, 10, 20], 100, 20);
    console.assert(pts.split(" ").length === 3, "polyline points count failed");

    // extra invariants
    const __assets = accounts.filter(a => a.balance > 0).reduce((s,a)=>s+a.balance, 0);
    const __debt = accounts.filter(a => a.balance < 0).reduce((s,a)=>s+Math.abs(a.balance), 0);
    const __spend7 = (()=>{
      const times = txns.map(t=>new Date(t.date+"T00:00:00").getTime());
      const max = Math.max(...times);
      const cutoff = max - 7*24*60*60*1000;
      return txns.filter(t=>new Date(t.date+"T00:00:00").getTime() >= cutoff && t.amount < 0)
                 .reduce((s,t)=>s+Math.abs(t.amount),0);
    })();
    console.assert(Math.abs(__assets - 32511.05) < 0.01, "assets sum failed");
    console.assert(Math.abs(__debt - 14995.78) < 0.01, "debt sum failed");
    console.assert(Math.abs(__spend7 - 207.44) < 0.01, "last7d spend failed");
    // net worth series sanity: last point equals current netWorth
    const __deltas = cashFlow.map(m => m.in - m.out);
    const __totalDelta = __deltas.reduce((a,b)=>a+b,0);
    const __start = netWorth - __totalDelta;
    let __acc = __start;
    const __series = __deltas.map(d => (__acc += d));
    console.assert(__series.length === cashFlow.length, "net worth series length failed");
    console.assert(Math.abs(__series[__series.length-1] - netWorth) < 0.01, "net worth last point mismatch");
  } catch (e) {
    console.error("Smoke tests error:", e);
  }
})();

export default function FinanceAppMockup() {
  const [tab, setTab] = useState("home");
  const [q, setQ] = useState("");
  const [notification, setNotification] = useState(null);
  
  const filteredTxns = useMemo(() => {
    if (!q.trim()) return txns;
    return txns.filter((t) => `${t.desc} ${t.category} ${t.account}`.toLowerCase().includes(q.toLowerCase()));
  }, [q]);

  const primaryActionLabel = {
    home: "Add Transaction",
    transactions: "Add Transaction",
    budgets: "New Budget",
    accounts: "New Account",
    insights: "Export Report",
  }[tab];

  // Derived finance quick stats for the wealth card
  const assetsTotal = useMemo(() => accounts.filter(a=>a.balance>0).reduce((s,a)=>s+a.balance,0), []);
  const debtTotal = useMemo(() => accounts.filter(a=>a.balance<0).reduce((s,a)=>s+Math.abs(a.balance),0), []);
  const cashOnHand = useMemo(() => accounts.filter(a=>['checking','savings','cash'].includes(a.type)).reduce((s,a)=>s+a.balance,0), []);
  const investmentTotal = useMemo(() => accounts.filter(a=>a.type==='investment').reduce((s,a)=>s+a.balance,0), []);
  const last7dSpend = useMemo(() => {
    const times = txns.map(t=>new Date(t.date+"T00:00:00").getTime());
    const max = Math.max(...times);
    const cutoff = max - 7*24*60*60*1000;
    return txns
      .filter(t=>new Date(t.date+"T00:00:00").getTime() >= cutoff && t.amount < 0)
      .reduce((s,t)=>s+Math.abs(t.amount),0);
  }, []);

  // Net worth over time (align to cashFlow months)
  const netWorthSeries = useMemo(() => {
    const deltas = cashFlow.map(m => m.in - m.out);
    const totalDelta = deltas.reduce((a,b)=>a+b,0);
    const start = netWorth - totalDelta;
    let acc = start;
    return deltas.map(d => (acc += d));
  }, []);
  const monthLabels = useMemo(() => cashFlow.map(m => m.m), []);

  // Show random notifications
  useEffect(() => {
    const notifications = [
      { text: "Budget Alert: 80% of Groceries spent", type: "warning" },
      { text: "Goal milestone: 50% reached!", type: "success" },
      { text: "New transaction categorized", type: "info" }
    ];
    
    const interval = setInterval(() => {
      const notif = notifications[Math.floor(Math.random() * notifications.length)];
      setNotification(notif);
      setTimeout(() => setNotification(null), 3000);
    }, 10000);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full min-h-[720px] grid place-items-center p-6 bg-stone-50 relative overflow-hidden">
      
      
      <div className="w-[390px] h-[780px] rounded-[32px] shadow-[0_20px_60px_rgba(251,146,60,0.2)] border border-orange-200/50 bg-gradient-to-b from-white/95 to-orange-50/30 backdrop-blur-xl overflow-hidden flex flex-col relative">
        
        {/* Dynamic notification banner */}
        {notification && (
          <div className="absolute top-14 left-4 right-4 z-50 animate-slide-down">
            <div className={`rounded-2xl px-4 py-3 backdrop-blur-xl border ${
              notification.type === 'warning' ? 'bg-amber-100/90 border-amber-300 text-amber-700' :
              notification.type === 'success' ? 'bg-emerald-100/90 border-emerald-300 text-emerald-700' :
              'bg-blue-100/90 border-blue-300 text-blue-700'
            } text-xs font-medium flex items-center justify-between gap-2 shadow-lg`}>
              <div className="flex items-center gap-2">
                <span>{notification.type === 'warning' ? '⚠️' : notification.type === 'success' ? '✨' : '💳'}</span>
                <span>{notification.text}</span>
              </div>
              <button
                aria-label="Dismiss notification"
                onClick={() => setNotification(null)}
                className="ml-2 shrink-0 rounded-full px-2 py-0.5 bg-white/50 hover:bg-white/70 border border-white/60 text-[10px] text-stone-700"
              >
                Dismiss
              </button>
            </div>
          </div>
        )}
        
        {/* Header */}
        <div className="px-5 pt-5 pb-3 border-b border-orange-200/30 bg-gradient-to-b from-white/80 to-transparent">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-lg font-bold tracking-tight text-stone-800">Personal Finance</h1>
              <p className="text-xs text-stone-500 flex items-center gap-2">
                <span className="w-2 h-2 bg-purple-500 rounded-full animate-pulse" />
                Manual Entry
              </p>
            </div>
            
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto p-4 scrollbar-thin scrollbar-thumb-orange-300 scrollbar-track-transparent">
          {tab === "home" && (
            <div className="space-y-4">
              {/* Wealth Card */}
              <div className="rounded-3xl border border-purple-200/50 bg-gradient-to-br from-purple-50/50 to-pink-50/30 backdrop-blur p-0 overflow-hidden group hover:shadow-xl transition-all duration-500">
                <div className="p-3 pb-0">
                  <div className="flex items-center gap-2 text-stone-600">
                    <svg className="w-4 h-4 text-purple-500" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M3 17l6-6 4 4 7-7v8h-2V9.41l-5 5-4-4L5 15.59V17H3z"/>
                    </svg>
                    <span className="text-sm font-medium">Total Wealth</span>
                    <span className="ml-auto text-xs text-emerald-600 font-semibold">+5.2%</span>
                  </div>
                  <div className="text-2xl font-bold tracking-tight text-stone-800 mt-1 leading-tight">
                    {fmt.format(netWorth)}
                  </div>

                  {/* micro-stat pills */}
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    <span className="text-[10px] px-2 py-0.5 rounded-full border border-purple-200/60 bg-white/70 text-stone-700">
                      Assets <b className="ml-1 text-stone-900">{fmt.format(assetsTotal)}</b>
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full border border-rose-200/60 bg-rose-50/60 text-rose-700">
                      Debt <b className="ml-1">{fmt.format(debtTotal)}</b>
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full border border-teal-200/60 bg-teal-50/60 text-teal-700">
                      Cash <b className="ml-1">{fmt.format(cashOnHand)}</b>
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full border border-stone-200/60 bg-white/60 text-stone-600">
                      {accounts.length} accts
                    </span>
                  </div>
                </div>
                <div className="px-3 pt-1 text-[10px] text-stone-500 flex items-center gap-2">
                  <span className="inline-block w-1.5 h-1.5 rounded-full bg-rose-400" />
                  Last 7d spend {fmt.format(last7dSpend)}
                </div>
                <div className="h-24 w-full p-2 bg-gradient-to-t from-purple-100/30 to-transparent">
                  <LineSpark data={netWorthSeries.map(v => ({ in: v }))} width={320} height={96} />
                </div>
                <div className="px-3 pb-2 text-[10px] text-stone-400 flex justify-between">
                  {monthLabels.map((m, i) => (
                    <span key={i}>{m}</span>
                  ))}
                </div>
              </div>

              {/* Renewals + Budgets */}
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-3xl border border-orange-200/50 bg-white/80 backdrop-blur p-4 hover:bg-white/90 hover:shadow-lg transition-all duration-300">
                  <div className="font-semibold mb-3 text-stone-800 flex items-center justify-between">
                    <span>Upcoming</span>
                    <svg className="w-4 h-4 text-stone-400" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M9 11H7v2h2v-2zm4 0h-2v2h2v-2zm4 0h-2v2h2v-2zm2-7h-1V2h-2v2H8V2H6v2H5c-1.11 0-1.99.9-1.99 2L3 20c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V9h14v11z"/>
                    </svg>
                  </div>
                  <div className="space-y-2">
                    {subscriptions.map((s) => (
                      <div key={s.id} className="flex items-center justify-between text-sm group/item hover:bg-orange-50 -mx-2 px-2 py-1 rounded-lg transition-colors">
                        <div className="flex items-center gap-2 text-stone-700">
                          <div className="w-2 h-2 bg-purple-500 rounded-full group-hover/item:animate-pulse" />
                          <span className="text-xs">{s.name}</span>
                        </div>
                        <div className="text-right">
                          <div className="text-[10px] text-stone-500">{shortDate(s.renews)}</div>
                          <div className="font-semibold text-stone-800">{fmt.format(s.cost)}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="rounded-3xl border border-orange-200/50 bg-white/80 backdrop-blur p-4 hover:bg-white/90 hover:shadow-lg transition-all duration-300">
                  <div className="font-semibold mb-3 text-stone-800 flex items-center justify-between">
                    <span>Budgets</span>
                    <span className="text-xs text-stone-500">This month</span>
                  </div>
                  <div className="space-y-3">
                    {budgets.slice(0,3).map((b, i) => (
                      <BarMini key={b.id} label={b.name} value={b.spent} max={b.limit} color={["#a855f7","#14b8a6","#f97316"][i%3]} />
                    ))}
                  </div>
                </div>

                <div className="col-span-2 rounded-3xl border border-orange-200/50 bg-white/80 backdrop-blur p-4">
                  <div className="font-semibold mb-3 text-stone-800">Quick Accounts</div>
                  <div className="grid grid-cols-2 gap-3">
                    {accounts.slice(0,4).map((a) => (
                      <div key={a.id} className="rounded-2xl border border-orange-100 bg-gradient-to-br from-white to-orange-50/50 p-3 hover:shadow-md hover:border-purple-200 transition-all duration-300 cursor-pointer group">
                        <div className="text-xs text-stone-600 group-hover:text-purple-600">{a.name}</div>
                        <div className={`text-sm font-bold mt-1 ${a.balance<0?"text-rose-500":"text-stone-800"}`}>
                          {fmt.format(a.balance)}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Goals Strip */}
              <div className="rounded-3xl border border-orange-200/50 bg-white/80 backdrop-blur p-4">
                <div className="font-semibold mb-3 text-stone-800 flex items-center justify-between">
                  <span>Goals</span>
                  <span className="text-xs text-purple-600">Track progress →</span>
                </div>
                <div className="flex gap-3 overflow-x-auto pb-1 scrollbar-none">
                  {goals.map((g) => {
                    const pct = Math.round(((g.current || 0) / (g.target || 1)) * 100);
                    const left = Math.max(0, (g.target || 0) - (g.current || 0));
                    return (
                      <div key={g.id} className="shrink-0 min-w-[180px] rounded-2xl border border-orange-100 bg-gradient-to-br from-white to-yellow-50/50 p-3 flex items-center gap-3 hover:shadow-md transition-all duration-300">
                        <div className="w-14 h-14">
                          <GoalRing pct={pct} color={g.color} />
                        </div>
                        <div>
                          <div className="text-sm font-semibold text-stone-800">{g.name}</div>
                          <div className="text-[11px] text-stone-600">
                            {left>0 ? `${fmt.format(left)} left` : "Completed! 🎉"}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {tab === "transactions" && (
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <div className="h-10 w-full rounded-full border border-orange-200 bg-white/80 backdrop-blur px-3 text-sm flex items-center">
                  <svg className="w-4 h-4 text-stone-500 mr-2" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0016 9.5 6.5 6.5 0 109.5 16a6.471 6.471 0 004.23-1.57l.27.28v.79L20 21.5 21.5 20 15.5 14zM9.5 14C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
                  </svg>
                  <input 
                    className="flex-1 bg-transparent outline-none text-stone-700 placeholder-stone-400" 
                    placeholder="Search transactions…" 
                    value={q} 
                    onChange={(e)=>setQ(e.target.value)} 
                  />
                </div>
                <button className="h-10 rounded-full border border-orange-200 bg-white/80 backdrop-blur px-4 text-sm text-stone-600 hover:bg-white transition-colors">
                  Filters
                </button>
              </div>

              {/* Swipe Tips Row */}
              <div className="flex gap-2 overflow-x-auto py-1">
                {[
                  { label: 'Swipe right: Categorize', icon: 'M5 12h14M5 12l4-4M5 12l4 4', color: 'text-emerald-500' },
                  { label: 'Swipe left: Delete', icon: 'M19 12H5m10-7l4 4m-4 0l4-4', color: 'text-rose-500' },
                  { label: 'Long-press: Split', icon: 'M12 5v14M5 12h14', color: 'text-purple-500' },
                ].map((t, i) => (
                  <div key={i} className="shrink-0 rounded-full border border-orange-200 bg-white/60 px-3 py-1 text-[11px] text-stone-600 flex items-center gap-2">
                    <svg className={`w-3.5 h-3.5 ${t.color}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d={t.icon} />
                    </svg>
                    {t.label}
                  </div>
                ))}
              </div>

              <div className="rounded-3xl border border-orange-200/50 bg-white/80 backdrop-blur p-4">
                <div className="space-y-3">
                  {filteredTxns.map((t) => (
                    <div key={t.id} className="flex items-center justify-between p-2 hover:bg-orange-50 rounded-xl transition-colors cursor-pointer group">
                      <div>
                        <div className="text-sm font-medium text-stone-800 tracking-tight group-hover:text-purple-600 transition-colors">
                          {t.desc}
                        </div>
                        <div className="text-[11px] text-stone-500">{shortDate(t.date)} · {t.account}</div>
                      </div>
                      <div className="text-right">
                        <div className="inline-block text-[10px] px-2 py-0.5 rounded-full border border-orange-200 bg-orange-50 text-stone-600">
                          {t.category}
                        </div>
                        <div className={`text-sm font-bold mt-1 ${t.amount<0?"text-rose-500":"text-emerald-600"}`}>
                          {fmt.format(t.amount)}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {tab === "budgets" && (
            <div className="space-y-3">
              <div className="rounded-3xl border border-orange-200/50 bg-white/80 backdrop-blur p-4">
                <div className="font-semibold mb-3 text-stone-800">This Month</div>
                <div className="grid grid-cols-4 gap-2 items-end h-40">
                  {budgets.map((b, i) => {
                    const pct = Math.min(100, Math.round((b.spent/b.limit)*100));
                    const colors = ["from-purple-400 to-purple-600","from-teal-400 to-teal-600","from-orange-400 to-orange-600","from-pink-400 to-pink-600"];
                    return (
                      <div key={b.id} className="flex flex-col items-center gap-1 group cursor-pointer">
                        <div className="w-12 bg-amber-100 rounded-t-md overflow-hidden relative h-32">
                          <div 
                            className={`w-full absolute bottom-0 bg-gradient-to-t ${colors[i%4]} group-hover:opacity-90 transition-all duration-500`} 
                            style={{ height: fmtPct(pct) }}
                          />
                        </div>
                        <div className="text-[11px] text-stone-600">{b.name}</div>
                      </div>
                    );
                  })}
                </div>
              </div>
              <div className="space-y-3">
                {budgets.map((b, i) => {
                  const pct = Math.min(100, Math.round((b.spent/b.limit)*100));
                  const colors = ["#a855f7","#14b8a6","#f97316"];
                  return (
                    <div key={b.id} className="rounded-3xl border border-orange-200/50 bg-white/80 backdrop-blur p-4 hover:shadow-lg transition-all duration-300">
                      <div className="flex items-center justify-between">
                        <div className="font-semibold text-stone-800">{b.name}</div>
                        <div className="text-sm text-stone-600">{fmt.format(b.spent)} / {fmt.format(b.limit)}</div>
                      </div>
                      <div className="h-2 w-full rounded-full bg-amber-50 mt-3 overflow-hidden">
                        <div 
                          className={`h-full rounded-full transition-all duration-700 ${pct>=100?"bg-rose-500":"bg-gradient-to-r"}`} 
                          style={{ 
                            width: fmtPct(pct),
                            background: pct >= 100 ? undefined : `linear-gradient(90deg, ${colors[i%3]}, ${colors[i%3]}aa)`,
                            boxShadow: `inset 0 1px 3px ${pct >= 100 ? '#ef4444' : colors[i%3]}22`
                          }} 
                        />
                      </div>
                      <div className={`text-[11px] mt-1 ${pct>=100?"text-rose-500 font-semibold":"text-stone-500"}`}>
                        {pct}% used {pct >= 100 && "⚠️"}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {tab === "accounts" && (
            <div className="grid grid-cols-2 gap-3">
              {accounts.map((a) => (
                <div key={a.id} className="rounded-3xl border border-orange-200/50 bg-white/80 backdrop-blur p-4 hover:shadow-lg hover:border-purple-300 transition-all duration-300 cursor-pointer group">
                  <div className="flex items-center justify-between">
                    <div className="text-sm font-semibold text-stone-800 group-hover:text-purple-600 transition-colors">
                      {a.name}
                    </div>
                    <svg className="w-4 h-4 text-stone-400 group-hover:text-purple-500 transition-colors" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M9 6l6 6-6 6"/>
                    </svg>
                  </div>
                  <div className={`mt-2 text-lg font-bold ${a.balance<0?"text-rose-500":"text-stone-800"}`}>
                    {fmt.format(a.balance)}
                  </div>
                  {a.apr && <div className="text-[11px] text-stone-500 mt-1">APR {a.apr}%</div>}
                  <div className="mt-2 flex flex-wrap items-center gap-2">
                    {(a.type === 'credit_card' || a.type === 'loan') && accountMeta[a.id]?.payBy && (
                      <span className="text-[10px] px-2 py-0.5 rounded-full border border-amber-300 bg-amber-50 text-amber-700">
                        Pay by {shortDate(accountMeta[a.id].payBy)}
                      </span>
                    )}
                    {(a.type === 'credit_card' || a.type === 'loan') && typeof accountMeta[a.id]?.interestYTD === 'number' && (
                      <span className="text-[10px] px-2 py-0.5 rounded-full border border-orange-200 bg-orange-50 text-stone-600">
                        Interest YTD {fmt.format(accountMeta[a.id].interestYTD)}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {tab === "insights" && (
            <div className="space-y-3">
              <div className="rounded-3xl border border-orange-200/50 bg-white/80 backdrop-blur p-4 flex items-center gap-4">
                <Donut segments={spendByCat} />
                <div className="space-y-2">
                  {spendByCat.map((s) => (
                    <div key={s.name} className="flex items-center gap-2 text-sm group cursor-pointer">
                      <span 
                        className="inline-block w-3 h-3 rounded-full transition-transform group-hover:scale-125" 
                        style={{ 
                          background: s.color,
                          boxShadow: `0 0 6px ${s.color}44`
                        }} 
                      />
                      <span className="text-stone-700 group-hover:text-stone-900 transition-colors">{s.name}</span>
                      <span className="text-stone-500 ml-auto">{s.value}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-3xl border border-orange-200/50 bg-white/80 backdrop-blur p-4">
                <div className="font-semibold mb-3 text-stone-800">Income vs Expense (6 mo)</div>
                <div className="grid grid-cols-6 gap-2 items-end h-40">
                  {cashFlow.map((m,i)=> (
                    <div key={i} className="flex flex-col items-center gap-1 group cursor-pointer">
                      <div className="w-6 bg-gradient-to-t from-teal-400 to-teal-500 rounded-sm group-hover:from-teal-300 group-hover:to-teal-400 transition-all duration-300" 
                           style={{ height: fmtPct((m.in/5500)*100) }} />
                      <div className="w-6 bg-gradient-to-t from-rose-400 to-rose-500 rounded-sm group-hover:from-rose-300 group-hover:to-rose-400 transition-all duration-300" 
                           style={{ height: fmtPct((m.out/5500)*100) }} />
                      <div className="text-[10px] text-stone-500">{m.m}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="rounded-2xl border border-orange-200/50 bg-white/80 backdrop-blur p-3 text-center hover:shadow-md transition-all duration-300 cursor-pointer group">
                  <div className="text-[11px] text-stone-500 group-hover:text-stone-600">Savings Rate</div>
                  <div className="text-lg font-bold text-emerald-600">28%</div>
                </div>
                <div className="rounded-2xl border border-orange-200/50 bg-white/80 backdrop-blur p-3 text-center hover:shadow-md transition-all duration-300 cursor-pointer group">
                  <div className="text-[11px] text-stone-500 group-hover:text-stone-600">DTI</div>
                  <div className="text-lg font-bold text-amber-600">21%</div>
                </div>
                <div className="rounded-2xl border border-orange-200/50 bg-white/80 backdrop-blur p-3 text-center hover:shadow-md transition-all duration-300 cursor-pointer group">
                  <div className="text-[11px] text-stone-500 group-hover:text-stone-600">Net Worth MoM</div>
                  <div className="text-lg font-bold text-purple-600">+$2.4k</div>
                </div>
              </div>
            </div>
          )}

          <div className="h-20" />
        </div>

        {/* FAB - Enhanced with warm gradient */}
        <button className="absolute bottom-20 right-5 h-12 px-4 rounded-full shadow-xl text-white text-sm flex items-center gap-2 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 transform hover:scale-105 transition-all duration-300 group">
          <svg className="w-4 h-4 group-hover:rotate-90 transition-transform duration-300" viewBox="0 0 24 24" fill="currentColor">
            <path d="M11 11V5h2v6h6v2h-6v6h-2v-6H5v-2z"/>
          </svg>
          {primaryActionLabel}
        </button>

        {/* Bottom Nav - Warm colors */}
        <nav className="h-16 sticky bottom-0 border-t border-orange-200/50 bg-white/90 backdrop-blur-xl grid grid-cols-5 text-[11px]">
          {[
            { key: "home", label: "Home", icon: "M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" },
            { key: "transactions", label: "Transactions", icon: "M3 6h18v2H3V6zm0 5h18v2H3v-2zm0 5h18v2H3v-2z" },
            { key: "budgets", label: "Budgets", icon: "M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" },
            { key: "accounts", label: "Accounts", icon: "M21 18v1c0 1.1-.9 2-2 2H5c-1.11 0-2-.9-2-2V5c0-1.1.89-2 2-2h14c1.1 0 2 .9 2 2v1h-9c-1.11 0-2 .9-2 2v8c0 1.1.89 2 2 2h9zm-9-2h10V8H12v8zm4-2.5c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5z" },
            { key: "insights", label: "Insights", icon: "M3 17h2v-7H3v7zm4 0h2V7H7v10zm4 0h2v-4h-2v4zm4 0h2V4h-2v13z" },
          ].map((t) => (
            <button 
              key={t.key} 
              onClick={() => setTab(t.key)} 
              className={`flex flex-col items-center justify-center gap-1 transition-all duration-300 ${
                tab===t.key
                  ?"text-purple-600"
                  :"text-stone-500 hover:text-stone-700"
              }`}
            >
              <svg className={`w-5 h-5 transition-all duration-300 ${tab===t.key?"text-purple-600":"text-stone-500"}`} viewBox="0 0 24 24" fill="currentColor">
                <path d={t.icon}/>
              </svg>
              <span className="transition-all duration-300">{t.label}</span>
              {tab === t.key && (
                <div className="absolute bottom-0 w-12 h-0.5 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full" />
              )}
            </button>
          ))}
        </nav>
      </div>
      
      <style jsx>{`
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
        @keyframes slide-down {
          from {
            opacity: 0;
            transform: translateY(-100%);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-slide-down {
          animation: slide-down 0.3s ease-out;
        }
        .scrollbar-thin::-webkit-scrollbar {
          width: 4px;
        }
        .scrollbar-thumb-orange-300::-webkit-scrollbar-thumb {
          background-color: rgb(253 186 116);
          border-radius: 2px;
        }
        .scrollbar-track-transparent::-webkit-scrollbar-track {
          background-color: transparent;
        }
        .scrollbar-none::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
}
