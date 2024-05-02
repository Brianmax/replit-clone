import React from 'react';
import { Route, Routes } from 'react-router-dom';
import { PrivateRouter } from './PrivateRouter';
import { PublicRouter } from './PublicRouter';
import { LoginPage } from '../auth';
import { EditorRouter } from '../editor/router/EditorRouter';
import { Navbar } from '../ui/components/NavBar';
import { ScriptsList } from '../scripts';
import { PlayGround } from '../editor/pages/PlayGround';

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
							<Navbar />
							<div className="main">
								<ScriptsList />
								<PlayGround />
							</div>
							{/* <EditorRouter /> */}
						</PrivateRouter>
					}
				/>
			</Routes>
		</>
	);
};
