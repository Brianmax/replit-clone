import React from 'react';
import { Route, Routes } from 'react-router-dom';
import { PrivateRouter } from './PrivateRouter';
import { PublicRouter } from './PublicRouter';
import { LoginPage } from '../auth';
import { EditorRouter } from '../editor/router/EditorRouter';


export const AppRouter = () => {
	return (
		<>
			<Routes>
				<Route
					path="login"
					element={
						<PublicRouter>
							<LoginPage />
						</PublicRouter>
					}
				/>
        <Route
					path="/*"
					element={
						<PrivateRouter>
							<EditorRouter />
						</PrivateRouter>
					}
				/>
			</Routes>
		</>
	);
};
