import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signIn } from "../api/authApi";

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      setLoading(true);
      setError("");

      const response = await signIn(email, password);

      localStorage.setItem("token", response.data.idToken);
      localStorage.setItem("email", response.data.email);
      localStorage.setItem("uid", response.data.localId);

      navigate("/dashboard");
    } catch (err) {
      setError("Invalid email or password.");
    } finally {
      setLoading(false);
    }
  };

  return (
  <main
    style={{
    minHeight: "100vh",
    width: "100%",
    margin: 0,
    padding: 0,
    display: "flex",
    flexDirection: "column",
    color: "white",
    background: "grey",
  }}
  >
    <section
      style={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <h1 style={{
        color: "cyan",
        minHeight: "50vh",
        fontSize: "70px"}}>Inventory Management</h1>

      <form
        onSubmit={handleLogin}
        style={{
            display: "grid",
            gridTemplateColumns: "90px 240px",
            gap: "12px 10px",
            alignItems: "center",
        }}
        >
        <label
            htmlFor="email"
            style={{
            textAlign: "right",
            }}
        >
            Email
        </label>

        <input
            id="email"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="Enter your email"
        />

        <label
            htmlFor="password"
            style={{
            textAlign: "right",
            }}
        >
            Password
        </label>

        <input
            id="password"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="Enter your password"
        />

        {error && (
            <p
            style={{
                gridColumn: "1 / 3",
                textAlign: "center",
                color: "red",
            }}
            >
            {error}
            </p>
        )}

        <button
            type="submit"
            disabled={loading}
            style={{
            gridColumn: "1 / 3",
            justifySelf: "center",
            }}
        >
            {loading ? "Signing in..." : "Sign In"}
        </button>
        </form>
    </section>

    <footer
      style={{
        padding: "20px",
        textAlign: "center",
        borderTop: "1px solid #ccc",
      }}
    >
      <p>
        © 2026 Arshdeep Singh Rishi. All rights reserved.
      </p>
    </footer>
  </main>
  );
}

export default Login;