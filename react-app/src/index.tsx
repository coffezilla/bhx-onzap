import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { Toaster } from 'react-hot-toast';

import store from './redux/ConfigStore';
import Routers from './Routers';

import 'bootstrap-icons/font/bootstrap-icons.scss';
import './index.css';

ReactDOM.render(
	<Provider store={store}>
		<Routers />
		<Toaster />
	</Provider>,
	document.getElementById('root'),
);
