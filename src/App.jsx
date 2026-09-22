import { useEffect, useMemo, useState } from "react"
import "./App.css"

const money = (value) =>
  new Intl.NumberFormat("es-DO", {
    style: "currency",
    currency: "DOP",
    minimumFractionDigits: 2,
  }).format(Number(value || 0))

const localDate = (date = new Date()) =>
  `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(
    date.getDate()
  ).padStart(2, "0")}`

const today = localDate()

const initialClients = [
  {
    id: 1,
    name: "María Rodríguez",
    phone: "809-555-0142",
    email: "maria@email.com",
    createdAt: today,
  },
  {
    id: 2,
    name: "Carlos Méndez",
    phone: "829-555-0198",
    email: "carlos@email.com",
    createdAt: today,
  },
]

const initialDebts = [
  {
    id: 1,
    clientId: 1,
    concept: "Compra de mercancía",
    amount: 12500,
    dueDate: "2026-09-20",
    createdAt: today,
  },
  {
    id: 2,
    clientId: 2,
    concept: "Servicio mensual",
    amount: 7800,
    dueDate: "2026-09-25",
    createdAt: today,
  },
]

const PLAN_LIMITS = {
  Gratis: { maxClients: 20, reminders: false },
  Pro: { maxClients: Infinity, reminders: true },
  Negocio: { maxClients: Infinity, reminders: true },
}

function Logo({ collapsed = false }) {
  return (
    <div className={`brand ${collapsed ? "brand-small" : ""}`} aria-label="Kobri">
      <div className="brand-mark">
      <svg viewBox="0 0 64 64" aria-hidden="true" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="kobriTile" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stopColor="#FFFFFF" />
      <stop offset="55%" stopColor="#F4F6FB" />
      <stop offset="100%" stopColor="#DDE3F0" />
    </linearGradient>
    <linearGradient id="kobriK" x1="0.1" y1="1" x2="0.95" y2="0">
      <stop offset="0%" stopColor="#0038F0" />
      <stop offset="55%" stopColor="#0B57F5" />
      <stop offset="100%" stopColor="#2E86FF" />
    </linearGradient>
  </defs>
  <rect x="1" y="1" width="62" height="62" rx="15" fill="url(#kobriTile)" stroke="#E6EAF3" />
  <rect x="17" y="12" width="9" height="39" rx="2.5" fill="#0B1324" />
  <path d="M26 26 L40 10 L54 10 L34 33 L54 52 L40 52 L26 38 Z" fill="url(#kobriK)" />
</svg>
      </div>
      {!collapsed && (
        <div className="brand-copy">
          <span>KOBRI</span>
          <small>COBRANZAS · CONTROL</small>
        </div>
      )}
    </div>
  )
}

function Icon({ name, size = 20 }) {
  const common = {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.8,
    strokeLinecap: "round",
    strokeLinejoin: "round",
  }

  const icons = {
    home: (
      <>
        <path d="m3 10 9-7 9 7" />
        <path d="M5 9v11h14V9" />
        <path d="M9 20v-6h6v6" />
      </>
    ),
    users: (
      <>
        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </>
    ),
    wallet: (
      <>
        <path d="M4 7V5a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v2" />
        <path d="M4 7h15a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2Z" />
        <path d="M16 14h.01" />
      </>
    ),
    card: (
      <>
        <rect x="2" y="5" width="20" height="14" rx="2" />
        <path d="M2 10h20" />
      </>
    ),
    bell: (
      <>
        <path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9" />
        <path d="M10 21h4" />
      </>
    ),
    sun: (
      <>
        <circle cx="12" cy="12" r="4" />
        <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
      </>
    ),
    moon: (
      <>
        <path d="M20.5 15.2A8.5 8.5 0 0 1 8.8 3.5 8.6 8.6 0 1 0 20.5 15.2Z" />
      </>
    ),
    search: (
      <>
        <circle cx="11" cy="11" r="7" />
        <path d="m20 20-4-4" />
      </>
    ),
    plus: (
      <>
        <path d="M12 5v14" />
        <path d="M5 12h14" />
      </>
    ),
    arrow: (
      <>
        <path d="M5 12h14" />
        <path d="m13 6 6 6-6 6" />
      </>
    ),
    trend: (
      <>
        <path d="m3 17 6-6 4 4 8-9" />
        <path d="M15 6h6v6" />
      </>
    ),
    calendar: (
      <>
        <rect x="3" y="4" width="18" height="17" rx="2" />
        <path d="M16 2v4M8 2v4M3 10h18" />
      </>
    ),
    more: (
      <>
        <circle cx="5" cy="12" r="1" fill="currentColor" />
        <circle cx="12" cy="12" r="1" fill="currentColor" />
        <circle cx="19" cy="12" r="1" fill="currentColor" />
      </>
    ),
    close: (
      <>
        <path d="m6 6 12 12M18 6 6 18" />
      </>
    ),
    check: (
      <>
        <path d="m5 12 4 4L19 6" />
      </>
    ),
    dollar: (
      <>
        <path d="M12 2v20" />
        <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H7" />
      </>
    ),
    menu: (
      <>
        <path d="M4 6h16M4 12h16M4 18h16" />
      </>
    ),
    settings: (
      <>
        <path d="M12.2 3h-.4a1.9 1.9 0 0 0-1.9 1.9v.2a1.9 1.9 0 0 1-.95 1.64l-.5.29a1.9 1.9 0 0 1-1.9 0l-.16-.1a1.9 1.9 0 0 0-2.6.7l-.2.35a1.9 1.9 0 0 0 .7 2.6l.16.1a1.9 1.9 0 0 1 .95 1.63v.58a1.9 1.9 0 0 1-.95 1.64l-.16.09a1.9 1.9 0 0 0-.7 2.6l.2.35a1.9 1.9 0 0 0 2.6.7l.16-.1a1.9 1.9 0 0 1 1.9 0l.5.29a1.9 1.9 0 0 1 .95 1.64v.2A1.9 1.9 0 0 0 11.8 21h.4a1.9 1.9 0 0 0 1.9-1.9v-.2a1.9 1.9 0 0 1 .95-1.64l.5-.29a1.9 1.9 0 0 1 1.9 0l.16.1a1.9 1.9 0 0 0 2.6-.7l.2-.35a1.9 1.9 0 0 0-.7-2.6l-.16-.09a1.9 1.9 0 0 1-.95-1.64v-.58a1.9 1.9 0 0 1 .95-1.63l.16-.1a1.9 1.9 0 0 0 .7-2.6l-.2-.35a1.9 1.9 0 0 0-2.6-.7l-.16.1a1.9 1.9 0 0 1-1.9 0l-.5-.29a1.9 1.9 0 0 1-.95-1.64v-.2A1.9 1.9 0 0 0 12.2 3Z" />
        <circle cx="12" cy="12" r="3" />
      </>
    ),
  }

  return <svg {...common}>{icons[name] || icons.more}</svg>
}

function getStatus(debt, paid) {
  if (paid >= debt.amount) {
    return { label: "Pagada", className: "paid" }
  }

  if (debt.dueDate < today) {
    return { label: "Vencida", className: "overdue" }
  }

  return { label: "Pendiente", className: "pending" }
}

const DAY_MS = 86400000

function daysUntil(dateString) {
  const due = new Date(`${dateString}T12:00:00`)
  const now = new Date(`${today}T12:00:00`)
  return Math.round((due - now) / DAY_MS)
}

function dueLabel(days) {
  if (days < -1) return `Vencida hace ${Math.abs(days)} días`
  if (days === -1) return "Vencida ayer"
  if (days === 0) return "Vence hoy"
  if (days === 1) return "Vence mañana"
  return `Vence en ${days} días`
}

