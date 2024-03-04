import { Link } from "react-router-dom";
import "./navBar.css";
import { ThemeToggleButton } from "./themeToggleButton";
import {
  DEFAULT_SORTING_ALGORITHM,
  SortingAlgorithm,
} from "../contexts/sortingContext";

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
            <Link to='/pathfinding-visualizer'>Pathfinding</Link>
          </li>
        </ul>
      </div>
      <ThemeToggleButton />
    </nav>
  );
};

export default NavBar;
