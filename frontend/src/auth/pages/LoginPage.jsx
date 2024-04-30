import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { useForm } from '../../hooks/useForm';

export const LoginPage = () => {
	const navigate = useNavigate();
	const { username, onInputChange, onResetForm } = useForm({
		username: "",
	});

	const { login } = useContext(AuthContext);

	const onLogin = async () => {
		const lastPath = localStorage.getItem('lastPath') || '../';
		if(username.trim() === ""){
			return;
		}
		await login(username);

		navigate(lastPath, { replace: true });
	};

	return (
		<div className="container mt-5">
			<h1>LoginPage</h1>
			<hr />
			<input
				type="text"
				placeholder="Ingrese su nombre de usuario"
				name="username"
				value={username}
				onChange={onInputChange}
				/>
			<button className="btn btn-primary" onClick={onLogin}>
				Login
			</button>
		</div>
	);
};
