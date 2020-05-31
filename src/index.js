import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import * as serviceWorker from './serviceWorker';
import Game from "./Game";
import 'purecss/build/pure.css'

ReactDOM.render(
  <React.StrictMode>
    <header>
      <h1>Retris</h1>
    </header>
    <Game/>
    <footer>
      Don't like it? Fix it <a href="https://github.com/Pebin/Retris">here</a>
    </footer>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
