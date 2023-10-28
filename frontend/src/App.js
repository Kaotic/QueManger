import React, { useEffect } from 'react';
import AppRouter from './AppRouter';
import { SnackbarProvider } from 'notistack';
import { BrowserRouter } from 'react-router-dom';
import api from './utils/api';
import { useDispatch, useSelector } from 'react-redux';
import jwtDecode from 'jwt-decode';
import LoadingScreen from './screens/LoadingScreen';
import { USER_LOADING_DONE } from './redux/actions/userActions';
import { SHOP_LIST_LOAD } from './redux/actions/shopListActions';
import moment from 'moment';

function App() {
	const user = useSelector((state) => state.user);
	const shopList = useSelector((state) => state.shopList);
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

	useEffect(() => {
		const storedShopList = localStorage.getItem('shopList');

		if (storedShopList) {
			let shopListParsed = JSON.parse(storedShopList);

			// Remove old shop list with updatedAt < 3 weeks
			shopListParsed = shopListParsed.filter((list) => {
				return moment(list.updatedAt).isAfter(moment().subtract(3, 'weeks'));
			});

			dispatch({ type: SHOP_LIST_LOAD, payload: shopListParsed });
		} else {
			dispatch({ type: SHOP_LIST_LOAD, payload: [] });
		}
	}, [dispatch]);

	useEffect(() => {
		localStorage.setItem('shopList', JSON.stringify(shopList.lists));
	}, [shopList]);

	return (
		<SnackbarProvider anchorOrigin={{ vertical: 'top', horizontal: 'right' }} maxSnack={3}>
			<BrowserRouter>
				{user.isLoading ? <LoadingScreen /> : <AppRouter />}
			</BrowserRouter>
		</SnackbarProvider>
	);
}

export default App;
