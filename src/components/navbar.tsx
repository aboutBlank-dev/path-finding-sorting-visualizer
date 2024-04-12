import { Link, useMatch, useResolvedPath } from "react-router-dom";
import "./navBar.css";
import { ThemeToggleButton } from "./themeToggleButton";
import GithubButton from "./githubButton";

const NavBar = () => {
  return (
    <nav className='nav-bar'>
      <div className='nav-bar-left'>
        <div className='my-logo-container'>
          <h1 className='my-logo'>[about:Blank]</h1>
        </div>
        <ul>
          <PageLink to={"/sorting-visualizer/"} text='SORTING' />
          <PageLink to={"/pathfinding-visualizer/"} text='PATHFINDING' />
        </ul>
      </div>
      <div className='nav-bar-right'>
        <ThemeToggleButton />
        <GithubButton projectLink='https://github.com/aboutBlank-dev/path-finding-sorting-visualizer' />
      </div>
    </nav>
  );
};

type PageLinkProps = {
  to: string;
  text: string;
};

function PageLink({ to, text }: PageLinkProps) {
  const resolvedPath = useResolvedPath(to);
  const isActive = useMatch({
    path: resolvedPath.pathname,
    end: false,
  });

  return (
    <li className={isActive ? "active" : ""}>
      <Link to={to}>{text}</Link>
    </li>
  );
}
export default NavBar;
