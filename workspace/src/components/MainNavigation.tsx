import { NavLink } from "react-router-dom";

import classes from "./MainNavigation.module.css";
import SignInPage from "../pages/SignIn";
import SignUpPage from "../pages/SignUp";

const MainNavigation = () => {
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
            <NavLink
              to="/Loggedout"
              className={({ isActive }) =>
                isActive ? classes.active : undefined
              }
            >
              Logout
            </NavLink>
          </li>
          {/* <li>
            <SignInPage userRole={null} />
          </li>
          <li>
            <SignUpPage />
          </li> */}
        </ul>
      </nav>
    </header>
  );
};

export default MainNavigation;
