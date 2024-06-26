import React, { useEffect, useReducer } from 'react';
import { scriptReducer } from '../scripts/context/scriptReducer';
import { types } from '../scripts/types/types';
import axios from 'axios';

const init = () => {
	return [];
};

export const useScript = () => {
	const [scripts, dispatch] = useReducer(scriptReducer, [], init);

	useEffect(() => {
		localStorage.setItem('scripts', JSON.stringify(scripts));
	}, [scripts]);

	const handleNewScript = async (uid, name) => {
		const { data } = await axios.post('http://34.94.126.203:3000/script', {
			uid, name,
		});
		
		const action = {
			type: types.create,
			payload: [data, ...scripts],
		};

		localStorage.setItem('scripts', JSON.stringify(scripts));

		dispatch(action);
		return data.id;
	};

	const handleGetScripts = async (uid) => {
		const { data } = await axios.get('http://34.94.130.143:3000/user/scripts', {
			params: {uid},
		});

		const action = {
			type: types.get,
			payload: data,
		};

		dispatch(action);
	};

	const getScriptById = async (id) => {
		const {data} = await axios.get('http://34.94.130.143:3000/user/scripts', {
			params:{id}
		});

		return data;
	}

	return {
		scripts,
		scriptsCount: scripts.length,
        handleNewScript,
        handleGetScripts,
	};
};
