import { NavLink, useNavigate } from "react-router-dom";
import { useContext, useState } from "react";
import { AuthCtx } from "../../contexts/AuthProvider";
import styled from "styled-components";
import i18n from "i18next";
import { useTranslation } from "react-i18next";
import { MenuItem, Select } from "@mui/material";
import { SelectChangeEvent } from "@mui/material/Select";
import FlagIL from "../../assets/il-flag.svg";
import FlagUS from "../../assets/us-flag.svg";

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

const Flags = styled.img`
  width: 20px;
  margin-bottom: -5px;
  margin-right: 2px;
`;

const MainNavigation = () => {
  const context = useContext(AuthCtx);
  const navigate = useNavigate();
  const { t } = useTranslation();

  if (!context) return <h2>No context!</h2>;

  const handleLanguageChange = (code: string) => {
    i18n.changeLanguage(code);
    context.setCurLanguage(code);
  };

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
          <Select
            sx={{ width: "fit-to-content", color: "#b0bec5" }}
            id="language"
            value={context.curLanguage}
            onChange={(e: SelectChangeEvent<string>) =>
              handleLanguageChange(e.target.value)
            }
            placeholder={context.curLanguage}
          >
            <MenuItem value="en">
              <Flags src={FlagUS} /> English
            </MenuItem>
            <MenuItem value="he">
              <Flags src={FlagIL} /> Hebrew
            </MenuItem>
          </Select>
          <LangDiv></LangDiv>
          <ListItem>
            <StyledNavLink to="/" end>
              {t("nav.home")}
            </StyledNavLink>
          </ListItem>
          {!context.loggedIn && (
            <ListItem>
              <StyledNavLink to="/signin">{t("nav.signin")}</StyledNavLink>
            </ListItem>
          )}
          {!context.loggedIn && (
            <ListItem>
              <StyledNavLink to="/signup-admin">
                {t("nav.signupAdmin")}
              </StyledNavLink>
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
              <StyledNavLink to="/admin">{t("nav.control")}</StyledNavLink>
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
