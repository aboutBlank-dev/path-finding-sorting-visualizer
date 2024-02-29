import "./App.css";
import { ThemeToggleButton } from "./components/themeToggleButton";
import { useTheme } from "./contexts/themeContext";

function App() {
  const { currentTheme } = useTheme();
  return (
    <div>
      <ThemeToggleButton />
      <div>Current Theme is {currentTheme}</div>
    </div>
  );
  return;
}

export default App;
