import { useEffect, useMemo, useState } from "react"
import "./App.css"

const money = (value) =>
  new Intl.NumberFormat("es-DO", {
    style: "currency",
    currency: "DOP",
    minimumFractionDigits: 2,
  }).format(Number(value || 0))

const today = new Date().toISOString().split("T")[0]

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

function Logo({ collapsed = false }) {
  return (
    <div className={`brand ${collapsed ? "brand-small" : ""}`}>
      <div className="brand-mark">
        <svg viewBox="0 0 64 64" aria-hidden="true">
          <rect x="2" y="2" width="60" height="60" rx="16" fill="#F8FAFF" />
          <path
            d="M16 13h9v14.5L39.5 13H51L35.5 28.7 51.5 51H40L26.7 33.7 25 35.4V51h-9V13Z"
            fill="#0B1324"
          />
          <path
            d="M28 29.1 41.2 16H51L34.1 32.6 28 29.1Z"
            fill="#4169FF"
          />
          <path
            d="m31 37.2 7.2-7 7.2 7-7.2 7-7.2-7Z"
            fill="#4169FF"
            opacity=".9"
          />
        </svg>
      </div>
      {!collapsed && (
        <div className="brand-copy">
          <span>KOBRI</span>
          <small>COBRANZAS • CONTROL</small>
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
    settings: (
      <>
        <circle cx="12" cy="12" r="3.2" />
        <path d="M19.4 15a1.7 1.7 0 0 0 .34 1.88l.06.06-1.7 1.7-.06-.06a1.7 1.7 0 0 0-1.88-.34 1.7 1.7 0 0 0-1.04 1.57V22h-2.4v-.09a1.7 1.7 0 0 0-1.04-1.57 1.7 1.7 0 0 0-1.88.34l-.06.06-1.7-1.7.06-.06A1.7 1.7 0 0 0 8.44 17a1.7 1.7 0 0 0-1.57-1.04H6.8v-2.4h.07A1.7 1.7 0 0 0 8.44 12a1.7 1.7 0 0 0-.34-1.88l-.06-.06 1.7-1.7.06.06a1.7 1.7 0 0 0 1.88.34 1.7 1.7 0 0 0 1.04-1.57V7h2.4v.19a1.7 1.7 0 0 0 1.04 1.57 1.7 1.7 0 0 0 1.88-.34l.06-.06 1.7 1.7-.06.06A1.7 1.7 0 0 0 19.4 12c.16.64.71 1.1 1.37 1.1H21v2.4h-.23A1.4 1.4 0 0 0 19.4 15Z" />
      </>
    ),
    menu: (
      <>
        <path d="M4 6h16M4 12h16M4 18h16" />
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

function App() {
  const [activeView, setActiveView] = useState("dashboard")
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [showDebtModal, setShowDebtModal] = useState(false)
  const [showClientModal, setShowClientModal] = useState(false)
  const [showPaymentModal, setShowPaymentModal] = useState(false)
  const [showSettingsModal, setShowSettingsModal] = useState(false)
  const [showHelpModal, setShowHelpModal] = useState(false)
  const [showNotifications, setShowNotifications] = useState(false)
  const [selectedDebt, setSelectedDebt] = useState(null)
  const [search, setSearch] = useState("")

  const [settings, setSettings] = useState(() => {
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
    localStorage.setItem("kobri_settings", JSON.stringify(settings))
  }, [settings])

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
    const overdue = debtRows
      .filter((debt) => debt.status.className === "overdue")
      .reduce((sum, debt) => sum + debt.balance, 0)

    return {
      totalDebt,
      totalPaid,
      totalPending,
      overdue,
    }
  }, [debtRows])

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

  function navigate(view) {
    setActiveView(view)
    setSearch("")
    setSidebarOpen(false)
  }

  function addClient(event) {
    event.preventDefault()

    if (!clientForm.name.trim()) return

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

  const notifications = useMemo(() => {
    if (!settings.notifications) return []

    return debtRows
      .filter((debt) => debt.status.className !== "paid")
      .sort((a, b) => a.dueDate.localeCompare(b.dueDate))
      .slice(0, 4)
  }, [debtRows, settings.notifications])

  function saveSettings(event) {
    event.preventDefault()
    setShowSettingsModal(false)
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

        <button className="workspace" onClick={() => setShowSettingsModal(true)}>
          <div className="workspace-avatar">K</div>
          <div>
            <strong>{settings.businessName || "Mi negocio"}</strong>
            <span>Plan gratuito</span>
          </div>
          <Icon name="arrow" size={17} />
        </button>

        <nav className="navigation">
          <div className="nav-label">GESTIÓN</div>

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
          <button className="help-card" onClick={() => setShowHelpModal(true)}>
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
            <div className="notification-wrap">
              <button
                className={`icon-button notification ${showNotifications ? "is-open" : ""}`}
                onClick={() => setShowNotifications((current) => !current)}
                aria-label="Notificaciones"
                aria-expanded={showNotifications}
              >
                <Icon name="bell" size={19} />
                {notifications.length > 0 && <i />}
              </button>

              {showNotifications && (
                <div className="notification-popover">
                  <div className="popover-head">
                    <div>
                      <strong>Notificaciones</strong>
                      <span>{notifications.length} pendientes</span>
                    </div>
                    <button onClick={() => setShowNotifications(false)} aria-label="Cerrar">
                      <Icon name="close" size={15} />
                    </button>
                  </div>
                  {notifications.length === 0 ? (
                    <div className="notification-empty">
                      <Icon name="check" size={18} />
                      <span>No tienes notificaciones nuevas.</span>
                    </div>
                  ) : (
                    <div className="notification-list">
                      {notifications.map((item) => (
                        <button
                          key={item.id}
                          className="notification-item"
                          onClick={() => {
                            setShowNotifications(false)
                            navigate("debts")
                          }}
                        >
                          <span className={`notification-dot ${item.status.className}`} />
                          <span>
                            <strong>{item.client?.name || "Cliente"}</strong>
                            <small>{item.status.label} · {money(item.balance)}</small>
                          </span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>

            <button
              className={`icon-button settings-button ${showSettingsModal ? "is-open" : ""}`}
              onClick={() => setShowSettingsModal(true)}
              aria-label="Configuración"
            >
              <Icon name="settings" size={18} />
            </button>

            <button className="top-profile" onClick={() => setShowSettingsModal(true)}>
              <div className="top-avatar">K</div>
              <div className="top-profile-text">
                <strong>{settings.businessName || "Mi negocio"}</strong>
                <span>Administrador</span>
              </div>
            </button>
          </div>
        </header>

        <div className="page-content">
          {activeView === "dashboard" && (
            <>
              <section className="hero">
                <div>
                  <div className="eyebrow">VISIÓN GENERAL</div>
                  <h1>
                    Buenos días <span>👋</span>
                  </h1>
                  <p>
                    {pageTitle()[1]}
                  </p>
                </div>

                <button
                  className="primary-button"
                  onClick={() => setShowDebtModal(true)}
                >
                  <Icon name="plus" size={18} />
                  Nueva deuda
                </button>
              </section>

              <section className="stats-grid">
                <div className="stat-card">
                  <div className="stat-head">
                    <span>Por cobrar</span>
                    <div className="stat-icon blue">
                      <Icon name="wallet" size={18} />
                    </div>
                  </div>
                  <strong>{money(stats.totalPending)}</strong>
                  <div className="stat-footer">
                    <span className="neutral">Saldo pendiente</span>
                  </div>
                </div>

                <div className="stat-card">
                  <div className="stat-head">
                    <span>Cobrado</span>
                    <div className="stat-icon green">
                      <Icon name="check" size={18} />
                    </div>
                  </div>
                  <strong>{money(stats.totalPaid)}</strong>
                  <div className="stat-footer">
                    <span className="positive">
                      <Icon name="trend" size={13} />
                      Pagos registrados
                    </span>
                  </div>
                </div>

                <div className="stat-card">
                  <div className="stat-head">
                    <span>Vencido</span>
                    <div className="stat-icon red">
                      <Icon name="calendar" size={18} />
                    </div>
                  </div>
                  <strong>{money(stats.overdue)}</strong>
                  <div className="stat-footer">
                    <span className="danger-text">Requiere atención</span>
                  </div>
                </div>

                <div className="stat-card">
                  <div className="stat-head">
                    <span>Clientes</span>
                    <div className="stat-icon purple">
                      <Icon name="users" size={18} />
                    </div>
                  </div>
                  <strong>{clients.length}</strong>
                  <div className="stat-footer">
                    <span className="neutral">Clientes registrados</span>
                  </div>
                </div>
              </section>

              <section className="dashboard-grid">
                <div className="panel large-panel">
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
                    <DebtTable rows={debtRows.slice(0, 5)} onPay={openPayment} />
                  )}
                </div>

                <div className="panel">
                  <div className="panel-header">
                    <div>
                      <h2>Próximos vencimientos</h2>
                      <p>Deudas pendientes.</p>
                    </div>
                  </div>

                  <div className="upcoming-list">
                    {debtRows
                      .filter((item) => item.status.className !== "paid")
                      .sort((a, b) =>
                        a.dueDate.localeCompare(b.dueDate)
                      )
                      .slice(0, 5)
                      .map((debt) => (
                        <div className="upcoming-item" key={debt.id}>
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

                          <strong className="upcoming-amount">
                            {money(debt.balance)}
                          </strong>
                        </div>
                      ))}

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
              </section>
            </>
          )}

          {activeView === "clients" && (
            <section className="page-section">
              <section className="page-heading">
                <div>
                  <div className="eyebrow">GESTIÓN DE CLIENTES</div>
                  <h1>Clientes</h1>
                  <p>{pageTitle()[1]}</p>
                </div>

                <button
                  className="primary-button"
                  onClick={() => setShowClientModal(true)}
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
                    <table>
                      <thead>
                        <tr>
                          <th>CLIENTE</th>
                          <th>CONTACTO</th>
                          <th>DEUDA</th>
                          <th>ESTADO</th>
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
                              <td>
                                <div className="client-cell client-cell--compact">
                                  <div className="client-avatar">
                                    {client.name.charAt(0).toUpperCase()}
                                  </div>
                                  <div className="client-main-info">
                                    <strong>{client.name}</strong>
                                    <span>{client.phone || "Sin teléfono"}</span>
                                  </div>
                                </div>
                              </td>

                              <td>
                                <div className="contact-cell">
                                  <span className="contact-email">{client.email || "Sin correo"}</span>
                                </div>
                              </td>

                              <td>
                                <strong>{money(balance)}</strong>
                              </td>

                              <td>
                                <span
                                  className={`status ${
                                    balance > 0 ? "pending" : "paid"
                                  }`}
                                >
                                  {balance > 0 ? "Con saldo" : "Al día"}
                                </span>
                              </td>

                              <td>
                                <button className="row-action">
                                  <Icon name="more" size={18} />
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
                  <div className="eyebrow">CUENTAS POR COBRAR</div>
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
                  <div className="eyebrow">MOVIMIENTOS</div>
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
                    <table>
                      <thead>
                        <tr>
                          <th>CLIENTE</th>
                          <th>CONCEPTO</th>
                          <th>MONTO</th>
                          <th>MÉTODO</th>
                          <th>FECHA</th>
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
                              <td>
                                <div className="client-cell">
                                  <div className="client-avatar">
                                    {client?.name?.charAt(0) || "K"}
                                  </div>
                                  <div>
                                    <strong>
                                      {client?.name || "Cliente"}
                                    </strong>
                                    <span>Pago recibido</span>
                                  </div>
                                </div>
                              </td>

                              <td>
                                <strong>{debt?.concept || "—"}</strong>
                              </td>

                              <td>
                                <strong className="payment-amount">
                                  +{money(payment.amount)}
                                </strong>
                              </td>

                              <td>
                                <span className="method-pill">
                                  {payment.method}
                                </span>
                              </td>

                              <td>
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

      {showSettingsModal && (
        <Modal
          title="Configuración"
          subtitle="Personaliza Kobri para tu negocio."
          onClose={() => setShowSettingsModal(false)}
          wide
        >
          <form onSubmit={saveSettings}>
            <div className="settings-layout">
              <div className="settings-section">
                <div className="settings-section-head">
                  <strong>Negocio</strong>
                  <span>Información básica de tu cuenta.</span>
                </div>

                <div className="form-grid">
                  <label className="full">
                    Nombre del negocio
                    <input
                      autoFocus
                      value={settings.businessName}
                      onChange={(event) =>
                        setSettings({ ...settings, businessName: event.target.value })
                      }
                      placeholder="Mi negocio"
                    />
                  </label>

                  <label>
                    Teléfono
                    <input
                      value={settings.phone}
                      onChange={(event) =>
                        setSettings({ ...settings, phone: event.target.value })
                      }
                      placeholder="809-000-0000"
                    />
                  </label>

                  <label>
                    Moneda principal
                    <select
                      value={settings.currency}
                      onChange={(event) =>
                        setSettings({ ...settings, currency: event.target.value })
                      }
                    >
                      <option value="DOP">Peso dominicano (RD$)</option>
                    </select>
                  </label>
                </div>
              </div>

              <div className="settings-section">
                <div className="settings-section-head">
                  <strong>Notificaciones</strong>
                  <span>Controla los avisos importantes de tus cobros.</span>
                </div>

                <label className="setting-toggle-row">
                  <input
                    type="checkbox"
                    checked={settings.notifications}
                    onChange={(event) =>
                      setSettings({ ...settings, notifications: event.target.checked })
                    }
                  />
                  <span>
                    <strong>Recibir notificaciones</strong>
                    <small>Vencimientos y pagos pendientes.</small>
                  </span>
                </label>
              </div>

              <div className="settings-plan-card">
                <div>
                  <span>PLAN ACTUAL</span>
                  <strong>Gratis</strong>
                  <small>Ideal para comenzar a organizar tus cobros.</small>
                </div>
                <button type="button" className="secondary-button" onClick={() => { setShowSettingsModal(false); setShowHelpModal(true) }}>
                  Conocer planes
                </button>
              </div>
            </div>

            <ModalActions
              onCancel={() => setShowSettingsModal(false)}
              submit="Guardar cambios"
            />
          </form>
        </Modal>
      )}

      {showHelpModal && (
        <Modal
          title="Centro de ayuda"
          subtitle="Respuestas rápidas para empezar con Kobri."
          onClose={() => setShowHelpModal(false)}
        >
          <div className="help-modal-content">
            <div className="help-topic">
              <span>01</span>
              <div><strong>Clientes</strong><p>Registra a quién le debes cobrar y mantén sus datos organizados.</p></div>
            </div>
            <div className="help-topic">
              <span>02</span>
              <div><strong>Deudas</strong><p>Crea una cuenta pendiente con concepto, monto y fecha de vencimiento.</p></div>
            </div>
            <div className="help-topic">
              <span>03</span>
              <div><strong>Pagos</strong><p>Usa Cobrar para registrar cada pago y actualizar automáticamente el saldo.</p></div>
            </div>
            <div className="help-contact">¿Necesitas asistencia? Escríbenos cuando habilitemos el canal de soporte de tu cuenta.</div>
          </div>
        </Modal>
      )}

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
    </div>
  )
}

function DebtTable({ rows, onPay, detailed = false }) {
  return (
    <div className="table-wrapper">
      <table>
        <thead>
          <tr>
            <th>CLIENTE</th>
            <th>CONCEPTO</th>
            <th>MONTO</th>
            {detailed && <th>VENCIMIENTO</th>}
            <th>ESTADO</th>
            <th />
          </tr>
        </thead>

        <tbody>
          {rows.map((debt) => (
            <tr key={debt.id}>
              <td>
                <div className="client-cell client-cell--compact">
                  <div className="client-avatar">
                    {debt.client?.name?.charAt(0) || "K"}
                  </div>

                  <div>
                    <strong>{debt.client?.name || "Cliente"}</strong>
                    <span>{debt.client?.phone || "Sin teléfono"}</span>
                  </div>
                </div>
              </td>

              <td>
                <div className="debt-concept debt-concept--compact">
                  <strong>{debt.concept}</strong>
                  <span>Ver detalle de la deuda</span>
                </div>
              </td>

              <td>
                <div className="amount-cell">
                  <strong>{money(debt.balance)}</strong>
                  {debt.paid > 0 && (
                    <span>de {money(debt.amount)}</span>
                  )}
                </div>
              </td>

              {detailed && (
                <td>
                  <div className="date-cell">
                    <Icon name="calendar" size={15} />
                    {new Date(
                      `${debt.dueDate}T12:00:00`
                    ).toLocaleDateString("es-DO", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })}
                  </div>
                </td>
              )}

              <td>
                <span className={`status ${debt.status.className}`}>
                  <i />
                  {debt.status.label}
                </span>
              </td>

              <td>
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

function Modal({ title, subtitle, onClose, children, wide = false }) {
  return (
    <div className="modal-backdrop" onMouseDown={onClose}>
      <div className={`modal ${wide ? "modal-wide" : ""}`} onMouseDown={(event) => event.stopPropagation()}>
        <div className="modal-header">
          <div>
            <h2>{title}</h2>
            <p>{subtitle}</p>
          </div>

          <button className="modal-close" onClick={onClose}>
            <Icon name="close" size={19} />
          </button>
        </div>

        {children}
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
