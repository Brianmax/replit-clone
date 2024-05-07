import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { useForm } from '../../hooks/useForm';

export const LoginPage = () => {
	const navigate = useNavigate();
	const { username, onInputChange, onResetForm } = useForm({
		username: '',
	});

	const { login } = useContext(AuthContext);

	const onLogin = async () => {
		// const lastPath = localStorage.getItem('lastPath') || '../';
		if (username.trim() === '') {
			return;
		}
		await login(username);

		// navigate(lastPath, { replace: true });
	};

	return (
		<div className="login">
			<h1 className="login__title">
				{'<'}Login{'/>'}
			</h1>
			<div className="login__form">
				<input
					className="login__input"
					type="text"
					placeholder="vs3rn4m3"
					name="username"
					value={username}
					onChange={onInputChange}
					required
				/>
				<button className="login__button" onClick={onLogin}>
					{'>'}
				</button>
			</div>
		</div>
	);
};
