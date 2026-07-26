"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

type Theme = "light" | "dark";

interface ThemeContextValue {
  theme: Theme;

  toggleTheme: () => void;
}

const ThemeContext =
  createContext<ThemeContextValue | null>(null);

const STORAGE_KEY = "zowasel-theme";

function getInitialTheme(): Theme {
  if (typeof window === "undefined") {
    return "light";
  }

  const stored = localStorage.getItem(
    STORAGE_KEY
  ) as Theme | null;

  if (stored === "light" || stored === "dark") {
    return stored;
  }

  return window.matchMedia(
    "(prefers-color-scheme: dark)"
  ).matches
    ? "dark"
    : "light";
}

export function ThemeProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [theme, setTheme] = useState<Theme>(
    "light"
  );

  useEffect(() => {
    // Deliberately deferred: reading localStorage/matchMedia during the
    // initial render would make server and client output disagree (SSR
    // always sees "light"), causing a hydration mismatch on anything that
    // renders differently per theme (e.g. the toggle's icon). Correcting
    // after mount trades a one-frame flash for a guaranteed-consistent hydrate.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setTheme(getInitialTheme());
  }, []);

  useEffect(() => {
    const root = document.documentElement;

    root.classList.toggle(
      "dark",
      theme === "dark"
    );

    localStorage.setItem(STORAGE_KEY, theme);
  }, [theme]);

  const value = useMemo(
    () => ({
      theme,
      toggleTheme: () =>
        setTheme((current) =>
          current === "dark" ? "light" : "dark"
        ),
    }),
    [theme]
  );

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error(
      "useTheme must be used within ThemeProvider"
    );
  }

  return context;
}
