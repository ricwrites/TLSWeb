import { useState } from "react";
import { useNavigate } from "react-router-dom";


const API_URL = "https://thelearningsanctuary.quest";

export function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate(); // <- react-router navigation

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = { username, password };

    try {
      const res = await fetch(`${API_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        alert("Invalid login");
        return;
      }

      const json = await res.json();

      if (json.role === "teacher") {
  // redirect to static classroom pages
  window.location.href = "https://teacher.thelearningsanctuary.quest/home.html"; // or your teacher landing page
} else if (json.role === "admin") {
  // redirect to the separate admin SPA
  window.location.href = "https://admin.thelearningsanctuary.quest/";
} else {
        alert("Unknown role");
      }
    } catch (err) {
      console.error(err);
      alert("Login failed. Check console for details.");
    }
  };

  return (
    <div id="parent">
      <header className="header">
        <h1 className="pagetitle">School Website</h1>
      </header>

      <div className="loginbit">
        <h1>Login</h1>
        <form onSubmit={handleSubmit}>
          <label>
            Username:
            <input
              type="text"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </label>
          <br />
          <label>
            Password:
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </label>
          <br />
          <button type="submit">Login</button>
        </form>
      </div>
    </div>
  );
}
