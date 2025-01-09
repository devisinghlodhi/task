import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import Mainpage from './pages/mainpage'
import ReactDOM from "react-dom";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import PageFavourites from './pages/PageFavourites'


function App() {
  return (
    <>
     {/* <Mainpage/> */}
     <Router>
    <Routes>
      <Route path="/" element={<Mainpage />} />
      <Route path="/favourites" element={<PageFavourites />} />
    </Routes>
  </Router>
    </>
  )
}

export default App
