import { Link } from "react-router-dom";
import "./navBar.css";
import { ThemeToggleButton } from "./themeToggleButton";

const NavBar = () => {
  return (
    <nav className='nav-bar'>
      <div>
        <ul>
          <li>
            <Link to='/'>Home</Link>
          </li>
          <li>
            <Link to='/sorting-visualizer'>Sorting</Link>
          </li>
          <li>
            <Link to='/pathfinding-visualizer'>Pathfinding</Link>
          </li>
        </ul>
      </div>
      <ThemeToggleButton />
    </nav>
  );
};

export default NavBar;
