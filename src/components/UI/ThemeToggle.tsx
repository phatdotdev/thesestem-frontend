import { Moon, Sun } from "lucide-react";
import Button from "./Button";
import { useAppDispatch, useAppSelector } from "../../app/hook";
import { setTheme } from "../../features/settings/settingsSlice";

const ThemeToggle = () => {
  const dispatch = useAppDispatch();
  const theme = useAppSelector((state) => state.settings.theme);
  const toggleTheme = () => {
    dispatch(setTheme(theme === "dark" ? "light" : "dark"));
  };
  return (
    <Button
      size="sm"
      variant="ghost"
      onClick={toggleTheme}
      icon={theme === "dark" ? Sun : Moon}
      className="rounded-full border-2 border-gray-300 dark:border-white focus:outline-none outline-none"
      aria-label="Toggle theme"
    />
  );
};

export default ThemeToggle;
