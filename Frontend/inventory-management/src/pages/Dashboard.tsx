import { useState } from "react";

function Dashboard() {
  const email = localStorage.getItem("email");

  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/";
  };

  return (
    <main
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        color: "white",
        background: "grey",
      }}
    >
      <section
        style={{
          flex: 1,
          position: "relative",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {/* Hamburger Menu Button */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          style={{
            position: "absolute",
            top: "20px",
            left: "20px",
            fontSize: "30px",
            background: "transparent",
            border: "none",
            color: "white",
            cursor: "pointer",
          }}
        >
          ☰
        </button>

        {/* Dropdown Menu */}
        {menuOpen && (
          <div
            style={{
              position: "absolute",
              top: "70px",
              left: "20px",
              background: "#444",
              borderRadius: "8px",
              padding: "10px",
              display: "flex",
              flexDirection: "column",
              gap: "10px",
              minWidth: "180px",
            }}
          >
            <button
              onClick={() => (window.location.href = "/inventory")}
            >
              Inventory
            </button>

            <button
              onClick={() => (window.location.href = "/suppliers")}
            >
              Suppliers
            </button>

            <button
              onClick={() => (window.location.href = "/transactions")}
            >
              Transactions
            </button>
          </div>
        )}

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          style={{
            position: "absolute",
            top: "20px",
            right: "20px",
            padding: "8px 16px",
            cursor: "pointer",
          }}
        >
          Logout
        </button>

        <h1
          style={{
            color: "cyan",
            fontSize: "72px",
          }}
        >
          Inventory Management Dashboard
        </h1>

        <p
          style={{
            fontSize: "28px",
            marginTop: "20px",
          }}
        >
          Welcome, {email}
        </p>
      </section>

      <footer
        style={{
          padding: "20px",
          textAlign: "center",
        }}
      >
        <p>
          © 2026 Arshdeep Singh Rishi. All rights reserved.
        </p>
      </footer>
    </main>
  );
}

export default Dashboard;