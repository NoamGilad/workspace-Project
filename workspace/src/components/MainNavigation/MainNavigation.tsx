import { NavLink, useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AuthCtx } from "../../contexts/AuthProvider";
import styled from "styled-components";

const Header = styled.header`
  background-color: lightcoral;
  padding: 10px 0;
  text-align: center;
`;

const List = styled.ul`
  list-style: none;
  padding: 0;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const ListItem = styled.li`
  margin: 0 10px;
  text-align: center;

  & button {
    margin: 0px;
  }
`;

const StyledNavLink = styled(NavLink)`
  text-decoration: none;
  color: #333;
  font-size: 16px;
  transition: color 0.2s;

  &.active {
    font-weight: bold;
    color: darkblue;
  }
`;

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
    <Header>
      <nav>
        <List>
          <ListItem>
            <StyledNavLink to="/" end>
              Home
            </StyledNavLink>
          </ListItem>
          {!context.loggedIn && (
            <ListItem>
              <StyledNavLink to="/signin">Sign In</StyledNavLink>
            </ListItem>
          )}
          {!context.loggedIn && (
            <ListItem>
              <StyledNavLink to="/signup-admin">Sign Up Admin</StyledNavLink>
            </ListItem>
          )}
          {context.loggedIn && context.role === "Employee" && (
            <ListItem>
              <StyledNavLink to="/user">Profile</StyledNavLink>
            </ListItem>
          )}
          {context.loggedIn && context.role === "Employer" && (
            <ListItem>
              <StyledNavLink to="/admin">Control</StyledNavLink>
            </ListItem>
          )}
          {context.loggedIn && (
            <ListItem>
              <button onClick={onLogoutHandler}>Logout</button>
            </ListItem>
          )}
        </List>
      </nav>
    </Header>
  );
};

export default MainNavigation;
