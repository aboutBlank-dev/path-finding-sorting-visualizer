import { Link } from "react-router-dom";
import "./navBar.css";
import { ThemeToggleButton } from "./themeToggleButton";
import { DEFAULT_SORTING_ALGORITHM } from "../contexts/sortingContext";
import { DEFAULT_PATHFINDING_ALGORITHM } from "../contexts/pathfindingContext";

const NavBar = () => {
  return (
    <nav className='nav-bar'>
      <div>
        <ul>
          <li>
            <Link to={"/sorting-visualizer/" + DEFAULT_SORTING_ALGORITHM}>
              Sorting
            </Link>
          </li>
          <li>
            <Link
              to={"/pathfinding-visualizer/" + DEFAULT_PATHFINDING_ALGORITHM}
            >
              Pathfinding
            </Link>
          </li>
        </ul>
      </div>
      <ThemeToggleButton />
    </nav>
  );
};

export default NavBar;
