import { Editor, loader } from '@monaco-editor/react';
import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';
import Terminal from './Terminal';
import { CopyButton } from '../../ui/components/CopyButton';
import * as monaco from 'monaco-editor';
import editorWorker from 'monaco-editor/esm/vs/editor/editor.worker?worker';

loader.config({ monaco });

const saveScript = async (scriptId, content) => {
	const { data } = await axios.put(`http://localhost:3000/script/${scriptId}`, {
		content,
	});

	return data;
};

self.MonacoEnvironment = {
	getWorker(_, label) {
		return new editorWorker();
	},
};
export const CodeEditor = React.memo(({ scriptInfo }) => {
	const { id, content, name, owners } = scriptInfo;

	const editorRef = useRef(null);

	const [value, setValue] = useState(content);

	const [terminalResponse, setTerminalResponse] = useState([]);
	const [terminalError, setTerminalError] = useState(false);
	const [theme, setTheme] = useState('vs-dark');
	useEffect(() => {
		setValue(content);
		setTerminalResponse('');
	}, [scriptInfo?.content]);

	const handleEditorDidMount = (editor, monaco) => {
		editorRef.current = editor;
	};

	const saveCode = async () => {
		try {
			await saveScript(id, editorRef.current.getValue());
			toast.success('Tu código se guardó correctamente!', {
				duration: 2000,
				position: 'bottom-center',
			});
		} catch (error) {
			toast.error('Tu código se no guardó!', {
				duration: 2000,
				position: 'bottom-center',
			});
		}
	};

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
			console.log('terminal', data);
			setTerminalResponse(data || 'Respuesta vacía');
			console.log('terminalR', terminalResponse);
			setTerminalError(false);
			saveCode();
		} catch (error) {
			setTerminalError(true);
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

	const handleThemeChange = (e) => {
		const selectedTheme = e.target.value;
		setTheme(selectedTheme);
	};

	const handleEditorOnChange = (newValue, e) => {
		setValue(newValue);
	};

	return (
		<>
			<div className="editor__buttons">
				<button className="editor__runcode" onClick={runCode}>
					Run Code
				</button>
				<button className="editor__savecode" onClick={saveCode}>
					Save Code
				</button>
				<CopyButton textToCopy={window.location.href} content={'Share'} />
				{/* <select value={theme} onChange={handleThemeChange}>
					<option value="vs-dark">Dark</option>
					<option value="vs-light">Light</option>
					<option value="hc-black">High Contrast</option>
				</select> */}
			</div>
			<div className="editor__terminal">
				<Editor
					width="100%"
					height="100%"
					options={{
						minimap: { enabled: false },
					}}
					className="editor"
					theme="vs-dark"
					defaultLanguage="python"
					value={value || ''}
					onMount={handleEditorDidMount}
					onChange={handleEditorOnChange}
				/>
				<Terminal response={[...terminalResponse]} error={terminalError} />
			</div>
			<Toaster />
		</>
	);
});
