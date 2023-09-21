import { NavLink, useNavigate } from "react-router-dom";

import { useContext } from "react";
import { AuthCtx } from "../contexts/AuthProvider";

import classes from "./MainNavigation.module.css";

const MainNavigation = () => {
  const context = useContext(AuthCtx);
  const navigate = useNavigate();

  const onLogoutHandler = () => {
    if (!context?.auth) {
      alert("No context.auth");
      return;
    }

    context?.signout();
    navigate("/signin");
  };

  return (
    <header className={classes.header}>
      <nav>
        <ul className={classes.list}>
          <li>
            <NavLink
              to="/"
              className={({ isActive }) =>
                isActive ? classes.active : undefined
              }
            >
              Home
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/signin"
              className={({ isActive }) =>
                isActive ? classes.active : undefined
              }
            >
              Sign In
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/signup"
              className={({ isActive }) =>
                isActive ? classes.active : undefined
              }
            >
              Sign Up
            </NavLink>
          </li>
          <li>
            <button onClick={onLogoutHandler}>Logout</button>
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default MainNavigation;
