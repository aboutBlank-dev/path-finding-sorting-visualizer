import "./App.css";
import "./pages/Pages.css";
import "./ResizePanels.css";
import NavBar from "./components/navbar";
import Sorting from "./pages/Sorting";
import Pathfinding from "./pages/Pathfinding";
import { Navigate, Route, Routes } from "react-router-dom";
import {
  DEFAULT_SORTING_ALGORITHM,
  SortingContextProvider,
} from "./contexts/sortingContext";
import { PathfindingContextProvider } from "./contexts/pathfindingContext";

function App() {
  return (
    <div>
      <NavBar />
      <Routes>
        <Route
          path='/sorting-visualizer/:algorithm'
          element={
            <SortingContextProvider>
              <Sorting />
            </SortingContextProvider>
          }
        />
        <Route
          path='/pathfinding-visualizer/:algorithm'
          element={
            <PathfindingContextProvider>
              <Pathfinding />
            </PathfindingContextProvider>
          }
        />
        //Redirect to sorting visualizer if URL is invalid
        <Route
          path='*'
          element={
            <Navigate to={"/sorting-visualizer/" + DEFAULT_SORTING_ALGORITHM} />
          }
        />
      </Routes>
    </div>
  );
}

export default App;
