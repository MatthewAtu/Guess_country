import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import Home from './homepage/homepage';
import Searchbar from './homepage/searchbar';
import GameHints from './homepage/gamehints';
import Refresh from './homepage/refresh'
import reportWebVitals from './reportWebVitals';


const root = ReactDOM.createRoot(document.getElementById('root'));



root.render(
  
  <React.StrictMode>
    <Home />
    <Searchbar />
    <GameHints />
  </React.StrictMode>
  
  
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
