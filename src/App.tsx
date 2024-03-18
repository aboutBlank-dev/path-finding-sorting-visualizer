import "./App.css";
import "./pages/Pages.css";
import "./ResizePanels.css";
import NavBar from "./components/navbar";
import Sorting from "./pages/Sorting";
import Pathfinding from "./pages/Pathfinding";
import {
  Navigate,
  Route,
  Router,
  Routes,
  createBrowserRouter,
  useRoutes,
} from "react-router-dom";
import {
  DEFAULT_SORTING_ALGORITHM,
  SortingContextProvider,
} from "./contexts/sortingContext";
import { PathfindingContextProvider } from "./contexts/pathfindingContext";

function App() {
  const sortingUrls = ["sorting-visualizer", "sorting-visualizer/:algorithm"];
  const pathfindingUrls = [
    "pathfinding-visualizer",
    "pathfinding-visualizer/:algorithm",
  ];

  const SortingPage = () => {
    return (
      <SortingContextProvider>
        <Sorting />
      </SortingContextProvider>
    );
  };

  const PathfindingPage = () => {
    return (
      <PathfindingContextProvider>
        <Pathfinding />
      </PathfindingContextProvider>
    );
  };

  const sortingRoutes = sortingUrls.map((url) => (
    <Route path={url} element={<SortingPage />} />
  ));

  const pathfindingRoutes = pathfindingUrls.map((url) => (
    <Route path={url} element={<PathfindingPage />} />
  ));

  return (
    <div>
      <NavBar />
      <Routes>
        <Route path='/' element={<Navigate to={"/sorting-visualizer"} />} />
        {sortingRoutes}
        {pathfindingRoutes}
      </Routes>
    </div>
  );
}
export default App;
