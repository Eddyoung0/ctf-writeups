import { createContext, useEffect } from "react";
import React from "react";

export const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = React.useState(() => {
    // Get theme from localStorage on initial load
    const savedTheme = localStorage.getItem("theme");
    return savedTheme || "light";
  });

  // Update DOM and localStorage when theme changes
  useEffect(() => {
    const htmlElement = document.documentElement;
    
    if (theme === "dark") {
      htmlElement.classList.add("dark");
    } else {
      htmlElement.classList.remove("dark");
    }
    
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prevTheme => prevTheme === "light" ? "dark" : "light");
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}