import { useEffect, useMemo, useState } from "react"
import "./App.css"

const emptyClient = {
  name: "",
  phone: "",
  email: "",
  note: "",
}

const emptyDebt = {
  clientId: "",
  concept: "",
  amount: "",
  dueDate: "",
}

function money(value) {
  return new Intl.NumberFormat("es-DO", {
    style: "currency",
    currency: "DOP",
    maximumFractionDigits: 2,
  }).format(value || 0)
}

function formatDate(date) {
  if (!date) return "—"

  return new Intl.DateTimeFormat("es-DO", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(`${date}T00:00:00`))
}

function App() {
  const [page, setPage] = useState("inicio")

  const [clients, setClients] = useState(() => {
    return JSON.parse(localStorage.getItem("kobri_clients") || "[]")
  })

  const [debts, setDebts] = useState(() => {
    return JSON.parse(localStorage.getItem("kobri_debts") || "[]")
  })

  const [payments, setPayments] = useState(() => {
    return JSON.parse(localStorage.getItem("kobri_payments") || "[]")
  })

  const [showClientModal, setShowClientModal] = useState(false)
  const [showDebtModal, setShowDebtModal] = useState(false)
  const [showPaymentModal, setShowPaymentModal] = useState(false)

  const [clientForm, setClientForm] = useState(emptyClient)
  const [debtForm, setDebtForm] = useState(emptyDebt)

  const [paymentDebt, setPaymentDebt] = useState(null)
  const [paymentAmount, setPaymentAmount] = useState("")

  const [search, setSearch] = useState("")

  useEffect(() => {
    localStorage.setItem("kobri_clients", JSON.stringify(clients))
  }, [clients])

  useEffect(() => {
    localStorage.setItem("kobri_debts", JSON.stringify(debts))
  }, [debts])

  useEffect(() => {
    localStorage.setItem("kobri_payments", JSON.stringify(payments))
  }, [payments])

  const getPaid = (debtId) => {
    return payments
      .filter((payment) => payment.debtId === debtId)
      .reduce((total, payment) => total + Number(payment.amount), 0)
  }

  const getRemaining = (debt) => {
    return Math.max(0, Number(debt.amount) - getPaid(debt.id))
  }

  const getDebtStatus = (debt) => {
    const remaining = getRemaining(debt)

    if (remaining <= 0) return "paid"

    if (
      debt.dueDate &&
      new Date(`${debt.dueDate}T23:59:59`) < new Date()
    ) {
      return "overdue"
    }

    return "pending"
  }

  const totals = useMemo(() => {
    const totalDebt = debts.reduce(
      (total, debt) => total + Number(debt.amount),
      0
    )

    const totalPaid = payments.reduce(
      (total, payment) => total + Number(payment.amount),
      0
    )

    const totalRemaining = debts.reduce(
      (total, debt) => total + getRemaining(debt),
      0
    )

    const overdue = debts
      .filter((debt) => getDebtStatus(debt) === "overdue")
      .reduce((total, debt) => total + getRemaining(debt), 0)

    return {
      totalDebt,
      totalPaid,
      totalRemaining,
      overdue,
    }
  }, [debts, payments])

  const filteredClients = clients.filter((client) => {
    const text = `${client.name} ${client.phone} ${client.email}`.toLowerCase()
    return text.includes(search.toLowerCase())
  })

  const recentDebts = [...debts]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 5)

  const upcomingDebts = [...debts]
    .filter((debt) => getDebtStatus(debt) === "pending")
    .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
    .slice(0, 5)

  function addClient(event) {
    event.preventDefault()

    if (!clientForm.name.trim()) return

    const client = {
      id: crypto.randomUUID(),
      ...clientForm,
      createdAt: new Date().toISOString(),
    }

    setClients((current) => [...current, client])
    setClientForm(emptyClient)
    setShowClientModal(false)
    setPage("clientes")
  }

  function addDebt(event) {
    event.preventDefault()

    if (
      !debtForm.clientId ||
      !debtForm.concept.trim() ||
      !Number(debtForm.amount)
    ) {
      return
    }

    const debt = {
      id: crypto.randomUUID(),
      clientId: debtForm.clientId,
      concept: debtForm.concept,
      amount: Number(debtForm.amount),
      dueDate: debtForm.dueDate,
      createdAt: new Date().toISOString(),
    }

    setDebts((current) => [...current, debt])
    setDebtForm(emptyDebt)
    setShowDebtModal(false)
    setPage("deudas")
  }

  function registerPayment(event) {
    event.preventDefault()

    const amount = Number(paymentAmount)

    if (!paymentDebt || !amount || amount <= 0) return

    const remaining = getRemaining(paymentDebt)

    if (amount > remaining) return

    const payment = {
      id: crypto.randomUUID(),
      debtId: paymentDebt.id,
      amount,
      date: new Date().toISOString(),
    }

    setPayments((current) => [...current, payment])
    setPaymentAmount("")
    setPaymentDebt(null)
    setShowPaymentModal(false)
  }

  function clientName(clientId) {
    return clients.find((client) => client.id === clientId)?.name || "Cliente"
  }

  function openPayment(debt) {
    setPaymentDebt(debt)
    setPaymentAmount("")
    setShowPaymentModal(true)
  }

  function statusLabel(status) {
    if (status === "paid") return "Pagada"
    if (status === "overdue") return "Vencida"
    return "Pendiente"
  }

  return (
    <div className="app">
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-mark">K</div>
          <span>KOBRI</span>
        </div>

        <nav className="nav">
          <button
            className={`nav-item ${page === "inicio" ? "active" : ""}`}
            onClick={() => setPage("inicio")}
          >
            <span>⌂</span>
            Inicio
          </button>

          <button
            className={`nav-item ${page === "clientes" ? "active" : ""}`}
            onClick={() => setPage("clientes")}
          >
            <span>♙</span>
            Clientes
          </button>

          <button
            className={`nav-item ${page === "deudas" ? "active" : ""}`}
            onClick={() => setPage("deudas")}
          >
            <span>▣</span>
            Deudas
          </button>

          <button
            className={`nav-item ${page === "pagos" ? "active" : ""}`}
            onClick={() => setPage("pagos")}
          >
            <span>✓</span>
            Pagos
          </button>
        </nav>

        <div className="sidebar-bottom">
          <div className="business-mini">
            <div className="avatar">K</div>
            <div>
              <strong>Mi negocio</strong>
              <small>Cuenta gratuita</small>
            </div>
          </div>
        </div>
      </aside>

      <main className="main">
        <header className="topbar">
          <div>
            <div className="mobile-brand">KOBRI</div>
          </div>

          <div className="topbar-actions">
            <button className="icon-button">🔔</button>
            <div className="profile">K</div>
          </div>
        </header>

        {page === "inicio" && (
          <>
            <div className="page-header">
              <div>
                <h1>Buenos días 👋</h1>
                <p>Aquí tienes el resumen de tu negocio.</p>
              </div>

              <button
                className="primary-button"
                onClick={() => {
                  if (clients.length === 0) {
                    setPage("clientes")
                    return
                  }

                  setDebtForm({
                    ...emptyDebt,
                    clientId: clients[0].id,
                  })
                  setShowDebtModal(true)
                }}
              >
                + Nueva deuda
              </button>
            </div>

            <section className="stats">
              <div className="stat-card">
                <span>Por cobrar</span>
                <strong>{money(totals.totalRemaining)}</strong>
                <small>Saldo pendiente</small>
              </div>

              <div className="stat-card">
                <span>Cobrado</span>
                <strong>{money(totals.totalPaid)}</strong>
                <small>Pagos registrados</small>
              </div>

              <div className="stat-card danger-card">
                <span>Vencido</span>
                <strong>{money(totals.overdue)}</strong>
                <small>Requiere atención</small>
              </div>

              <div className="stat-card">
                <span>Clientes</span>
                <strong>{clients.length}</strong>
                <small>Clientes registrados</small>
              </div>
            </section>

            <section className="dashboard-grid">
              <div className="panel">
                <div className="panel-header">
                  <div>
                    <h2>Deudas recientes</h2>
                    <p>Las últimas deudas registradas.</p>
                  </div>

                  <button
                    className="text-button"
                    onClick={() => setPage("deudas")}
                  >
                    Ver todas
                  </button>
                </div>

                {recentDebts.length === 0 ? (
                  <EmptyState
                    icon="▣"
                    title="Todavía no tienes deudas"
                    text="Crea tu primera deuda para comenzar a controlar tus cobros."
                    button="Crear deuda"
                    onClick={() => {
                      if (clients.length === 0) {
                        setPage("clientes")
                      } else {
                        setDebtForm({
                          ...emptyDebt,
                          clientId: clients[0].id,
                        })
                        setShowDebtModal(true)
                      }
                    }}
                  />
                ) : (
                  <div className="table-wrapper">
                    <table>
                      <thead>
                        <tr>
                          <th>Cliente</th>
                          <th>Concepto</th>
                          <th>Vencimiento</th>
                          <th>Saldo</th>
                          <th>Estado</th>
                        </tr>
                      </thead>
                      <tbody>
                        {recentDebts.map((debt) => {
                          const status = getDebtStatus(debt)

                          return (
                            <tr key={debt.id}>
                              <td>
                                <strong>{clientName(debt.clientId)}</strong>
                              </td>
                              <td>{debt.concept}</td>
                              <td>{formatDate(debt.dueDate)}</td>
                              <td>{money(getRemaining(debt))}</td>
                              <td>
                                <span className={`badge ${status}`}>
                                  {statusLabel(status)}
                                </span>
                              </td>
                            </tr>
                          )
                        })}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>

              <div className="panel">
                <div className="panel-header">
                  <div>
                    <h2>Próximos vencimientos</h2>
                    <p>Deudas pendientes.</p>
                  </div>
                </div>

                {upcomingDebts.length === 0 ? (
                  <div className="small-empty">
                    No hay vencimientos próximos.
                  </div>
                ) : (
                  <div className="upcoming-list">
                    {upcomingDebts.map((debt) => (
                      <div className="upcoming-item" key={debt.id}>
                        <div>
                          <strong>{clientName(debt.clientId)}</strong>
                          <small>{formatDate(debt.dueDate)}</small>
                        </div>
                        <span>{money(getRemaining(debt))}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </section>
          </>
        )}

        {page === "clientes" && (
          <>
            <div className="page-header">
              <div>
                <h1>Clientes</h1>
                <p>Administra las personas que tienen deudas contigo.</p>
              </div>

              <button
                className="primary-button"
                onClick={() => setShowClientModal(true)}
              >
                + Nuevo cliente
              </button>
            </div>

            <div className="toolbar">
              <input
                className="search"
                placeholder="Buscar cliente..."
                value={search}
                onChange={(event) => setSearch(event.target.value)}
              />
            </div>

            <div className="panel">
              {filteredClients.length === 0 ? (
                <EmptyState
                  icon="♙"
                  title={
                    clients.length === 0
                      ? "Todavía no tienes clientes"
                      : "No encontramos ese cliente"
                  }
                  text={
                    clients.length === 0
                      ? "Agrega tu primer cliente para comenzar."
                      : "Prueba con otro nombre o teléfono."
                  }
                  button={clients.length === 0 ? "Agregar cliente" : null}
                  onClick={() => setShowClientModal(true)}
                />
              ) : (
                <div className="client-grid">
                  {filteredClients.map((client) => {
                    const clientDebts = debts.filter(
                      (debt) => debt.clientId === client.id
                    )

                    const balance = clientDebts.reduce(
                      (total, debt) => total + getRemaining(debt),
                      0
                    )

                    return (
                      <div className="client-card" key={client.id}>
                        <div className="client-card-top">
                          <div className="client-avatar">
                            {client.name.charAt(0).toUpperCase()}
                          </div>

                          <div>
                            <h3>{client.name}</h3>
                            <p>{client.phone || "Sin teléfono"}</p>
                          </div>
                        </div>

                        <div className="client-info">
                          <span>Saldo pendiente</span>
                          <strong>{money(balance)}</strong>
                        </div>

                        {client.email && (
                          <div className="client-email">
                            {client.email}
                          </div>
                        )}

                        <button
                          className="secondary-button full"
                          onClick={() => {
                            setDebtForm({
                              ...emptyDebt,
                              clientId: client.id,
                            })
                            setShowDebtModal(true)
                          }}
                        >
                          + Nueva deuda
                        </button>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          </>
        )}

        {page === "deudas" && (
          <>
            <div className="page-header">
              <div>
                <h1>Deudas</h1>
                <p>Controla todo lo que tus clientes te deben.</p>
              </div>

              <button
                className="primary-button"
                onClick={() => {
                  if (clients.length === 0) {
                    setPage("clientes")
                    return
                  }

                  setDebtForm({
                    ...emptyDebt,
                    clientId: clients[0].id,
                  })
                  setShowDebtModal(true)
                }}
              >
                + Nueva deuda
              </button>
            </div>

            <div className="panel">
              {debts.length === 0 ? (
                <EmptyState
                  icon="▣"
                  title="No hay deudas registradas"
                  text="Cuando registres una deuda aparecerá aquí."
                  button={clients.length ? "Crear deuda" : "Crear cliente primero"}
                  onClick={() => {
                    if (!clients.length) {
                      setPage("clientes")
                    } else {
                      setDebtForm({
                        ...emptyDebt,
                        clientId: clients[0].id,
                      })
                      setShowDebtModal(true)
                    }
                  }}
                />
              ) : (
                <div className="table-wrapper">
                  <table>
                    <thead>
                      <tr>
                        <th>Cliente</th>
                        <th>Concepto</th>
                        <th>Total</th>
                        <th>Pagado</th>
                        <th>Saldo</th>
                        <th>Vencimiento</th>
                        <th>Estado</th>
                        <th></th>
                      </tr>
                    </thead>

                    <tbody>
                      {debts.map((debt) => {
                        const paid = getPaid(debt.id)
                        const remaining = getRemaining(debt)
                        const status = getDebtStatus(debt)

                        return (
                          <tr key={debt.id}>
                            <td>
                              <strong>{clientName(debt.clientId)}</strong>
                            </td>
                            <td>{debt.concept}</td>
                            <td>{money(debt.amount)}</td>
                            <td>{money(paid)}</td>
                            <td>
                              <strong>{money(remaining)}</strong>
                            </td>
                            <td>{formatDate(debt.dueDate)}</td>
                            <td>
                              <span className={`badge ${status}`}>
                                {statusLabel(status)}
                              </span>
                            </td>
                            <td>
                              {remaining > 0 && (
                                <button
                                  className="small-button"
                                  onClick={() => openPayment(debt)}
                                >
                                  Registrar pago
                                </button>
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
          </>
        )}

        {page === "pagos" && (
          <>
            <div className="page-header">
              <div>
                <h1>Pagos</h1>
                <p>Historial de pagos registrados.</p>
              </div>
            </div>

            <div className="panel">
              {payments.length === 0 ? (
                <EmptyState
                  icon="✓"
                  title="Todavía no hay pagos"
                  text="Los pagos que registres aparecerán aquí."
                />
              ) : (
                <div className="table-wrapper">
                  <table>
                    <thead>
                      <tr>
                        <th>Cliente</th>
                        <th>Concepto</th>
                        <th>Fecha</th>
                        <th>Pago</th>
                      </tr>
                    </thead>

                    <tbody>
                      {[...payments]
                        .sort(
                          (a, b) =>
                            new Date(b.date) - new Date(a.date)
                        )
                        .map((payment) => {
                          const debt = debts.find(
                            (item) => item.id === payment.debtId
                          )

                          if (!debt) return null

                          return (
                            <tr key={payment.id}>
                              <td>
                                <strong>
                                  {clientName(debt.clientId)}
                                </strong>
                              </td>
                              <td>{debt.concept}</td>
                              <td>
                                {new Intl.DateTimeFormat("es-DO", {
                                  day: "2-digit",
                                  month: "short",
                                  year: "numeric",
                                }).format(new Date(payment.date))}
                              </td>
                              <td>
                                <strong>{money(payment.amount)}</strong>
                              </td>
                            </tr>
                          )
                        })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </>
        )}
      </main>

      {showClientModal && (
        <Modal
          title="Nuevo cliente"
          onClose={() => setShowClientModal(false)}
        >
          <form onSubmit={addClient}>
            <label>
              Nombre completo *
              <input
                value={clientForm.name}
                onChange={(event) =>
                  setClientForm({
                    ...clientForm,
                    name: event.target.value,
                  })
                }
                placeholder="Ej. Juan Pérez"
                autoFocus
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
                placeholder="Ej. 809-555-5555"
              />
            </label>

            <label>
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

            <label>
              Nota
              <textarea
                value={clientForm.note}
                onChange={(event) =>
                  setClientForm({
                    ...clientForm,
                    note: event.target.value,
                  })
                }
                placeholder="Información adicional..."
              />
            </label>

            <div className="modal-actions">
              <button
                type="button"
                className="secondary-button"
                onClick={() => setShowClientModal(false)}
              >
                Cancelar
              </button>

              <button type="submit" className="primary-button">
                Guardar cliente
              </button>
            </div>
          </form>
        </Modal>
      )}

      {showDebtModal && (
        <Modal
          title="Nueva deuda"
          onClose={() => setShowDebtModal(false)}
        >
          {clients.length === 0 ? (
            <EmptyState
              title="Primero necesitas un cliente"
              text="Crea un cliente antes de registrar una deuda."
              button="Ir a clientes"
              onClick={() => {
                setShowDebtModal(false)
                setPage("clientes")
              }}
            />
          ) : (
            <form onSubmit={addDebt}>
              <label>
                Cliente *
                <select
                  value={debtForm.clientId}
                  onChange={(event) =>
                    setDebtForm({
                      ...debtForm,
                      clientId: event.target.value,
                    })
                  }
                >
                  {clients.map((client) => (
                    <option value={client.id} key={client.id}>
                      {client.name}
                    </option>
                  ))}
                </select>
              </label>

              <label>
                Concepto *
                <input
                  value={debtForm.concept}
                  onChange={(event) =>
                    setDebtForm({
                      ...debtForm,
                      concept: event.target.value,
                    })
                  }
                  placeholder="Ej. Compra de mercancía"
                  autoFocus
                />
              </label>

              <label>
                Monto *
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

              <div className="modal-actions">
                <button
                  type="button"
                  className="secondary-button"
                  onClick={() => setShowDebtModal(false)}
                >
                  Cancelar
                </button>

                <button type="submit" className="primary-button">
                  Guardar deuda
                </button>
              </div>
            </form>
          )}
        </Modal>
      )}

      {showPaymentModal && paymentDebt && (
        <Modal
          title="Registrar pago"
          onClose={() => setShowPaymentModal(false)}
        >
          <div className="payment-summary">
            <span>{clientName(paymentDebt.clientId)}</span>
            <strong>{paymentDebt.concept}</strong>
            <small>
              Saldo pendiente: {money(getRemaining(paymentDebt))}
            </small>
          </div>

          <form onSubmit={registerPayment}>
            <label>
              Monto del pago *
              <input
                type="number"
                min="0.01"
                max={getRemaining(paymentDebt)}
                step="0.01"
                value={paymentAmount}
                onChange={(event) =>
                  setPaymentAmount(event.target.value)
                }
                placeholder="0.00"
                autoFocus
              />
            </label>

            <div className="modal-actions">
              <button
                type="button"
                className="secondary-button"
                onClick={() => setShowPaymentModal(false)}
              >
                Cancelar
              </button>

              <button type="submit" className="primary-button">
                Registrar pago
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  )
}

function EmptyState({ icon, title, text, button, onClick }) {
  return (
    <div className="empty-state">
      {icon && <div className="empty-icon">{icon}</div>}
      <h3>{title}</h3>
      <p>{text}</p>

      {button && (
        <button className="primary-button" onClick={onClick}>
          {button}
        </button>
      )}
    </div>
  )
}

function Modal({ title, onClose, children }) {
  return (
    <div className="modal-backdrop" onMouseDown={onClose}>
      <div className="modal" onMouseDown={(event) => event.stopPropagation()}>
        <div className="modal-header">
          <h2>{title}</h2>
          <button className="close-button" onClick={onClose}>
            ×
          </button>
        </div>

        {children}
      </div>
    </div>
  )
}

export default App