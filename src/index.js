import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
// import App from './App';
import Gantt from './Gantt';
// import GanttV2 from './GanttV2';
import registerServiceWorker from './registerServiceWorker';

// ReactDOM.render(<App />, document.getElementById('root'));
ReactDOM.render(<Gantt  />, document.getElementById('root'));
// ReactDOM.render(<GanttV2  />, document.getElementById('root'));
registerServiceWorker();
