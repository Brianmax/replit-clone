import './App.css';
import { AuthProvider } from './auth';
import { AppRouter } from './router/AppRouter';

export const EditorApp = () => {
	return (
		<AuthProvider>
			<AppRouter />
		</AuthProvider>
	);
};
