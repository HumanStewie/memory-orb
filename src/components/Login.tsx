import { useState } from "react";

export default function Login() {
  const [login, setLogin] = useState(false);
  const handleSubmit = (e) => {
    e.preventDefault();
    setLogin(true);
  };

  return (
    <div className={`login-overlay ${login ? "login-overlay-done" : ""}`}>
      <form
        onSubmit={handleSubmit}
        className={`login-form ${login ? "login-done" : ""}`}
      >
        <h2>Login</h2>
        <div className="input-group">
          <label htmlFor="username">Username:</label>
          <input
            type="text"
            id="username"
            name="username"
            placeholder="a lovely name"
          />
        </div>

        <div className="input-group">
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            name="password"
            placeholder="shhhhhh"
          ></input>
        </div>
        <button type="submit" className="btn-login">
          Log In
        </button>
      </form>
    </div>
  );
}
