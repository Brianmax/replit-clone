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
	const [scriptLoaded, setScriptLoaded] = useState(false);

	useEffect(() => {
		getScriptById(scriptId).then((data) => {
			setScriptInfo(data);
			setScriptLoaded(true);
		});
	}, [scriptId]);

	return (
		<div className="playground">
			{scriptLoaded && <CodeEditor scriptInfo={scriptInfo} />}
		</div>
	);
};
