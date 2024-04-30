import React, { useContext, useEffect, useState } from 'react';
import { CodeEditor } from '../components/CodeEditor';
import { AuthContext } from '../../auth/context/AuthContext';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const getScriptById = async (scriptId) => {
	const { data } = await axios.get(`http://localhost:3000/script/${scriptId}`);
	console.log('[GET Playground]', data);
	return data;
};

export const PlayGround = () => {
	const { user } = useContext(AuthContext);

	const { scriptId } = useParams();

	const [scriptInfo, setScriptInfo] = useState({});

	useEffect(() => {
		getScriptById(scriptId).then((data) => setScriptInfo(data));
	}, []);

	return (
		<div className="playground">
			<CodeEditor scriptInfo={scriptInfo} />
		</div>
	);
};
