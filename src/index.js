import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import { StoreProvider } from "./stateManagement/store";

ReactDOM.render(
  // <React.StrictMode>
     <StoreProvider>
       <App />
    </StoreProvider>,
  
  
  document.getElementById('root')
);


