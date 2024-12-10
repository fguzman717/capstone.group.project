import "./Navbar.css";
import { Link } from "react-router-dom";
import { isLoggedIn } from "./auth/isLoggedIn";
import { Login } from "./Login";
import { fetchSingleUser } from "../../../server/db";
//import { to } from "react";

export default function Navbar() {
  //() => {
  const userPrivileges = fetchSingleUser.response.isAdmin;

  if (!isLoggedIn) {
    return (
      <nav className="nav">
        <Link to="/" className="site-title">
          Capstone Reviews{" "}
        </Link>
        <ul>
          {" "}
          <li>
            {" "}
            <Link to="/login">Login</Link>
          </li>
        </ul>
      </nav>
    );
    // only present the login and the site title
  }

  if (isLoggedIn && (userPrivileges = false)) {
    // show all except admin
    return (
      <nav className="nav">
        <Link to="/" className="site-title">
          Capstone Reviews
        </Link>
        <ul>
          <li>
            <Link to="/items">Restaurants</Link>
          </li>
          <li>
            <Link to="/categories">Cuisines</Link>
          </li>
          <li>
            <Link to="/about">About</Link>
          </li>
          <li>
            <Link to="/logout">Log out</Link>
          </li>
        </ul>
      </nav>
    );
  }

  if (isLoggedIn && (userPrivileges = true)) {
    return (
      <nav className="nav">
        <Link to="/" className="site-title">
          Capstone Reviews
        </Link>
        <ul>
          <li>
            <Link to="/items">Restaurants</Link>
          </li>
          <li>
            <Link to="/categories">Cuisines</Link>
          </li>
          <li>
            <Link to="/about">About</Link>
          </li>
          <li>
            <Link to="/admin" className="admin-only">
              Admin
            </Link>
          </li>
          <li>
            <Link to="/logout">Log out</Link>
          </li>
        </ul>
      </nav>
    );
  }
}
