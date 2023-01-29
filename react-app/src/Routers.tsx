/* eslint-disable */
import { useState } from 'react';
import { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom';

// auth
import { getAuth } from './components/Auth';

// redux
import { useSelector, useDispatch } from 'react-redux';
import { rdxLoginUser, rdxLogoutUser, IRdxUser } from './redux/ducks/User';

//
import { clearLocalStorageAuth } from './helpers/handleStorage';

// router with requirement to access
import ProtectedRoute from './ProtectedRoute';
import UnprotectedRoute from './UnprotectedRoute';

// page public
import PageIndex from './pages/PageIndex';
import PageNotFound from './pages/PageNotFound';

import PageClient from './pages/PageClient';
import PagePayment from './pages/PagePayment';
import PageReceipt from './pages/PageReceipt';

// page only logged
import PageHub from './pages/PageHub';

// client
import PageClientHub from './pages/PageClientHub';

// page only if NOT logged
import PageLogin from './pages/PageLogin';

function Routers() {
	const dispatch = useDispatch();
	const rdxUserisAuth = useSelector((state: IRdxUser) => state.isAuth);
	const [loading, setLoading] = useState<any>(true);

	if (loading) {
		if (!rdxUserisAuth) {
			getAuth().then((responseAuth) => {
				if (responseAuth.data.status === 1) {
					dispatch(rdxLoginUser(responseAuth.data.role, responseAuth.data.email, false));
				} else {
					clearLocalStorageAuth();
					dispatch(rdxLogoutUser());
				}
				setLoading(false);
			});
		}
		return <p>Loading...</p>;
	}
	return (
		<>
			<BrowserRouter>
				<Switch>
					<UnprotectedRoute exact path="/" component={PageIndex} />
					<ProtectedRoute path="/receipt/:rid" component={PageReceipt} />
					<UnprotectedRoute path="/admin" component={PageLogin} />
					<Route path="/404" component={PageNotFound} />

					<ProtectedRoute path="/hub" component={PageHub} />
					<ProtectedRoute path="/client/:cid" component={PageClient} />
					<ProtectedRoute path="/payment/:pid" component={PagePayment} />

					<ProtectedRoute path="/dashboard" component={PageClientHub} />

					<Redirect to="/404" />
				</Switch>
			</BrowserRouter>
		</>
	);
}

export default Routers;
