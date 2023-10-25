import { NavLink, useNavigate } from "react-router-dom";

import { useContext } from "react";
import { AuthCtx } from "../../contexts/AuthProvider";

import classes from "./MainNavigation.module.css";

const MainNavigation = () => {
  const context = useContext(AuthCtx);
  const navigate = useNavigate();

  if (!context) return <h2>No context!</h2>;

  const onLogoutHandler = () => {
    if (!context.auth) {
      alert("No context.auth");
      return;
    }

    context.signout();
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
          {!context.loggedIn && (
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
          )}
          {!context.loggedIn && (
            <li>
              <NavLink
                to="/signup-user"
                className={({ isActive }) =>
                  isActive ? classes.active : undefined
                }
              >
                Sign Up User
              </NavLink>
            </li>
          )}
          {!context.loggedIn && (
            <li>
              <NavLink
                to="/signup-admin"
                className={({ isActive }) =>
                  isActive ? classes.active : undefined
                }
              >
                Sign Up Admin
              </NavLink>
            </li>
          )}
          {context.loggedIn && context.role === "Employee" && (
            <li>
              <NavLink
                to="/user"
                className={({ isActive }) =>
                  isActive ? classes.active : undefined
                }
              >
                Profile
              </NavLink>
            </li>
          )}
          {context.loggedIn && context.role === "Employer" && (
            <li>
              <NavLink
                to="/admin"
                className={({ isActive }) =>
                  isActive ? classes.active : undefined
                }
              >
                Control
              </NavLink>
            </li>
          )}
          {context.loggedIn && (
            <li>
              <button onClick={onLogoutHandler}>Logout</button>
            </li>
          )}
        </ul>
      </nav>
    </header>
  );
};

export default MainNavigation;
