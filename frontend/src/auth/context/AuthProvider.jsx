import { useReducer } from 'react';
import { AuthContext } from './AuthContext';
import { authReducer } from './authReducer';
import { types } from '../types/types';
import axios from 'axios';

const init = () => {
	const user = JSON.parse(localStorage.getItem('user'));
	localStorage.setItem('scripts', JSON.stringify(user?.scripts));
	return {
		logged: !!user,
		user
	};
};

const getUserByName = async (username) => {
	const { data } = await axios.get('http://localhost:3000/user/login', {
		params: { username },
	});
	return data;
};

const registerUser = async (username) => {
	const { data } = await axios.post('http://localhost:3000/user/register', {
		username,
	});
	return data;
};

export const AuthProvider = ({ children }) => {
	const [authState, dispatch] = useReducer(authReducer, {}, init);

	const login = async (username = '') => {
		let user = await getUserByName(username);
		if (user == null) {
			user = await registerUser(username);
		}

		const action = {
			type: types.login,
			payload: user,
		};

		localStorage.setItem('user', JSON.stringify(user));

		dispatch(action);
	};

	const logout = () => {
		localStorage.removeItem('user');
		localStorage.removeItem('scripts');
		const action = {
			type: types.logout,
		};
		dispatch(action);
	};
	

	return (
		<AuthContext.Provider
			value={{
				...authState,
				login,
				logout,
			}}
		>
			{children}
		</AuthContext.Provider>
	);
};
