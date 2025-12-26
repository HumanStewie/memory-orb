import { useEffect, useState } from "react";

export default function Login() {
  const [login, setLogin] = useState(false);
  const [isSignup, setIsSignup] = useState(false);
  const [isAuth, setIsAuth] = useState(true);
  useEffect(() => {
    const stored_token = localStorage.getItem("token");
    if (stored_token != null) {
      setLogin(true);
    }
  });
  const handleSubmit = async (e: any) => {
    e.preventDefault();

    // Get form data and turning it into FastAPI-readable JSON file
    const formData = new FormData(e.currentTarget);
    const objJson = Object.fromEntries(formData);
    try {
      const response = await fetch(
        `http://127.0.0.1:8000/${isSignup ? "signup" : "login"}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(objJson), // We send it to the server here. - This goes into the "data" that was made using Pydantic model LoginData
        }
      );
      const data = await response.json();
      if (response.ok) {
        // Status: 200
        localStorage.setItem("token", data.access_token);
        setLogin(true);
      } else if (response.status == 400) {
        // Status: 400
        setIsAuth(false);
      } else {
        // Any other status code
        throw new Error(`Response status: ${response.status}`);
      }
    } catch (error: any) {
      console.log(error.message);
    }
  };
  const handleLogout = async (e: any) => {
    e.preventDefault();
    localStorage.removeItem("token");
    setLogin(false);
  };
  const handleDelete = async (e: any) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    const mem_id = localStorage.getItem("mem_id")!;
    const currIndex = localStorage.getItem("index")!;
    try {
      const response = await fetch(
        `http://127.0.0.1:8000/delete_memory/memory_id=${
          mem_id[Number(currIndex)]
        }`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (!response.ok) {
        throw new Error(`Response status: ${response.status}`);
      }
      window.location.reload();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <button className="logout-btn" onClick={handleLogout}>
        Log Out
      </button>
      <button className="delete-btn" onClick={handleDelete}>
        Delete Memory
      </button>
      <div className={`login-overlay ${login ? "login-overlay-done" : ""}`}>
        <form
          onSubmit={handleSubmit}
          id="loginform"
          className={`login-form ${login ? "login-done" : ""}`}
        >
          <div style={{ display: "flex" }}>
            <h2
              style={{
                marginRight: "169px",
                cursor: "pointer",
                transition: "0.3s",
                opacity: isSignup ? "50%" : "100%",
              }}
              onClick={() => {
                setIsSignup(false);
                setIsAuth(true);
              }}
            >
              Login
            </h2>
            <h2
              style={{
                opacity: isSignup ? "100%" : "50%",
                cursor: "pointer",
                transition: "0.3s",
              }}
              onClick={() => {
                setIsSignup(true);
                setIsAuth(true);
              }}
            >
              Sign up
            </h2>
          </div>
          <div className="input-group">
            <label htmlFor="username">Username:</label>
            <input
              type="text"
              id="username"
              name="username"
              placeholder={isSignup ? "some lovely name" : "your lovely name"}
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
          <button type="submit" className="btn-login" value={"login"}>
            {isSignup
              ? isAuth
                ? "Sign Up"
                : "Sign up - Username taken"
              : isAuth
              ? "Log In"
              : "Log In - Invalid user/pw"}
          </button>
        </form>
      </div>
    </>
  );
}
