import { useState, useEffect } from "react";

export interface DimensionsProps {
  isMobile: boolean;
  isTablet: boolean;
}

export const useDimensions = (): DimensionsProps => {
  const [isMobile, setIsMobile] = useState<boolean>(false);
  const [isTablet, setIsTablet] = useState<boolean>(false);

  const handleResize = () => {
    if (window.innerWidth <= 768) {
      setIsMobile(true);
      setIsTablet(false);
    } else if (window.innerWidth > 768 && window.innerWidth < 1024) {
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

  return {
    isMobile,
    isTablet,
  };
};
