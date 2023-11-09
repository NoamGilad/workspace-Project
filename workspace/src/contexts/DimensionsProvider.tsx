import { createContext, useState, useEffect } from "react";

type DimensionsContextType = { isMobile: boolean; isTablet: boolean };

export const DimensionsCtx = createContext<DimensionsContextType | null>(null);

export const DimensionsProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [isMobile, setIsMobile] = useState<boolean>(false);
  const [isTablet, setIsTablet] = useState<boolean>(false);

  const handleResize = () => {
    if (window.innerWidth <= 570) {
      setIsMobile(true);
      setIsTablet(false);
    } else if (window.innerWidth > 570 && window.innerWidth < 1024) {
      setIsMobile(false);
      setIsTablet(true);
    } else if (window.innerWidth > 1024) {
      setIsMobile(false);
      setIsTablet(false);
    }
  };

  useEffect(() => {
    handleResize();
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <DimensionsCtx.Provider value={{ isMobile, isTablet }}>
      {children}
    </DimensionsCtx.Provider>
  );
};