function greeting() {
  const hour = new Date().getHours()
  if (hour < 12) return "Buenos días"
  if (hour < 19) return "Buenas tardes"
  return "Buenas noches"
}

function avatarTone(name = "") {
  let sum = 0
  for (const char of name) sum += char.charCodeAt(0)
  return sum % 6
}

function Progress({ value, tone = "accent" }) {
  const safe = Math.min(Math.max(Number(value) || 0, 0), 100)

  return (
    <div
      className={`progress ${tone}`}
      role="progressbar"
      aria-valuenow={safe}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      <i style={{ width: `${safe}%` }} />
    </div>
  )
}

function Ring({ percent }) {
  const radius = 46
  const circumference = 2 * Math.PI * radius
  const safe = Math.min(Math.max(percent, 0), 100)
  const offset = circumference - (safe / 100) * circumference

  return (
    <div className="ring" role="img" aria-label={`${safe}% cobrado`}>
      <svg viewBox="0 0 120 120" aria-hidden="true">
        <defs>
          <linearGradient id="kobri-ring" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#8aa4ff" />
            <stop offset="100%" stopColor="#4fe0b0" />
          </linearGradient>
        </defs>
        <circle className="ring-track" cx="60" cy="60" r={radius} />
        <circle
          className="ring-value"
          cx="60"
          cy="60"
          r={radius}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{ "--ring-full": circumference }}
        />
      </svg>
      <div className="ring-label">
        <strong>{safe}%</strong>
        <span>{safe === 0 ? "sin cobros" : "cobrado"}</span>
      </div>
    </div>
  )
}

