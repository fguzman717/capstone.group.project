import { useState } from "react";
import "./RegisterLogin.css";
import { useNavigate } from "react-router-dom";

const Login = ({ setToken }) => {
  const [username, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    const login = await loginUser(email, password); // should this be username and pw?
    console.log(login);
    setToken(login.token);
    setUserName("");
    setEmail("");
    setPassword("");
    localStorage.setItem("authToken", login.token);
    navigate("/");
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <form onSubmit={handleSubmit}>
          <h1>Login</h1>

          <div className="form-group">
            <label htmlFor="username">Username:</label>
            <input
              type="text"
              required
              name="username"
              id="username"
              value={username}
              placeholder="Username"
              onChange={(event) => setUserName(event.target.value)}
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email:</label>
            <input
              type="text"
              required
              name="email"
              id="email"
              value={email}
              placeholder="Email"
              onChange={(event) => setEmail(event.target.value)}
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password:</label>
            <input
              type="password"
              required
              name="password"
              id="password"
              value={password}
              placeholder="Password"
              onChange={(event) => setPassword(event.target.value)}
            />
          </div>

          <button type="submit">Login</button>
        </form>
      </div>
    </div>
  );
};

export default Login;
