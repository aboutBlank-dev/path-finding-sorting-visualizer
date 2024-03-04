import "./App.css";
import "./pages/Pages.css";
import "./ResizePanels.css";
import NavBar from "./components/navbar";
import Sorting from "./pages/Sorting";
import Pathfinding from "./pages/Pathfinding";
import { Navigate, Route, Routes } from "react-router-dom";
import { SortingContextProvider } from "./contexts/sortingContext";

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
        <Route path='/pathfinding-visualizer' element={<Pathfinding />} />
        <Route path='*' element={<Navigate to='/' />} /> //Redirect to home if
        URL is invalid
      </Routes>
    </div>
  );
}

export default App;
