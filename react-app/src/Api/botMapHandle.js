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
							botmap: response.data.botmap,
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

// POST add
export const addBotMessage = async (message, order, keyOption, answerTo) => {
	const localStorageAuth = getHasLocalStorageAuth();
	const hasLocalStorageAuth = localStorageAuth.status;
	let serverResponse = { data: { status: 0 } };

	if (hasLocalStorageAuth) {
		const formData = new FormData();
		formData.append('auth_timestamp', localStorageAuth.data.timestamp);
		formData.append('auth_email', localStorageAuth.data.email);
		formData.append('message', message);
		formData.append('order', order);
		formData.append('keyOption', keyOption);
		formData.append('answerTo', answerTo);
		formData.append('role', localStorageAuth.data.role);

		const END_POINT = END_POINT_BASE + '/bot/add-message';
		await axios({
			method: 'post',
			url: END_POINT,
			data: formData,
			headers: { Authorization: `Bearer ${localStorageAuth.data.token}` },
		})
			.then((response) => {
				console.log('mx', response);
				// 1 - done
				if (response.data.status === 1) {
					serverResponse = {
						data: {
							status: response.data.status,
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
