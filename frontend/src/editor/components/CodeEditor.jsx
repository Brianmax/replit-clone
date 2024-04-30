import { Editor } from '@monaco-editor/react';
import React, { useContext, useEffect, useRef, useState } from 'react';
import { MonacoBinding } from 'y-monaco';
import { WebrtcProvider } from 'y-webrtc';
import * as Y from 'yjs';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';
import Terminal from './Terminal';
import { useParams } from 'react-router-dom';
import { CopyButton } from '../../ui/components/CopyButton';
import { AuthContext } from '../../auth/context/AuthContext';


const saveScript = async (scriptId, content) => {
	const { data } = await axios.put(`http://localhost:3000/script/${scriptId}`, {
		content,
	});

	return data;
};

export const CodeEditor = ({scriptInfo}) => {

	const {id, content, name, owners} = scriptInfo;
	const [value, setValue] = useState(content);

	
	const editorRef = useRef(null);

	const [terminalResponse, setTerminalResponse] = useState('');
	const [theme, setTheme] = useState('vs-dark');

	const handleEditorDidMount = (editor, monaco) => {
		editorRef.current = editor;

		const doc = new Y.Doc();
		const provider = new WebrtcProvider(id, doc);
		const type = doc.getText('monaco');
		const binding = new MonacoBinding(
			type,
			editorRef.current.getModel(),
			new Set([editorRef.current]),
			provider.awareness
		);
		console.log(provider.awareness);
	};

	const handleEditorWillMount = e => {
		console.log('before mount:',e)
	}

	const runCode = async () => {


		const code = editorRef.current.getValue();

		try {
			const { data } = await axios.post(
				'http://localhost:3000/executor/python',
				{
					code,
					name,
				}
			);
			toast.success('Al parecer tu código está bien', {
				duration: 2000,
				position: 'bottom-center',
			});
			setTerminalResponse(data.result || 'Respuesta vacía');
		} catch (error) {
			console.log(error.response.data.error);
			toast.error('Hubo un error en tu código', {
				duration: 1000,
				position: 'bottom-center',
			});
			setTerminalResponse(
				error.response.data.error || 'Hubo un error durante la ejecución'
			);
		}
	};

	const saveCode = async () => {
		const { data } = await saveScript(id, editorRef.current.getValue());
		toast.success('Tu código se guardó correctamente!', {
			duration: 2000,
			position: 'bottom-center',
		});
	};

	const onChange = (value, event) => {
		setValue(value);
	}

	const handleThemeChange = (e) => {
		const selectedTheme = e.target.value;
		setTheme(selectedTheme);
	};

	

	return (
		<>
			<button onClick={runCode}>Run Code</button>
			<button onClick={saveCode}>Save Code</button>
			<CopyButton textToCopy={window.location.href} content={'Share'} />
			<select value={theme} onChange={handleThemeChange}>
				<option value="vs-dark">Dark</option>
				<option value="vs-light">Light</option>
				<option value="hc-black">High Contrast</option>
			</select>
			<Editor
				width="100%"
				height="90vh"
				defaultLanguage="python"
				// defaultValue={content}
				onMount={handleEditorDidMount}
				// beforeMount={handleEditorWillMount}
				theme={theme}
				// value={value}
				// onChange={onChange}
			/>
			<Toaster />
			<Terminal response={terminalResponse} />
		</>
	);
};
