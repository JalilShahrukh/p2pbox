import registerServiceWorker from './registerServiceWorker';
import ReactDOM from 'react-dom';
import React from 'react';
import App from './App';

ReactDOM.render(<App />, document.getElementById('root'));
registerServiceWorker();