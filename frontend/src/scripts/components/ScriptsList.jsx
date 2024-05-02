import React, { useContext, useEffect } from 'react';
import { useForm } from '../../hooks/useForm';
import { AuthContext } from '../../auth/context/AuthContext';
import { Script } from './Script';
import { useScript } from '../../hooks/useScript';
import queryString from 'query-string';
import {
	useLocation,
	useNavigate,
	useParams,
	useSearchParams,
} from 'react-router-dom';

export const ScriptsList = () => {
	const { user } = useContext(AuthContext);

	const navigate = useNavigate();
	// console.log("GA",params.get('id'));

	const { scripts, scriptsCount, handleNewScript, handleGetScripts } =
		useScript();

	const { name, onInputChange, onResetForm } = useForm({
		name: '',
	});

	useEffect(() => {
		handleGetScripts(user.uid).then();
	}, []);

	const onSubmitForm = (e) => {
		async (e) => {
			e.preventDefault();
			const id = await handleNewScript(user.uid, name);
			navigate({ pathname: '/script', search: `id=${id}` });
			onResetForm();
		};
	};

	return (
		<div className="scriptList">
			<form className="scriptForm" onSubmit={onSubmitForm}>
				<input
					type="text"
					value={name}
					name="name"
					onChange={onInputChange}
					className="script__input"
					placeholder='Nuevo Script'
				/>
				<button type="submit" className="script__button">
					+
				</button>
			</form>

			<h2 className="scriptList__title">📁 Files</h2>

			<div className="scripts">
				{scripts.map((script, index) => (
					<Script key={index} {...script} />
				))}
			</div>
		</div>
	);
};
