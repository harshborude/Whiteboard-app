// import Board from "./components/Board";
// import Toolbar from "./components/Toolbar";
// import Toolbox from "./components/Toolbox";
// import BoardProvider from "./store/BoardProvider";
// import ToolboxProvider from "./store/ToolboxProvider";
import React from 'react';
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import Login from './pages/Login';
import Profile from './pages/Profile';
 import Register from './pages/Register'; // Add this import

function App() {
  return (
    // <BoardProvider>
    //   <ToolboxProvider>
    //     <Toolbar />
    //     <Board />
    //     <Toolbox />
    //   </ToolboxProvider>
    // </BoardProvider>
    <Router>
     

<Routes>
  <Route path="/login" element={<Login />} />
  <Route path="/register" element={<Register />} />
  <Route path="/profile" element={<Profile />} />
  <Route path="/" element={<Login />} />
</Routes>

    </Router> 
  );
}

export default App;
