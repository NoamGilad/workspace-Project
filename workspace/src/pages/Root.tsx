import { useContext } from "react";
import MainNavigation from "../components/Navs/MainNavigation";
import { Outlet } from "react-router-dom";
import { DimensionsCtx } from "../contexts/DimensionsProvider";
import DrawerNavigation from "../components/Navs/DrawerNavigation";

const RootLayout = () => {
  const dimension = useContext(DimensionsCtx);

  if (!dimension) console.error("No dimension!");

  return (
    <>
      {dimension?.isMobile ? <DrawerNavigation /> : <MainNavigation />}
      <main>
        <Outlet />
      </main>
    </>
  );
};

export default RootLayout;
