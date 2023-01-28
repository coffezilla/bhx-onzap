/* eslint-disable */

import axios from 'axios';
import { getHasLocalStorageAuth } from '../helpers/handleStorage';

import { END_POINT_BASE } from './Api';

// GET
export const getClientBotMap = async () => {
	const localStorageAuth = getHasLocalStorageAuth();
	const hasLocalStorageAuth = localStorageAuth.status;
	let serverResponse = { data: { status: 0 } };

	if (hasLocalStorageAuth) {
		const GET_PARAMS = `?auth_email=${localStorageAuth.data.email}&auth_timestamp=${localStorageAuth.data.timestamp}&role=${localStorageAuth.data.role}`;

		const END_POINT = END_POINT_BASE + '/bot/bot-map' + GET_PARAMS;
		await axios({
			method: 'get',
			url: END_POINT,
			headers: { Authorization: `Bearer ${localStorageAuth.data.token}` },
		})
			.then((response) => {
				console.log('cc', response);
				// 1 - done
				if (response.data.status === 1) {
					serverResponse = {
						data: {
							status: response.data.status,
							botMap: response.data.bot_map,
							message: response.data.message,
						},
					};
				} else {
					serverResponse = {
						data: {
							status: response.data.status,
							message: response.data.message,
						},
					};
				}
			})
			.catch((error) => {});
	}

	return serverResponse;
};

// // GET DATA
// export const getPaymentClientData = async (paymentId) => {
// 	const localStorageAuth = getHasLocalStorageAuth();
// 	const hasLocalStorageAuth = localStorageAuth.status;
// 	let serverResponse = { data: { status: 0 } };

// 	if (hasLocalStorageAuth) {
// 		const GET_PARAMS = `?auth_email=${localStorageAuth.data.email}&auth_timestamp=${localStorageAuth.data.timestamp}&payment_id=${paymentId}&role=${localStorageAuth.data.role}`;

// 		const END_POINT = END_POINT_BASE + '/payments/data-client-payment' + GET_PARAMS;
// 		await axios({
// 			method: 'get',
// 			url: END_POINT,
// 			headers: { Authorization: `Bearer ${localStorageAuth.data.token}` },
// 		})
// 			.then((response) => {
// 				// 1 - done
// 				if (response.data.status === 1) {
// 					serverResponse = {
// 						data: {
// 							status: response.data.status,
// 							payment: response.data.payment,
// 							message: response.data.message,
// 						},
// 					};
// 				} else {
// 					serverResponse = {
// 						data: {
// 							status: response.data.status,
// 							message: response.data.message,
// 						},
// 					};
// 				}
// 			})
// 			.catch((error) => {});
// 	}

// 	return serverResponse;
// };
