import { useEffect, useState } from "react";

type BreakpointKey = "sm" | "md" | "lg" | "xl" | "2xl";

const breakpoints: Record<BreakpointKey, number> = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  "2xl": 1536,
};

type Breakpoints = {
  windowWidth: number;
  isSm: boolean;
  isMd: boolean;
  isLg: boolean;
  isXl: boolean;
  is2xl: boolean;
};

const useBreakpoints = (): Breakpoints => {
  const [windowWidth, setWidth] = useState<number>(window.innerWidth);

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
