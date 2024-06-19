import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';
//import PlayerZero from '@goplayerzero/sdk-web';

// This is an example script - don't forget to change it!

/*
setTimeout(() => {
    //PlayerZero.init('666b3e5c7a8a89746437d4e2');
    PlayerZero.identify('userid-123213', {
        name: 'Joe Biden',
        email: 'joe@biden.com',
        group: 'USA White House'
    });
}, 500);
*/

ReactDOM.render(<App />, document.getElementById('root'));
//PlayerZero.init('666b3e5c7a8a89746437d4e2');
registerServiceWorker();
