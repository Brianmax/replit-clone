import React from 'react';
import ReactDOM from 'react-dom/client';
import { EditorApp } from './EditorApp.jsx';
import './index.css';
import { BrowserRouter } from 'react-router-dom';

ReactDOM.createRoot(document.getElementById('root')).render(
	<BrowserRouter>
		<EditorApp />
	</BrowserRouter>
);
