import { MenuItem, Select } from "@mui/material";
import { SelectChangeEvent } from "@mui/material/Select";
import FlagIL from "../../assets/il-flag.svg";
import FlagUS from "../../assets/us-flag.svg";
import styled from "styled-components";
import { NavLink, useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AuthCtx } from "../../contexts/AuthProvider";
import i18n from "i18next";
import { useTranslation } from "react-i18next";
import { DimensionsCtx } from "../../contexts/DimensionsProvider";

const List = styled.ul`
  list-style: none;
  padding: 0;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const ListItem = styled.li`
  margin: 10px;
  text-align: center;

  button {
    margin: 0px;
  }
`;

const StyledSelect = styled(Select)<{ $pc: boolean }>`
  margin: ${(props) => (props.$pc ? "" : "10px")};
`;

const StyledNavLink = styled(NavLink)<{ $pc: boolean }>`
  margin: ${(props) => (props.$pc ? "" : "3px")};
  text-decoration: none;
  color: #b0bec5;
  font-size: 16px;
  transition: color 0.2s;

  &.active {
    font-weight: bold;
    color: #607d8b;
  }
`;

const LogoutButton = styled.button<{ $pc: boolean }>`
  margin: ${(props) => (props.$pc ? "" : "50px")};
  background-color: #da1e37;

  &:hover {
    background-color: #854242;
  }
`;

const LangDiv = styled.div`
  margin: 0px;
  margin-top: 2px;
`;

const Flags = styled.img`
  width: 20px;
  margin-bottom: -5px;
  margin-right: 2px;
`;

const StyledList = styled(List)<{ $pc: boolean }>`
  display: flex;
  flex-direction: ${(props) => (props.$pc ? "row" : "column")};
`;

const NavContent: React.FC<{ row: boolean; logoutBtn: boolean }> = (props) => {
  const context = useContext(AuthCtx);
  const dimension = useContext(DimensionsCtx);
  const navigate = useNavigate();
  const { t } = useTranslation();

  if (!context) return <h2>No context!</h2>;

  if (!dimension) console.error("No dimension!");

  const handleLanguageChange = (code: string) => {
    i18n.changeLanguage(code);
    context.setCurLanguage(code);
  };

  const onLogoutHandler = () => {
    if (!context.auth) {
      console.error("No context.auth");
      return;
    }

    context.signout();
    navigate("/signin");
  };

  return (
    <StyledList $pc={props.row}>
      <StyledSelect
        sx={{ width: "fit-to-content", color: "#b0bec5" }}
        id="language"
        value={context.curLanguage}
        onChange={(e: SelectChangeEvent<string>) =>
          handleLanguageChange(e.target.value)
        }
        placeholder={context.curLanguage}
      >
        <MenuItem value="en">
          <Flags src={FlagUS} /> {t("nav.en")}
        </MenuItem>
        <MenuItem value="he">
          <Flags src={FlagIL} /> {t("nav.he")}
        </MenuItem>
      </StyledSelect>
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
            <StyledNavLink to="/user/stats">{t("nav.userStats")}</StyledNavLink>
          </ListItem>
        </>
      )}
      {context.loggedIn && context.role === "Employer" && (
        <>
          <ListItem>
            <StyledNavLink to="/admin" end>
              {t("nav.control")}
            </StyledNavLink>
          </ListItem>
          <ListItem>
            <StyledNavLink to="/admin/stats">
              {t("nav.adminStats")}
            </StyledNavLink>
          </ListItem>
        </>
      )}
      {context.loggedIn && (
        <ListItem>
          <LogoutButton $pc={props.logoutBtn} onClick={onLogoutHandler}>
            {t("nav.logout")}
          </LogoutButton>
        </ListItem>
      )}
    </StyledList>
  );
};

export default NavContent;
