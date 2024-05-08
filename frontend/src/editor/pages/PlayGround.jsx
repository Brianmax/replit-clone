import React, { useContext, useEffect, useState } from 'react';
import { CodeEditor } from '../components/CodeEditor';
import { AuthContext } from '../../auth/context/AuthContext';
import { useParams, useSearchParams } from 'react-router-dom';
import axios from 'axios';

const getScriptById = async (scriptId) => {
	const { data } = await axios.get(`http://34.94.126.203:3000/script/${scriptId}`);
	return data;
};

export const PlayGround = () => {
	const { user } = useContext(AuthContext);
	const [searchParams] = useSearchParams();

	const scriptId = searchParams.get('id');

	const [scriptInfo, setScriptInfo] = useState({});
	const [scriptLoaded, setScriptLoaded] = useState(false);
	
	
	useEffect(() => {
		if (scriptId) {
			getScriptById(scriptId).then((data) => {
				setScriptInfo(data);
				setScriptLoaded(true);
			});
		}
	}, [scriptId]);
	
	console.log("SCRIPT INFO", scriptInfo, scriptLoaded);

	return (
		<div className="playground">
			{<CodeEditor scriptInfo={scriptInfo} />}
		</div>
	);
};
