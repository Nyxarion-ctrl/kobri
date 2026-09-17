import "./App.css"

function App() {
  return (
    <div className="app">
      <aside className="sidebar">
        <div className="logo">KOBRI</div>

        <nav className="nav">
          <div className="nav-item active">Inicio</div>
          <div className="nav-item">Clientes</div>
          <div className="nav-item">Deudas</div>
          <div className="nav-item">Pagos</div>
        </nav>
      </aside>

      <main className="main">
        <header className="header">
          <div>
            <h1 className="title">Buenos días 👋</h1>
            <p className="subtitle">
              Aquí tienes el resumen de tu negocio.
            </p>
          </div>

          <button className="button">
            + Nueva deuda
          </button>
        </header>

        <section className="cards">
          <div className="card">
            <div className="card-label">Por cobrar</div>
            <div className="card-value">RD$ 0</div>
          </div>

          <div className="card">
            <div className="card-label">Cobrado</div>
            <div className="card-value">RD$ 0</div>
          </div>

          <div className="card">
            <div className="card-label">Vencido</div>
            <div className="card-value">RD$ 0</div>
          </div>

          <div className="card">
            <div className="card-label">Clientes</div>
            <div className="card-value">0</div>
          </div>
        </section>

        <section className="content">
          <div className="section">
            <h2 className="section-title">Deudas recientes</h2>
            <div className="empty">
              Todavía no tienes deudas registradas.
            </div>
          </div>

          <div className="section">
            <h2 className="section-title">Próximos vencimientos</h2>
            <div className="empty">
              No hay vencimientos próximos.
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}

export default App