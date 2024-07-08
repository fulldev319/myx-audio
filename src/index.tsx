import './index.css';
import App from './App';
import React from 'react';
import ReactDOM from 'react-dom';

if (process.env.REACT_APP_ENV === 'prod') {
  console.log = () => {};
  console.error = () => {};
  console.debug = () => {};
}

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);
