import React, { useContext, useEffect } from 'react';
import { useForm } from '../../hooks/useForm';
import { AuthContext } from '../../auth/context/AuthContext';
import { Script } from './Script';
import { useScript } from '../../hooks/useScript';


export const ScriptsList = () => {
	const { user } = useContext(AuthContext);

	const {
		scripts,
		scriptsCount,
		handleNewScript,
		handleGetScripts
	} = useScript();

	
	const { name, onInputChange, onResetForm } = useForm({
		name: '',
	});
	
	useEffect(() => {
		handleGetScripts(user.uid).then();	
	},[])

	return (
		<>
			<input type="text" value={name} name="name" onChange={onInputChange} />
			<button onClick={() => handleNewScript(user.uid, name)}>
				Nuevo Script
			</button>

			{scripts.map((script, index) => (
				<Script key={index} {...script} />
			))}
		</>
	);
};
