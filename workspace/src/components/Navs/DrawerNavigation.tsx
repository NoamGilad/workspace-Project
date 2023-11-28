import { useState } from "react";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import Button from "@mui/material/Button";
import NavContent from "./NavContent";
import { useTranslation } from "react-i18next";
type Anchor = "top";

const DrawerNavigation = () => {
  const { t } = useTranslation();

  const anchor: Anchor = "top";
  const [isOpen, setIsOpen] = useState(false);

  const toggleDrawer = (open: boolean) => () => {
    setIsOpen(open);
  };

  const list = (anchor: Anchor) => (
    <Box
      component="div"
      sx={{ width: anchor === "top" || anchor === "bottom" ? "auto" : 250 }}
      role="presentation"
      onClick={toggleDrawer(false)}
      onKeyDown={toggleDrawer(false)}
    >
      <NavContent row={false} logoutBtn={false} />
    </Box>
  );

  return (
    <div>
      <Button
        onClick={toggleDrawer(true)}
        sx={{ backgroundColor: "#263238", color: "white ", width: "100%" }}
      >
        {t("drawer.menu")}
      </Button>
      <Drawer
        PaperProps={{
          sx: {
            backgroundColor: "#263238",
          },
        }}
        anchor={anchor}
        open={isOpen}
        onClose={toggleDrawer(false)}
      >
        {list(anchor)}
      </Drawer>
    </div>
  );
};

export default DrawerNavigation;
