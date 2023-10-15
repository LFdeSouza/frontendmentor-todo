"use client";

import { useTheme } from "next-themes";
import React, { useState, useEffect } from "react";
import { IconSun, IconMoon } from "../shared/Icons";

const ThemeButton = () => {
  const { theme, setTheme } = useTheme();

  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  return (
    <button
      aria-roledescription="Toggle theme button"
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
    >
      {theme === "dark" ? (
        <IconSun className="scale-[85%]" />
      ) : (
        <IconMoon className="scale-[85%]" />
      )}
    </button>
  );
};

export default ThemeButton;
