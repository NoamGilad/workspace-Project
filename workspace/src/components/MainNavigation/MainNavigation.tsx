import { NavLink, useNavigate } from "react-router-dom";
import { useContext, useState } from "react";
import { AuthCtx } from "../../contexts/AuthProvider";
import styled from "styled-components";
import i18n from "i18next";
import { useTranslation } from "react-i18next";

const Header = styled.header`
  background-color: #263238;
  padding: 10px 0;
  text-align: center;
  align-items: center;
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

  button {
    margin: 0px;
  }
`;

const StyledNavLink = styled(NavLink)`
  text-decoration: none;
  color: #b0bec5;
  font-size: 16px;
  transition: color 0.2s;

  &.active {
    font-weight: bold;
    color: #607d8b;
  }
`;

const LogoutButton = styled.button`
  background-color: #da1e37;

  &:hover {
    background-color: #854242;
  }
`;

const LangDiv = styled.div`
  margin: 0px;
  margin-top: 2px;
`;

const LanguageButton = styled.button`
  margin: auto;
  /* margin-top: 4px; */
  background-color: #263238;
  color: #b0bec5;

  &:hover {
    background-color: #263238;
  }

  &:focus {
    outline: none;
  }

  &.underline {
    text-decoration: underline;
  }
`;

const MainNavigation = () => {
  const context = useContext(AuthCtx);
  const navigate = useNavigate();
  const { t } = useTranslation();

  const [selectedLanguage, setSelectedLanguage] = useState("");

  const handleLanguageChange = (code: string) => {
    i18n.changeLanguage(code);
    setSelectedLanguage(code);
  };

  if (!context) return <h2>No context!</h2>;

  const languageButtons = [
    { code: "he", label: "Hebrew" },
    { code: "en", label: "English" },
  ];

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
          <LangDiv>
            {languageButtons.map((button) => (
              <LanguageButton
                key={button.code}
                type="submit"
                onClick={() => handleLanguageChange(button.code)}
                className={selectedLanguage === button.code ? "underline" : ""}
              >
                {button.label}
              </LanguageButton>
            ))}
          </LangDiv>
          <ListItem>
            <StyledNavLink to="/" end>
              {t("nav.home")}
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
            <>
              <ListItem>
                <StyledNavLink to="/user" end>
                  {t("nav.profile")}
                </StyledNavLink>
              </ListItem>
              <ListItem>
                <StyledNavLink to="/user/stats">{t("nav.stats")}</StyledNavLink>
              </ListItem>
            </>
          )}
          {context.loggedIn && context.role === "Employer" && (
            <ListItem>
              <StyledNavLink to="/admin">Control</StyledNavLink>
            </ListItem>
          )}
          {context.loggedIn && (
            <ListItem>
              <LogoutButton onClick={onLogoutHandler}>
                {t("nav.logout")}
              </LogoutButton>
            </ListItem>
          )}
        </List>
      </nav>
    </Header>
  );
};

export default MainNavigation;
