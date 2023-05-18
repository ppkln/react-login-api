import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import reportWebVitals from './reportWebVitals';
import {BrowserRouter,Route, Routes} from "react-router-dom";
import Login from './Login';
import Album from './Album';
import Register from './Register';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <BrowserRouter>
    <Routes>
      <Route path='/' element={<Login />} />
      <Route path='/login' element={<Login />} />
      <Route path='/album' element={<Album />} />
      <Route path='/register' element={<Register />} />
    </Routes>
  </BrowserRouter>
);

reportWebVitals();
