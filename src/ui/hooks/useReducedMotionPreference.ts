"use client";

import { useEffect, useState } from "react";
import { useReducedMotion } from "framer-motion";

export function useReducedMotionPreference() {
  const prefersReducedMotion = useReducedMotion();
  const [systemPreference, setSystemPreference] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const handleChange = () => setSystemPreference(mediaQuery.matches);

    handleChange();
    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  return Boolean(prefersReducedMotion || systemPreference);
}
