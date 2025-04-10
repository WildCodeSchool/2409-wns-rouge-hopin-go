import { useEffect, useState } from "react";

const breakpoints = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  "2xl": 1536,
};

const useBreakpoints = () => {
  const [windowWidth, setWidth] = useState(window.innerWidth);

  useEffect(() => {
    const onResize = () => setWidth(window.innerWidth);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  return {
    windowWidth,
    isSm: windowWidth >= breakpoints.sm,
    isMd: windowWidth >= breakpoints.md,
    isLg: windowWidth >= breakpoints.lg,
    isXl: windowWidth >= breakpoints.xl,
    is2xl: windowWidth >= breakpoints["2xl"],
  };
};

export default useBreakpoints;
