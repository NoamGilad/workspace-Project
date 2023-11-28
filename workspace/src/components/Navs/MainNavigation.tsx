import styled from "styled-components";
import NavContent from "./NavContent";

const Header = styled.header`
  background-color: #263238;
  padding: 10px 0;
  text-align: center;
  align-items: center;
`;

const MainNavigation = () => {
  return (
    <Header>
      <nav>
        <NavContent row={true} logoutBtn={true} />
      </nav>
    </Header>
  );
};

export default MainNavigation;
