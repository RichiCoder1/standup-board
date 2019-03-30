import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import { ModuleSetup, ModuleInfo } from './ModuleContext';

const params: { [key: string]: string } = {};
document.location.search.substr(1).split('&').forEach(pair => {
  const [key, value] = pair.split('=');
  params[key] = decodeURIComponent(value);
});

ReactDOM.render(
    <ModuleSetup initialState={params as any as ModuleInfo}>
        <BrowserRouter>
            <App />
        </BrowserRouter>
    </ModuleSetup>, 
    document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();