function App() {
  const [activeView, setActiveView] = useState("dashboard")
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [showDebtModal, setShowDebtModal] = useState(false)
  const [showClientModal, setShowClientModal] = useState(false)
  const [showPaymentModal, setShowPaymentModal] = useState(false)
  const [showNotifications, setShowNotifications] = useState(false)
  const [showHelpModal, setShowHelpModal] = useState(false)
  const [theme, setTheme] = useState(() => localStorage.getItem("kobri_theme") || "light")
  const [showSettings, setShowSettings] = useState(false)
  const [showAccount, setShowAccount] = useState(false)
  const [showPlans, setShowPlans] = useState(false)
  const [showClientDetail, setShowClientDetail] = useState(false)
  const [showDebtDetail, setShowDebtDetail] = useState(false)
  const [selectedDebt, setSelectedDebt] = useState(null)
  const [selectedClient, setSelectedClient] = useState(null)
  const [selectedDebtDetail, setSelectedDebtDetail] = useState(null)
  const [search, setSearch] = useState("")

  const [currentPlan, setCurrentPlan] = useState(() => localStorage.getItem("kobri_plan") || "Gratis")
  const planLimits = PLAN_LIMITS[currentPlan] || PLAN_LIMITS.Gratis

  const [businessSettings, setBusinessSettings] = useState(() => {
    const saved = localStorage.getItem("kobri_settings")
    return saved
      ? JSON.parse(saved)
      : {
          businessName: "Mi negocio",
          phone: "",
          currency: "DOP",
          notifications: true,
        }
  })

  const [readNotifications, setReadNotifications] = useState(() => {
    const saved = localStorage.getItem("kobri_read_notifications")
    return saved ? JSON.parse(saved) : []
  })

  const [clients, setClients] = useState(() => {
    const saved = localStorage.getItem("kobri_clients")
    return saved ? JSON.parse(saved) : initialClients
  })

  const [debts, setDebts] = useState(() => {
    const saved = localStorage.getItem("kobri_debts")
    return saved ? JSON.parse(saved) : initialDebts
  })

  const [payments, setPayments] = useState(() => {
    const saved = localStorage.getItem("kobri_payments")
    return saved ? JSON.parse(saved) : []
  })

  const [clientForm, setClientForm] = useState({
    name: "",
    phone: "",
    email: "",
  })

  const [debtForm, setDebtForm] = useState({
    clientId: "",
    concept: "",
    amount: "",
    dueDate: "",
  })

  const [paymentForm, setPaymentForm] = useState({
    amount: "",
    method: "Efectivo",
    note: "",
  })

  useEffect(() => {
    localStorage.setItem("kobri_clients", JSON.stringify(clients))
  }, [clients])

  useEffect(() => {
    localStorage.setItem("kobri_debts", JSON.stringify(debts))
  }, [debts])

  useEffect(() => {
    localStorage.setItem("kobri_payments", JSON.stringify(payments))
  }, [payments])

  useEffect(() => {
    localStorage.setItem("kobri_settings", JSON.stringify(businessSettings))
  }, [businessSettings])

  useEffect(() => {
    localStorage.setItem("kobri_plan", currentPlan)
  }, [currentPlan])

  useEffect(() => {
    localStorage.setItem(
      "kobri_read_notifications",
      JSON.stringify(readNotifications)
    )
  }, [readNotifications])

  useEffect(() => {
    localStorage.setItem("kobri_theme", theme)
    document.documentElement.classList.toggle("kobri-dark", theme === "dark")
  }, [theme])

  useEffect(() => {
    if (!planLimits.reminders && businessSettings.notifications) {
      setBusinessSettings((current) => ({ ...current, notifications: false }))
    }
  }, [planLimits.reminders, businessSettings.notifications])

  const anyModalOpen =
    showDebtModal ||
    showClientModal ||
    showPaymentModal ||
    showHelpModal ||
    showSettings ||
    showAccount ||
    showPlans ||
    showClientDetail ||
    showDebtDetail

  useEffect(() => {
    document.body.style.overflow = anyModalOpen ? "hidden" : ""
    return () => {
      document.body.style.overflow = ""
    }
  }, [anyModalOpen])

  const paidForDebt = (debtId) =>
    payments
      .filter((payment) => payment.debtId === debtId)
      .reduce((sum, payment) => sum + Number(payment.amount), 0)

  const debtRows = useMemo(() => {
    return debts.map((debt) => {
      const client = clients.find((item) => item.id === debt.clientId)
      const paid = paidForDebt(debt.id)
      const balance = Math.max(Number(debt.amount) - paid, 0)

      return {
        ...debt,
        client,
        paid,
        balance,
        status: getStatus(debt, paid),
      }
    })
  }, [debts, clients, payments])

  const stats = useMemo(() => {
    const totalDebt = debtRows.reduce((sum, debt) => sum + debt.amount, 0)
    const totalPaid = debtRows.reduce((sum, debt) => sum + debt.paid, 0)
    const totalPending = debtRows.reduce(
      (sum, debt) => sum + debt.balance,
      0
    )
    const overdueRows = debtRows.filter(
      (debt) => debt.status.className === "overdue"
    )
    const overdue = overdueRows.reduce((sum, debt) => sum + debt.balance, 0)
    const openCount = debtRows.filter(
      (debt) => debt.status.className !== "paid"
    ).length
    const recovery =
      totalDebt > 0 ? Math.round((totalPaid / totalDebt) * 100) : 0
    const clientsWithBalance = new Set(
      debtRows.filter((debt) => debt.balance > 0).map((debt) => debt.clientId)
    ).size

    return {
      totalDebt,
      totalPaid,
      totalPending,
      overdue,
      overdueCount: overdueRows.length,
      openCount,
      recovery,
      clientsWithBalance,
    }
  }, [debtRows])

  const portfolioSegments = useMemo(() => {
    const pendingAmount = Math.max(stats.totalPending - stats.overdue, 0)

    return [
      { key: "paid", label: "Cobrado", tone: "ok", amount: stats.totalPaid },
      { key: "pending", label: "Por vencer", tone: "accent", amount: pendingAmount },
      { key: "overdue", label: "Vencido", tone: "bad", amount: stats.overdue },
    ].map((item) => ({
      ...item,
      percent:
        stats.totalDebt > 0
          ? Math.round((item.amount / stats.totalDebt) * 100)
          : 0,
    }))
  }, [stats])

  const todayLabel = useMemo(() => {
    const text = new Date().toLocaleDateString("es-DO", {
      weekday: "long",
      day: "numeric",
      month: "long",
    })
    return text.charAt(0).toUpperCase() + text.slice(1)
  }, [])

  const filteredClients = clients.filter((client) =>
    `${client.name} ${client.phone} ${client.email}`
      .toLowerCase()
      .includes(search.toLowerCase())
  )

  const filteredDebts = debtRows.filter((debt) =>
    `${debt.client?.name || ""} ${debt.concept} ${debt.status.label}`
      .toLowerCase()
      .includes(search.toLowerCase())
  )

  const notifications = useMemo(() => {
    if (!businessSettings.notifications) return []

    const items = []

    debtRows
      .filter((debt) => debt.status.className === "overdue")
      .slice(0, 5)
      .forEach((debt) => {
        items.push({
          id: `overdue-${debt.id}`,
          type: "overdue",
          title: "Deuda vencida",
          text: `${debt.client?.name || "Cliente"} tiene ${money(
            debt.balance
          )} pendiente.`,
        })
      })

    debtRows
      .filter((debt) => {
        if (debt.status.className === "paid") return false
        const due = new Date(`${debt.dueDate}T12:00:00`)
        const now = new Date()
        const diff = Math.ceil((due - now) / (1000 * 60 * 60 * 24))
        return diff >= 0 && diff <= 3
      })
      .slice(0, 5)
      .forEach((debt) => {
        items.push({
          id: `upcoming-${debt.id}`,
          type: "upcoming",
          title: "Vencimiento próximo",
          text: `${debt.client?.name || "Cliente"} vence el ${new Date(
            `${debt.dueDate}T12:00:00`
          ).toLocaleDateString("es-DO", { day: "2-digit", month: "short" })}.`,
        })
      })

    payments.slice(0, 5).forEach((payment) => {
      const debt = debts.find((item) => item.id === payment.debtId)
      const client = clients.find((item) => item.id === debt?.clientId)

      items.push({
        id: `payment-${payment.id}`,
        type: "payment",
        title: "Pago registrado",
        text: `${client?.name || "Cliente"} pagó ${money(payment.amount)}.`,
      })
    })

    return items.slice(0, 10)
  }, [
    debtRows,
    payments,
    debts,
    clients,
    businessSettings.notifications,
  ])

  const unreadNotifications = notifications.filter(
    (item) => !readNotifications.includes(item.id)
  ).length

  function navigate(view) {
    setActiveView(view)
    setSearch("")
    setSidebarOpen(false)
  }

  function openClientDetail(client) {
    setSelectedClient(client)
    setShowClientDetail(true)
  }

  function openDebtDetail(debt) {
    setSelectedDebtDetail(debt)
    setShowDebtDetail(true)
  }

  function markNotificationsAsRead() {
    setReadNotifications(notifications.map((item) => item.id))
  }

  function markNotificationAsRead(id) {
    setReadNotifications((current) =>
      current.includes(id) ? current : [...current, id]
    )
  }

  function saveBusinessSettings(event) {
    event.preventDefault()
    setShowSettings(false)
  }

  function addClient(event) {
    event.preventDefault()

    if (!clientForm.name.trim()) return
    if (clients.length >= planLimits.maxClients) return

    const newClient = {
      id: Date.now(),
      ...clientForm,
      createdAt: new Date().toISOString(),
    }

    setClients((current) => [...current, newClient])

    setClientForm({
      name: "",
      phone: "",
      email: "",
    })

    setShowClientModal(false)
  }

  function addDebt(event) {
    event.preventDefault()

    if (
      !debtForm.clientId ||
      !debtForm.concept.trim() ||
      !debtForm.amount ||
      !debtForm.dueDate
    ) {
      return
    }

    const newDebt = {
      id: Date.now(),
      clientId: Number(debtForm.clientId),
      concept: debtForm.concept,
      amount: Number(debtForm.amount),
      dueDate: debtForm.dueDate,
      createdAt: new Date().toISOString(),
    }

    setDebts((current) => [newDebt, ...current])

    setDebtForm({
      clientId: "",
      concept: "",
      amount: "",
      dueDate: "",
    })

    setShowDebtModal(false)
  }

  function openPayment(debt) {
    setSelectedDebt(debt)

    setPaymentForm({
      amount: debt.balance,
      method: "Efectivo",
      note: "",
    })

    setShowPaymentModal(true)
  }

  function addPayment(event) {
    event.preventDefault()

    if (!selectedDebt || !paymentForm.amount) return

    const amount = Number(paymentForm.amount)

    if (amount <= 0 || amount > selectedDebt.balance) return

    const payment = {
      id: Date.now(),
      debtId: selectedDebt.id,
      amount,
      method: paymentForm.method,
      note: paymentForm.note,
      date: new Date().toISOString(),
    }

    setPayments((current) => [payment, ...current])

    setShowPaymentModal(false)
    setSelectedDebt(null)
  }

  function pageTitle() {
    const titles = {
      dashboard: ["Resumen", "Todo lo importante de tu negocio, en un solo lugar."],
      clients: ["Clientes", "Administra tus clientes y conoce su situación."],
      debts: ["Deudas", "Controla todo lo que está pendiente de cobro."],
      payments: ["Pagos", "Consulta el historial de dinero recibido."],
    }

    return titles[activeView]
  }

  return (
    <div className="app-shell">
      {sidebarOpen && (
        <div
          className="mobile-overlay"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside className={`sidebar ${sidebarOpen ? "sidebar-open" : ""}`}>
        <div className="sidebar-top">
          <Logo />

          <button
            className="mobile-close"
            onClick={() => setSidebarOpen(false)}
            aria-label="Cerrar menú"
          >
            <Icon name="close" size={20} />
          </button>
        </div>

        <button
          className="workspace workspace-button"
          onClick={() => {
            setShowAccount(true)
            setShowNotifications(false)
            setShowSettings(false)
            setShowPlans(false)
          }}
          title="Abrir mi cuenta"
        >
          <div className="workspace-avatar">K</div>
          <div>
            <strong>{businessSettings.businessName}</strong>
            <span>Plan {currentPlan}</span>
          </div>
          <Icon name="arrow" size={16} />
        </button>

        <nav className="navigation">
          <div className="nav-label">Gestión</div>

          <button
            className={`nav-item ${
              activeView === "dashboard" ? "active" : ""
            }`}
            onClick={() => navigate("dashboard")}
          >
            <Icon name="home" />
            <span>Inicio</span>
          </button>

          <button
            className={`nav-item ${
              activeView === "clients" ? "active" : ""
            }`}
            onClick={() => navigate("clients")}
          >
            <Icon name="users" />
            <span>Clientes</span>
          </button>

          <button
            className={`nav-item ${
              activeView === "debts" ? "active" : ""
            }`}
            onClick={() => navigate("debts")}
          >
            <Icon name="wallet" />
            <span>Deudas</span>
            {stats.overdueCount > 0 && (
              <b className="nav-badge" title="Deudas vencidas">
                {stats.overdueCount}
              </b>
            )}
          </button>

          <button
            className={`nav-item ${
              activeView === "payments" ? "active" : ""
            }`}
            onClick={() => navigate("payments")}
          >
            <Icon name="card" />
            <span>Pagos</span>
          </button>
        </nav>

        <div className="sidebar-bottom">
          <button
            className="help-card"
            onClick={() => {
              setShowHelpModal(true)
              setSidebarOpen(false)
              setShowNotifications(false)
              setShowSettings(false)
              setShowAccount(false)
              setShowPlans(false)
            }}
          >
            <div className="help-icon">?</div>
            <div>
              <strong>¿Necesitas ayuda?</strong>
              <span>Estamos aquí para ayudarte.</span>
            </div>
            <Icon name="arrow" size={15} />
          </button>
        </div>
      </aside>

      <main className="main-content">
        <header className="topbar">
          <button
            className="mobile-menu"
            onClick={() => setSidebarOpen(true)}
            aria-label="Abrir menú"
          >
            <Icon name="menu" />
          </button>

          <div className="breadcrumb">
            <span>Kobri</span>
            <b>/</b>
            <strong>{pageTitle()[0]}</strong>
          </div>

          <div className="topbar-actions">
            <button
              className="icon-button notification"
              onClick={() => {
                setShowNotifications((current) => !current)
                setShowSettings(false)
                setShowAccount(false)
                setShowPlans(false)
              }}
              aria-label="Notificaciones"
              title="Notificaciones"
            >
              <Icon name="bell" size={19} />
              {unreadNotifications > 0 && (
                <i>{unreadNotifications > 9 ? "9+" : unreadNotifications}</i>
              )}
            </button>

            <button
              className={`theme-toggle ${theme === "dark" ? "is-dark" : ""}`}
              onClick={() => {
                setTheme((current) => (current === "dark" ? "light" : "dark"))
                setShowNotifications(false)
                setShowAccount(false)
                setShowSettings(false)
                setShowPlans(false)
              }}
              aria-label={theme === "dark" ? "Cambiar a modo claro" : "Cambiar a modo oscuro"}
              title={theme === "dark" ? "Modo claro" : "Modo oscuro"}
              aria-pressed={theme === "dark"}
            >
              <span className="theme-toggle-track">
                <span className="theme-toggle-thumb">
                  <Icon name={theme === "dark" ? "moon" : "sun"} size={14} />
                </span>
              </span>
            </button>

            <button
              className="top-profile top-profile-button"
              onClick={() => {
                setShowAccount(true)
                setShowNotifications(false)
                setShowSettings(false)
                setShowPlans(false)
              }}
              title="Mi cuenta"
            >
              <div className="top-avatar">K</div>
              <div className="top-profile-text">
                <strong>{businessSettings.businessName}</strong>
                <span>Administrador</span>
              </div>
            </button>

            {showNotifications && (
              <div className="notification-panel">
                <div className="notification-header">
                  <div>
                    <strong>Notificaciones</strong>
                    <span>
                      {unreadNotifications > 0
                        ? `${unreadNotifications} sin leer`
                        : "Todo leído"}
                    </span>
                  </div>
                  {unreadNotifications > 0 && (
                    <button onClick={markNotificationsAsRead}>
                      Marcar todas
                    </button>
                  )}
                </div>

                <div className="notification-list">
                  {notifications.length === 0 ? (
                    <div className="notification-empty">
                      <Icon name="check" size={20} />
                      <strong>No tienes notificaciones</strong>
                      <span>Todo está al día.</span>
                    </div>
                  ) : (
                    notifications.map((item) => (
                      <button
                        className={`notification-item ${
                          readNotifications.includes(item.id) ? "read" : "unread"
                        }`}
                        key={item.id}
                        onClick={() => markNotificationAsRead(item.id)}
                      >
                        <div className={`notification-dot ${item.type}`} />
                        <div>
                          <strong>{item.title}</strong>
                          <span>{item.text}</span>
                        </div>
                      </button>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>
        </header>

        <div className="page-content">
          {activeView === "dashboard" && (
            <>
              <section className="hero">
                <div>
                  <p className="hero-date">{todayLabel}</p>
                  <h1>{greeting()}</h1>
                  <p className="hero-sub">{pageTitle()[1]}</p>
                </div>

                <button
                  className="primary-button"
                  onClick={() => setShowDebtModal(true)}
                >
                  <Icon name="plus" size={18} />
                  Nueva deuda
                </button>
              </section>

              <section className="overview">
                <article className="feature-card">
                  <div className="feature-main">
                    <span className="feature-label">Por cobrar</span>
                    <strong className="feature-amount">
                      {money(stats.totalPending)}
                    </strong>
                    <p className="feature-sub">
                      {stats.openCount === 0
                        ? "No tienes deudas abiertas."
                        : `${stats.openCount} ${
                            stats.openCount === 1
                              ? "deuda abierta"
                              : "deudas abiertas"
                          } esperando cobro.`}
                    </p>

                    <div className="feature-meter">
                      <Progress value={stats.recovery} tone="on-dark" />
                      <div className="feature-legend">
                        <span>
                          <i className="dot ok" />
                          Cobrado {money(stats.totalPaid)}
                        </span>
                        <span>Total registrado {money(stats.totalDebt)}</span>
                      </div>
                    </div>
                  </div>

                  <Ring percent={stats.recovery} />
                </article>

                <article
                  className={`stat-card ${stats.overdue > 0 ? "has-alert" : ""}`}
                >
                  <div className="stat-head">
                    <span>Vencido</span>
                    <div className="stat-icon red">
                      <Icon name="calendar" size={18} />
                    </div>
                  </div>
                  <strong>{money(stats.overdue)}</strong>
                  <div className="stat-footer">
                    <span
                      className={stats.overdue > 0 ? "danger-text" : "neutral"}
                    >
                      {stats.overdueCount > 0
                        ? `${stats.overdueCount} ${
                            stats.overdueCount === 1
                              ? "deuda requiere"
                              : "deudas requieren"
                          } atención`
                        : "Sin deudas vencidas"}
                    </span>
                  </div>
                </article>

                <article className="stat-card">
                  <div className="stat-head">
                    <span>Clientes</span>
                    <div className="stat-icon purple">
                      <Icon name="users" size={18} />
                    </div>
                  </div>
                  <strong>{clients.length}</strong>
                  <div className="stat-footer">
                    <span className="neutral">
                      {stats.clientsWithBalance} con saldo pendiente
                    </span>
                  </div>
                </article>
              </section>

              <section className="panel table-block">
                <div className="panel-header">
                  <div>
                    <h2>Deudas recientes</h2>
                    <p>Las últimas cuentas registradas.</p>
                  </div>

                  <button
                    className="text-button"
                    onClick={() => navigate("debts")}
                  >
                    Ver todas
                    <Icon name="arrow" size={16} />
                  </button>
                </div>

                {debtRows.length === 0 ? (
                  <EmptyState
                    icon="wallet"
                    title="Todavía no tienes deudas"
                    text="Crea tu primera deuda para comenzar a controlar tus cobros."
                    action={() => setShowDebtModal(true)}
                  />
                ) : (
                  <DebtTable
                    rows={debtRows.slice(0, 5)}
                    onPay={openPayment}
                    onDetails={openDebtDetail}
                  />
                )}
              </section>

              <section className="dashboard-grid">
                <div className="panel">
                  <div className="panel-header">
                    <div>
                      <h2>Próximos vencimientos</h2>
                      <p>Deudas pendientes ordenadas por fecha.</p>
                    </div>
                  </div>

                  <div className="upcoming-list">
                    {debtRows
                      .filter((item) => item.status.className !== "paid")
                      .sort((a, b) => a.dueDate.localeCompare(b.dueDate))
                      .slice(0, 5)
                      .map((debt) => {
                        const days = daysUntil(debt.dueDate)
                        const tone =
                          days < 0 ? "late" : days <= 3 ? "soon" : "calm"

                        return (
                          <div
                            className={`upcoming-item ${tone}`}
                            key={debt.id}
                          >
                            <div className="date-box">
                              <strong>
                                {new Date(
                                  `${debt.dueDate}T12:00:00`
                                ).getDate()}
                              </strong>
                              <span>
                                {new Date(
                                  `${debt.dueDate}T12:00:00`
                                ).toLocaleDateString("es-DO", {
                                  month: "short",
                                })}
                              </span>
                            </div>

                            <div className="upcoming-info">
                              <strong>{debt.client?.name}</strong>
                              <span>{debt.concept}</span>
                            </div>

                            <div className="upcoming-side">
                              <strong className="upcoming-amount">
                                {money(debt.balance)}
                              </strong>
                              <span className={`due-chip ${tone}`}>
                                {dueLabel(days)}
                              </span>
                            </div>
                          </div>
                        )
                      })}

                    {debtRows.filter(
                      (item) => item.status.className !== "paid"
                    ).length === 0 && (
                      <div className="simple-empty">
                        <div className="empty-circle">
                          <Icon name="check" size={20} />
                        </div>
                        <strong>Todo está al día</strong>
                        <span>No hay vencimientos pendientes.</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="stack">
                  <div className="panel">
                    <div className="panel-header">
                      <div>
                        <h2>Estado de la cartera</h2>
                        <p>Cómo se reparte lo que has registrado.</p>
                      </div>
                    </div>

                    <div className="portfolio">
                      {stats.totalDebt === 0 ? (
                        <div className="simple-empty compact">
                          <div className="empty-circle">
                            <Icon name="wallet" size={20} />
                          </div>
                          <strong>Sin datos todavía</strong>
                          <span>Registra una deuda para ver el reparto.</span>
                        </div>
                      ) : (
                        <>
                          <div
                            className="segbar"
                            role="img"
                            aria-label="Distribución de la cartera"
                          >
                            {portfolioSegments
                              .filter((item) => item.amount > 0)
                              .map((item) => (
                                <i
                                  key={item.key}
                                  className={item.tone}
                                  style={{
                                    width: `${
                                      (item.amount / stats.totalDebt) * 100
                                    }%`,
                                  }}
                                />
                              ))}
                          </div>

                          <ul className="legend-list">
                            {portfolioSegments.map((item) => (
                              <li key={item.key}>
                                <i className={`dot ${item.tone}`} />
                                <span className="legend-name">
                                  {item.label}
                                </span>
                                <strong>{money(item.amount)}</strong>
                                <em>{item.percent}%</em>
                              </li>
                            ))}
                          </ul>
                        </>
                      )}
                    </div>
                  </div>

                  <div className="panel">
                    <div className="panel-header">
                      <div>
                        <h2>Pagos recientes</h2>
                        <p>Los últimos cobros registrados.</p>
                      </div>

                      {payments.length > 0 && (
                        <button
                          className="text-button"
                          onClick={() => navigate("payments")}
                        >
                          Ver todos
                          <Icon name="arrow" size={16} />
                        </button>
                      )}
                    </div>

                    {payments.length === 0 ? (
                      <div className="simple-empty compact">
                        <div className="empty-circle">
                          <Icon name="card" size={20} />
                        </div>
                        <strong>Aún no hay pagos</strong>
                        <span>Cuando cobres una deuda aparecerá aquí.</span>
                      </div>
                    ) : (
                      <ul className="activity-list">
                        {payments.slice(0, 4).map((payment) => {
                          const debt = debts.find(
                            (item) => item.id === payment.debtId
                          )
                          const client = clients.find(
                            (item) => item.id === debt?.clientId
                          )

                          return (
                            <li className="activity-item" key={payment.id}>
                              <div
                                className={`client-avatar tone-${avatarTone(
                                  client?.name
                                )}`}
                              >
                                {client?.name?.charAt(0) || "K"}
                              </div>
                              <div className="activity-copy">
                                <strong>{client?.name || "Cliente"}</strong>
                                <span>
                                  {payment.method},{" "}
                                  {new Date(payment.date).toLocaleDateString(
                                    "es-DO",
                                    { day: "2-digit", month: "short" }
                                  )}
                                </span>
                              </div>
                              <strong className="activity-amount">
                                +{money(payment.amount)}
                              </strong>
                            </li>
                          )
                        })}
                      </ul>
                    )}
                  </div>
                </div>
              </section>
            </>
          )}

          {activeView === "clients" && (
            <section className="page-section">
              <section className="page-heading">
                <div>
                  <h1>Clientes</h1>
                  <p>{pageTitle()[1]}</p>
                  {clients.length >= planLimits.maxClients && (
                    <p className="plan-limit-note">
                      Alcanzaste el límite de {planLimits.maxClients} clientes del plan Gratis.{" "}
                      <button
                        type="button"
                        className="text-button"
                        onClick={() => setShowPlans(true)}
                      >
                        Ver planes
                      </button>
                    </p>
                  )}
                </div>

                <button
                  className="primary-button"
                  onClick={() => setShowClientModal(true)}
                  disabled={clients.length >= planLimits.maxClients}
                >
                  <Icon name="plus" size={18} />
                  Nuevo cliente
                </button>
              </section>

              <div className="toolbar">
                <div className="search-box">
                  <Icon name="search" size={18} />
                  <input
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                    placeholder="Buscar cliente..."
                  />
                </div>

                <span className="results-count">
                  {filteredClients.length} clientes
                </span>
              </div>

              <div className="panel table-panel">
                {filteredClients.length === 0 ? (
                  <EmptyState
                    icon="users"
                    title="No encontramos clientes"
                    text="Prueba con otro término de búsqueda."
                  />
                ) : (
                  <div className="table-wrapper">
                    <table className="stack-table clients-table">
                      <thead>
                        <tr>
                          <th>Cliente</th>
                          <th>Contacto</th>
                          <th>Deuda</th>
                          <th>Estado</th>
                          <th />
                        </tr>
                      </thead>

                      <tbody>
                        {filteredClients.map((client) => {
                          const clientDebts = debtRows.filter(
                            (debt) => debt.clientId === client.id
                          )

                          const balance = clientDebts.reduce(
                            (sum, debt) => sum + debt.balance,
                            0
                          )

                          return (
                            <tr key={client.id}>
                              <td className="cell-client">
                                <div className="client-cell">
                                  <div
                                    className={`client-avatar tone-${avatarTone(
                                      client.name
                                    )}`}
                                  >
                                    {client.name.charAt(0).toUpperCase()}
                                  </div>
                                  <div className="client-copy">
                                    <strong>{client.name}</strong>
                                    <span>Cliente</span>
                                  </div>
                                </div>
                              </td>

                              <td className="cell-contact">
                                <div className="contact-cell">
                                  <strong>{client.phone || "—"}</strong>
                                  <span>{client.email || "Sin correo"}</span>
                                </div>
                              </td>

                              <td className="cell-amount">
                                <div className="amount-cell">
                                  <strong>{money(balance)}</strong>
                                  <span>
                                    {clientDebts.length}{" "}
                                    {clientDebts.length === 1
                                      ? "deuda"
                                      : "deudas"}
                                  </span>
                                </div>
                              </td>

                              <td className="cell-status">
                                <span
                                  className={`status ${
                                    balance > 0 ? "pending" : "paid"
                                  }`}
                                >
                                  {balance > 0 ? "Con saldo" : "Al día"}
                                </span>
                              </td>

                              <td className="cell-action">
                                <button
                                  className="row-action"
                                  onClick={() => openClientDetail(client)}
                                  aria-label={`Ver ${client.name}`}
                                >
                                  <Icon name="arrow" size={17} />
                                </button>
                              </td>
                            </tr>
                          )
                        })}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </section>
          )}

          {activeView === "debts" && (
            <section className="page-section">
              <section className="page-heading">
                <div>
                  <h1>Deudas</h1>
                  <p>{pageTitle()[1]}</p>
                </div>

                <button
                  className="primary-button"
                  onClick={() => setShowDebtModal(true)}
                >
                  <Icon name="plus" size={18} />
                  Nueva deuda
                </button>
              </section>

              <div className="toolbar">
                <div className="search-box">
                  <Icon name="search" size={18} />
                  <input
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                    placeholder="Buscar deuda, cliente..."
                  />
                </div>

                <span className="results-count">
                  {filteredDebts.length} registros
                </span>
              </div>

              <div className="panel table-panel">
                {filteredDebts.length === 0 ? (
                  <EmptyState
                    icon="wallet"
                    title="No hay deudas registradas"
                    text="Crea una deuda para comenzar."
                    action={() => setShowDebtModal(true)}
                  />
                ) : (
                  <DebtTable
                    rows={filteredDebts}
                    onPay={openPayment}
                    onDetails={openDebtDetail}
                    detailed
                  />
                )}
              </div>
            </section>
          )}

          {activeView === "payments" && (
            <section className="page-section">
              <section className="page-heading">
                <div>
                  <h1>Pagos</h1>
                  <p>{pageTitle()[1]}</p>
                </div>
              </section>

              <div className="stats-grid payment-stats">
                <div className="stat-card">
                  <div className="stat-head">
                    <span>Total cobrado</span>
                    <div className="stat-icon green">
                      <Icon name="dollar" size={18} />
                    </div>
                  </div>
                  <strong>{money(stats.totalPaid)}</strong>
                  <div className="stat-footer">
                    <span className="positive">Pagos registrados</span>
                  </div>
                </div>

                <div className="stat-card">
                  <div className="stat-head">
                    <span>Transacciones</span>
                    <div className="stat-icon blue">
                      <Icon name="card" size={18} />
                    </div>
                  </div>
                  <strong>{payments.length}</strong>
                  <div className="stat-footer">
                    <span className="neutral">Movimientos</span>
                  </div>
                </div>
              </div>

              <div className="panel table-panel">
                {payments.length === 0 ? (
                  <EmptyState
                    icon="card"
                    title="Todavía no hay pagos"
                    text="Cuando registres un pago aparecerá aquí."
                  />
                ) : (
                  <div className="table-wrapper">
                    <table className="stack-table payments-table">
                      <thead>
                        <tr>
                          <th>Cliente</th>
                          <th>Concepto</th>
                          <th>Monto</th>
                          <th>Método</th>
                          <th>Fecha</th>
                        </tr>
                      </thead>

                      <tbody>
                        {payments.map((payment) => {
                          const debt = debts.find(
                            (item) => item.id === payment.debtId
                          )

                          const client = clients.find(
                            (item) => item.id === debt?.clientId
                          )

                          return (
                            <tr key={payment.id}>
                              <td className="cell-client">
                                <div className="client-cell">
                                  <div
                                    className={`client-avatar tone-${avatarTone(
                                      client?.name
                                    )}`}
                                  >
                                    {client?.name?.charAt(0) || "K"}
                                  </div>
                                  <div className="client-copy">
                                    <strong>
                                      {client?.name || "Cliente"}
                                    </strong>
                                    <span>Pago recibido</span>
                                  </div>
                                </div>
                              </td>

                              <td className="cell-concept">
                                <strong>{debt?.concept || "—"}</strong>
                              </td>

                              <td className="cell-amount">
                                <strong className="payment-amount">
                                  +{money(payment.amount)}
                                </strong>
                              </td>

                              <td className="cell-method">
                                <span className="method-pill">
                                  {payment.method}
                                </span>
                              </td>

                              <td className="cell-date">
                                {new Date(payment.date).toLocaleDateString(
                                  "es-DO",
                                  {
                                    day: "2-digit",
                                    month: "short",
                                    year: "numeric",
                                  }
                                )}
                              </td>
                            </tr>
                          )
                        })}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </section>
          )}
        </div>
      </main>

      {showClientModal && (
        <Modal
          title="Nuevo cliente"
          subtitle="Agrega los datos básicos de tu cliente."
          onClose={() => setShowClientModal(false)}
        >
          <form onSubmit={addClient}>
            <div className="form-grid">
              <label>
                Nombre completo
                <input
                  autoFocus
                  value={clientForm.name}
                  onChange={(event) =>
                    setClientForm({
                      ...clientForm,
                      name: event.target.value,
                    })
                  }
                  placeholder="Ej. Juan Pérez"
                />
              </label>

              <label>
                Teléfono
                <input
                  value={clientForm.phone}
                  onChange={(event) =>
                    setClientForm({
                      ...clientForm,
                      phone: event.target.value,
                    })
                  }
                  placeholder="809-000-0000"
                />
              </label>

              <label className="full">
                Correo electrónico
                <input
                  type="email"
                  value={clientForm.email}
                  onChange={(event) =>
                    setClientForm({
                      ...clientForm,
                      email: event.target.value,
                    })
                  }
                  placeholder="cliente@email.com"
                />
              </label>
            </div>

            <ModalActions
              onCancel={() => setShowClientModal(false)}
              submit="Crear cliente"
            />
          </form>
        </Modal>
      )}

      {showDebtModal && (
        <Modal
          title="Nueva deuda"
          subtitle="Registra una cuenta pendiente de cobro."
          onClose={() => setShowDebtModal(false)}
        >
          <form onSubmit={addDebt}>
            <div className="form-grid">
              <label className="full">
                Cliente
                <select
                  value={debtForm.clientId}
                  onChange={(event) =>
                    setDebtForm({
                      ...debtForm,
                      clientId: event.target.value,
                    })
                  }
                >
                  <option value="">Selecciona un cliente</option>
                  {clients.map((client) => (
                    <option key={client.id} value={client.id}>
                      {client.name}
                    </option>
                  ))}
                </select>

                {clients.length === 0 && (
                  <small className="form-help">
                    Primero debes crear un cliente.
                  </small>
                )}
              </label>

              <label className="full">
                Concepto
                <input
                  value={debtForm.concept}
                  onChange={(event) =>
                    setDebtForm({
                      ...debtForm,
                      concept: event.target.value,
                    })
                  }
                  placeholder="Ej. Compra de mercancía"
                />
              </label>

              <label>
                Monto
                <div className="input-money">
                  <span>RD$</span>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={debtForm.amount}
                    onChange={(event) =>
                      setDebtForm({
                        ...debtForm,
                        amount: event.target.value,
                      })
                    }
                    placeholder="0.00"
                  />
                </div>
              </label>

              <label>
                Fecha de vencimiento
                <input
                  type="date"
                  value={debtForm.dueDate}
                  onChange={(event) =>
                    setDebtForm({
                      ...debtForm,
                      dueDate: event.target.value,
                    })
                  }
                />
              </label>
            </div>

            <ModalActions
              onCancel={() => setShowDebtModal(false)}
              submit="Crear deuda"
            />
          </form>
        </Modal>
      )}

      {showPaymentModal && selectedDebt && (
        <Modal
          title="Registrar pago"
          subtitle={`Pago para ${selectedDebt.client?.name || "cliente"}.`}
          onClose={() => setShowPaymentModal(false)}
        >
          <form onSubmit={addPayment}>
            <div className="payment-summary">
              <span>Saldo pendiente</span>
              <strong>{money(selectedDebt.balance)}</strong>
            </div>

            <div className="form-grid">
              <label>
                Monto a pagar
                <div className="input-money">
                  <span>RD$</span>
                  <input
                    autoFocus
                    type="number"
                    min="0.01"
                    max={selectedDebt.balance}
                    step="0.01"
                    value={paymentForm.amount}
                    onChange={(event) =>
                      setPaymentForm({
                        ...paymentForm,
                        amount: event.target.value,
                      })
                    }
                  />
                </div>
              </label>

              <label>
                Método
                <select
                  value={paymentForm.method}
                  onChange={(event) =>
                    setPaymentForm({
                      ...paymentForm,
                      method: event.target.value,
                    })
                  }
                >
                  <option>Efectivo</option>
                  <option>Transferencia</option>
                  <option>Tarjeta</option>
                  <option>Otro</option>
                </select>
              </label>

              <label className="full">
                Nota
                <input
                  value={paymentForm.note}
                  onChange={(event) =>
                    setPaymentForm({
                      ...paymentForm,
                      note: event.target.value,
                    })
                  }
                  placeholder="Nota opcional"
                />
              </label>
            </div>

            <ModalActions
              onCancel={() => setShowPaymentModal(false)}
              submit="Registrar pago"
            />
          </form>
        </Modal>
      )}

      {showClientDetail && selectedClient && (
        <Modal
          title={selectedClient.name}
          subtitle="Información y situación de este cliente."
          onClose={() => {
            setShowClientDetail(false)
            setSelectedClient(null)
          }}
        >
          <div className="detail-card">
            <div className="detail-avatar">
              {selectedClient.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <strong>{selectedClient.name}</strong>
              <span>{selectedClient.phone || "Sin teléfono"}</span>
              <span>{selectedClient.email || "Sin correo electrónico"}</span>
            </div>
          </div>

          <div className="detail-grid">
            <div>
              <span>Saldo pendiente</span>
              <strong>
                {money(
                  debtRows
                    .filter((debt) => debt.clientId === selectedClient.id)
                    .reduce((sum, debt) => sum + debt.balance, 0)
                )}
              </strong>
            </div>
            <div>
              <span>Deudas</span>
              <strong>
                {debtRows.filter((debt) => debt.clientId === selectedClient.id).length}
              </strong>
            </div>
          </div>

          <div className="detail-actions">
            <button
              className="primary-button"
              onClick={() => {
                setShowClientDetail(false)
                setDebtForm((current) => ({
                  ...current,
                  clientId: String(selectedClient.id),
                }))
                setShowDebtModal(true)
              }}
            >
              <Icon name="plus" size={17} />
              Nueva deuda
            </button>
          </div>
        </Modal>
      )}

      {showDebtDetail && selectedDebtDetail && (
        <Modal
          title={selectedDebtDetail.concept}
          subtitle={`Deuda de ${selectedDebtDetail.client?.name || "cliente"}.`}
          onClose={() => {
            setShowDebtDetail(false)
            setSelectedDebtDetail(null)
          }}
        >
          <div className="detail-grid">
            <div>
              <span>Monto original</span>
              <strong>{money(selectedDebtDetail.amount)}</strong>
            </div>
            <div>
              <span>Saldo pendiente</span>
              <strong>{money(selectedDebtDetail.balance)}</strong>
            </div>
            <div>
              <span>Pagado</span>
              <strong>{money(selectedDebtDetail.paid)}</strong>
            </div>
            <div>
              <span>Estado</span>
              <strong>{selectedDebtDetail.status.label}</strong>
            </div>
          </div>

          <div className="detail-date">
            <Icon name="calendar" size={17} />
            Vencimiento: {new Date(`${selectedDebtDetail.dueDate}T12:00:00`).toLocaleDateString(
              "es-DO",
              { day: "2-digit", month: "long", year: "numeric" }
            )}
          </div>

          {selectedDebtDetail.balance > 0 && (
            <div className="detail-actions">
              <button
                className="primary-button"
                onClick={() => {
                  setShowDebtDetail(false)
                  openPayment(selectedDebtDetail)
                }}
              >
                <Icon name="dollar" size={17} />
                Registrar pago
              </button>
            </div>
          )}
        </Modal>
      )}

      {showHelpModal && (
        <Modal
          className="help-modal"
          title="Centro de ayuda"
          subtitle="Respuestas rápidas para empezar con Kobri."
          onClose={() => setShowHelpModal(false)}
        >
          <div className="help-intro">
            <div className="help-intro-mark">K</div>
            <div>
              <strong>Empieza en pocos pasos</strong>
              <span>
                Kobri está pensado para que puedas registrar, controlar y cobrar
                tus deudas sin complicaciones.
              </span>
            </div>
          </div>

          <div className="help-steps">
            <div className="help-step">
              <div className="help-step-number">01</div>
              <div className="help-step-copy">
                <strong>Registra tus clientes</strong>
                <span>
                  Guarda nombre, teléfono y correo. Así cada deuda queda
                  relacionada con la persona correcta.
                </span>
              </div>
            </div>

            <div className="help-step">
              <div className="help-step-number">02</div>
              <div className="help-step-copy">
                <strong>Crea una deuda</strong>
                <span>
                  Selecciona el cliente, escribe el concepto, indica el monto
                  y establece la fecha de vencimiento.
                </span>
              </div>
            </div>

            <div className="help-step">
              <div className="help-step-number">03</div>
              <div className="help-step-copy">
                <strong>Registra cada pago</strong>
                <span>
                  Desde “Cobrar” puedes registrar pagos parciales o completar
                  el saldo pendiente y consultar el detalle de la deuda.
                </span>
              </div>
            </div>

            <div className="help-step">
              <div className="help-step-number">04</div>
              <div className="help-step-copy">
                <strong>Personaliza Kobri</strong>
                <span>
                  Desde “Mi cuenta” puedes editar los datos de tu negocio,
                  revisar tu plan y configurar las notificaciones.
                </span>
              </div>
            </div>
          </div>

          <div className="help-footer">
            <div className="help-footer-icon">
              <Icon name="check" size={16} />
            </div>
            <div>
              <strong>Consejo</strong>
              <span>
                Mantén actualizados los pagos para que tus saldos y estados
                siempre reflejen la situación real de cada cliente.
              </span>
            </div>
          </div>
        </Modal>
      )}

      {showSettings && (
        <Modal
          title="Configuración"
          subtitle="Personaliza Kobri para tu negocio."
          onClose={() => setShowSettings(false)}
        >
          <form onSubmit={saveBusinessSettings}>
            <div className="form-grid">
              <label className="full">
                Nombre del negocio
                <input
                  value={businessSettings.businessName}
                  onChange={(event) =>
                    setBusinessSettings({
                      ...businessSettings,
                      businessName: event.target.value,
                    })
                  }
                  placeholder="Ej. Colmado Juan"
                />
              </label>

              <label>
                Teléfono
                <input
                  value={businessSettings.phone}
                  onChange={(event) =>
                    setBusinessSettings({
                      ...businessSettings,
                      phone: event.target.value,
                    })
                  }
                  placeholder="809-000-0000"
                />
              </label>

              <label>
                Moneda principal
                <select
                  value={businessSettings.currency}
                  onChange={(event) =>
                    setBusinessSettings({
                      ...businessSettings,
                      currency: event.target.value,
                    })
                  }
                >
                  <option value="DOP">Peso dominicano (RD$)</option>
                </select>
              </label>

              <label className="full settings-check">
                <input
                  type="checkbox"
                  checked={businessSettings.notifications}
                  disabled={!planLimits.reminders}
                  onChange={(event) =>
                    setBusinessSettings({
                      ...businessSettings,
                      notifications: event.target.checked,
                    })
                  }
                />
                <span>
                  Recibir notificaciones de vencimientos y pagos
                  {!planLimits.reminders && (
                    <em className="plan-lock">Disponible en el plan Pro</em>
                  )}
                </span>
              </label>
            </div>

            <ModalActions
              onCancel={() => setShowSettings(false)}
              submit="Guardar cambios"
            />
          </form>
        </Modal>
      )}

      {showAccount && (
        <Modal
          className="account-modal"
          title="Mi cuenta"
          subtitle="Información de tu cuenta de Kobri."
          onClose={() => setShowAccount(false)}
        >
          <div className="account-profile">
            <div className="account-avatar">K</div>
            <div className="account-profile-copy">
              <strong>{businessSettings.businessName}</strong>
              <span>Administrador</span>
            </div>
            <span className="account-plan-badge">Plan {currentPlan}</span>
          </div>

          <div className="account-stats">
            <div className="account-stat">
              <div className="stat-icon purple">
                <Icon name="card" size={18} />
              </div>
              <div className="account-stat-copy">
                <span>Plan</span>
                <strong>{currentPlan}</strong>
              </div>
            </div>

            <div className="account-stat">
              <div className="stat-icon green">
                <Icon name="dollar" size={18} />
              </div>
              <div className="account-stat-copy">
                <span>Moneda</span>
                <strong>RD$</strong>
              </div>
            </div>

            <div className="account-stat">
              <div className="stat-icon blue">
                <Icon name="users" size={18} />
              </div>
              <div className="account-stat-copy">
                <span>Clientes</span>
                <strong>{clients.length}</strong>
              </div>
            </div>

            <div className="account-stat">
              <div className="stat-icon orange">
                <Icon name="wallet" size={18} />
              </div>
              <div className="account-stat-copy">
                <span>Deudas</span>
                <strong>{debts.length}</strong>
              </div>
            </div>
          </div>

          <div className="account-actions">
            <button
              type="button"
              className="secondary-button"
              onClick={() => {
                setShowAccount(false)
                setShowSettings(true)
              }}
            >
              <Icon name="settings" size={18} />
              Editar configuración
            </button>
            <button
              type="button"
              className="primary-button"
              onClick={() => {
                setShowAccount(false)
                setShowPlans(true)
              }}
            >
              <Icon name="card" size={18} />
              Ver planes
            </button>
          </div>
        </Modal>
      )}

      {showPlans && (
        <Modal
          className="plans-modal"
          title="Planes de Kobri"
          subtitle="Elige el nivel que mejor se adapte a tu negocio."
          onClose={() => setShowPlans(false)}
        >
          <div className="plans-grid">
            {[
              { name: "Gratis", price: "RD$0", note: "Para empezar", features: ["Hasta 20 clientes", "Control de deudas", "Registro de pagos"] },
              { name: "Pro", price: "RD$299", note: "Para negocios en crecimiento", features: ["Clientes ilimitados", "Recordatorios", "Reportes y métricas"] },
              { name: "Negocio", price: "RD$599", note: "Para equipos", features: ["Todo lo de Pro", "Usuarios y permisos", "Funciones avanzadas"] },
            ].map((plan) => (
              <div className={`plan-card ${currentPlan === plan.name ? "selected" : ""}`} key={plan.name}>
                {currentPlan === plan.name && <span className="plan-current">Actual</span>}
                <div className="plan-card-top">
                  <div>
                    <strong>{plan.name}</strong>
                    <span>{plan.note}</span>
                  </div>
                  <b>{plan.price}<small>/mes</small></b>
                </div>
                <ul>
                  {plan.features.map((feature) => (
                    <li key={feature}><Icon name="check" size={14} />{feature}</li>
                  ))}
                </ul>
                <button
                  type="button"
                  className={currentPlan === plan.name ? "secondary-button" : "primary-button"}
                  onClick={() => {
                    setCurrentPlan(plan.name)
                    setShowPlans(false)
                  }}
                >
                  {currentPlan === plan.name ? "Plan actual" : `Elegir ${plan.name}`}
                </button>
              </div>
            ))}
          </div>
          <p className="plans-note">La selección del plan es visual por ahora. Conectaremos el cobro real cuando integremos suscripciones y pagos.</p>
        </Modal>
      )}
    </div>
  )
}

function DebtTable({ rows, onPay, onDetails, detailed = false }) {
  return (
    <div className="table-wrapper">
      <table className={`data-table stack-table debts-table ${detailed ? "detailed-table" : "compact-table"}`}>
        <thead>
          <tr>
            <th>Cliente</th>
            <th>Concepto</th>
            <th>Monto</th>
            {detailed && <th>Vencimiento</th>}
            <th>Estado</th>
            <th />
          </tr>
        </thead>

        <tbody>
          {rows.map((debt) => (
            <tr key={debt.id}>
              <td className="cell-client">
                <div className="client-cell client-identity">
                  <div
                    className={`client-avatar tone-${avatarTone(
                      debt.client?.name
                    )}`}
                  >
                    {debt.client?.name?.charAt(0) || "K"}
                  </div>
                  <div className="client-copy">
                    <strong>{debt.client?.name || "Cliente"}</strong>
                    <span>{debt.client?.phone || "Sin teléfono"}</span>
                  </div>
                </div>
              </td>

              <td className="cell-concept">
                <div className="debt-concept">
                  <span className="concept-name">{debt.concept}</span>
                  <button
                    type="button"
                    className="concept-detail-button"
                    onClick={() => onDetails?.(debt)}
                    aria-label={`Ver detalle de ${debt.concept}`}
                  >
                    Ver detalle de la deuda
                  </button>
                </div>
              </td>

              <td className="cell-amount">
                <div className="amount-cell">
                  <strong>{money(debt.balance)}</strong>
                  {debt.paid > 0 ? (
                    <>
                      <Progress
                        value={Math.round((debt.paid / debt.amount) * 100)}
                        tone="ok"
                      />
                      <span>de {money(debt.amount)}</span>
                    </>
                  ) : (
                    <span>Sin pagos aún</span>
                  )}
                </div>
              </td>

              {detailed && (
                <td className="cell-date">
                  <div className="date-cell">
                    <div className="date-copy">
                      <strong>
                        {new Date(
                          `${debt.dueDate}T12:00:00`
                        ).toLocaleDateString("es-DO", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        })}
                      </strong>
                      <span
                        className={
                          debt.status.className === "overdue" ? "is-late" : ""
                        }
                      >
                        {debt.balance > 0
                          ? dueLabel(daysUntil(debt.dueDate))
                          : "Pagada"}
                      </span>
                    </div>
                  </div>
                </td>
              )}

              <td className="cell-status">
                <span className={`status ${debt.status.className}`}>
                  <i />
                  {debt.status.label}
                </span>
              </td>

              <td className="cell-action">
                {debt.balance > 0 ? (
                  <button
                    className="small-pay-button"
                    onClick={() => onPay(debt)}
                  >
                    Cobrar
                  </button>
                ) : (
                  <div className="completed-check">
                    <Icon name="check" size={15} />
                  </div>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function EmptyState({ icon, title, text, action }) {
  return (
    <div className="empty-state">
      <div className="empty-icon">
        <Icon name={icon} size={23} />
      </div>

      <strong>{title}</strong>
      <p>{text}</p>

      {action && (
        <button className="primary-button small" onClick={action}>
          <Icon name="plus" size={16} />
          Crear deuda
        </button>
      )}
    </div>
  )
}

function Modal({ title, subtitle, onClose, children, className = "" }) {
  return (
    <div className="modal-backdrop" onMouseDown={onClose}>
      <div className={`modal ${className}`.trim()} onMouseDown={(event) => event.stopPropagation()}>
        <div className="modal-header">
          <div>
            <h2>{title}</h2>
            <p>{subtitle}</p>
          </div>

          <button type="button" className="modal-close" onClick={onClose} aria-label="Cerrar">
            <Icon name="close" size={19} />
          </button>
        </div>

        <div className="modal-body">{children}</div>
      </div>
    </div>
  )
}

function ModalActions({ onCancel, submit }) {
  return (
    <div className="modal-actions">
      <button
        type="button"
        className="secondary-button"
        onClick={onCancel}
      >
        Cancelar
      </button>

      <button type="submit" className="primary-button">
        {submit}
      </button>
    </div>
  )
}

export default App
