import { useContext } from 'react';
import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../auth/context/AuthContext';

export const Navbar = () => {
	const navigate = useNavigate();
	const { user, logout } = useContext(AuthContext);

	const onLogout = () => {
		logout();
		navigate('../login', {
			replace: true,
		});
	};

	return (
		<>
			<nav className="nav">
				<Link className="nav__logo" to="/">
					| CODECRAFT 
				</Link>
				{/* 
			<div className="navbar-collapse">
			<div className="navbar-nav">
		>
		Single
		</NavLink>
		
		<NavLink
		className={({ isActive }) =>
		`nav-item nav-link ${isActive ? 'active' : ''}`
	}
	to="/collab"
	>
	Collab
	</NavLink>
	</div>
</div> */}

				<div className="nav__user">
					<ul className="nav__user__list">
						<span className="nav__user__name">{user?.username}</span>
						<button className="nav__user__logout" onClick={onLogout}>
							Logout
						</button>
					</ul>
				</div>
			</nav>
			<Outlet/>
		</>
	);
};
