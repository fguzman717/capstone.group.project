import { useState } from "react";
import "./RegisterLogin.css";
import { useNavigate } from "react-router-dom";

const baseURL = "APIURLGOESHERE";

const Register = ({ setToken }) => {
  const [username, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    const register = await registerUser(username, email, password);
    setToken(register.token);
    setUserName("");
    setEmail("");
    setPassword("");
    // localStorage.setItem("authToken", register.token);
    navigate("/account");
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <form onSubmit={handleSubmit}>
          <h1>Register</h1>

          <div className="form-group">
            <label htmlFor="userName">Username:</label>
            <input
              type="text"
              required
              name="Username"
              id="userName"
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

          <button type="submit">Register</button>
        </form>
      </div>
    </div>
  );
};

export default Register;
