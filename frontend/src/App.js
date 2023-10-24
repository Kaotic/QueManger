import React, { useEffect } from 'react';
import AppRouter from './AppRouter';
import { SnackbarProvider } from 'notistack';
import { BrowserRouter } from 'react-router-dom';
import api from './utils/api';
import { useDispatch, useSelector } from 'react-redux';
import jwtDecode from 'jwt-decode';
import LoadingScreen from './screens/LoadingScreen';
import { USER_LOADING_DONE } from './redux/actions/userActions';

function App() {
	const user = useSelector((state) => state.user);
	const dispatch = useDispatch();

	useEffect(() => {
		const storedTokens = localStorage.getItem('authTokens');

		if (storedTokens) {
			const tokens = JSON.parse(storedTokens);
			try {
				const decodedToken = jwtDecode(tokens.access);

				const currentTime = Date.now() / 1000;
				if (decodedToken.exp > currentTime) { // Vérifier si le token n'est pas expiré
					dispatch({
						type: 'USER_LOGIN',
						auth: tokens,
						username: decodedToken.username,
						payload: decodedToken
					});
				} else {
					api.post('/api/token/refresh', { refresh: tokens.refresh })
						.then((response) => {
							if (response.status === 200 && response.data.access) {
								let data = response.data;
								localStorage.setItem('authTokens', JSON.stringify(data));
								dispatch({
									type: 'USER_LOGIN',
									auth: { access: data.access, refresh: data.refresh },
									username: decodedToken.username,
									payload: jwtDecode(data.access)
								});
							} else {
								dispatch({ type: 'USER_LOGOUT' });
							}
						})
						.catch((error) => {
							console.log(error);
							dispatch({ type: 'USER_LOGOUT' });
						});
				}
			} catch (error) {
				console.log(error);
				localStorage.removeItem('authTokens');
				dispatch({ type: 'USER_LOGOUT' });
			}
		}else{
			dispatch({ type: USER_LOADING_DONE });
		}
	}, [dispatch]);

	return (
		<SnackbarProvider anchorOrigin={{ vertical: 'top', horizontal: 'right' }} maxSnack={3}>
			<BrowserRouter>
				{user.isLoading ? <LoadingScreen /> : <AppRouter />}
			</BrowserRouter>
		</SnackbarProvider>
	);
}

export default App;
