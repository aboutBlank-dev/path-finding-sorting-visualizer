import "./App.css";
import NavBar from "./components/navbar";
import Sorting from "./pages/Sorting";
import Home from "./pages/Home";
import Pathfinding from "./pages/Pathfinding";
import { Route, Routes } from "react-router-dom";

function App() {
  return (
    <div>
      <NavBar />
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/sorting-visualizer' element={<Sorting />} />
        <Route path='/pathfinding-visualizer' element={<Pathfinding />} />
      </Routes>
    </div>
  );
}

export default App;
