import * as React from 'react';
import * as ReactDOM from 'react-dom';
import Dialog from './dialog';

chrome.tabs.query({ active: true, currentWindow: true }, tab => {
    ReactDOM.render(<Dialog />, document.getElementById('open-dialog'));
});
