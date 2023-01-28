/* eslint-disable */

import axios from 'axios';
import { getHasLocalStorageAuth } from '../helpers/handleStorage';

import { END_POINT_BASE } from './Api';

// GET
export const getClients = async () => {
	const localStorageAuth = getHasLocalStorageAuth();
	const hasLocalStorageAuth = localStorageAuth.status;
	let serverResponse = { data: { status: 0 } };

	if (hasLocalStorageAuth) {
		const GET_PARAMS = `?auth_email=${localStorageAuth.data.email}&auth_timestamp=${localStorageAuth.data.timestamp}&role=${localStorageAuth.data.role}`;

		const END_POINT = END_POINT_BASE + '/clients/clients' + GET_PARAMS;
		await axios({
			method: 'get',
			url: END_POINT,
			headers: { Authorization: `Bearer ${localStorageAuth.data.token}` },
		})
			.then((response) => {
				// 1 - done
				if (response.data.status === 1) {
					serverResponse = {
						data: {
							status: response.data.status,
							clients: response.data.clients,
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

// GET DATA
export const getClientData = async (clientId) => {
	const localStorageAuth = getHasLocalStorageAuth();
	const hasLocalStorageAuth = localStorageAuth.status;
	let serverResponse = { data: { status: 0 } };

	if (hasLocalStorageAuth) {
		const GET_PARAMS = `?auth_email=${localStorageAuth.data.email}&auth_timestamp=${localStorageAuth.data.timestamp}&client_id=${clientId}&role=${localStorageAuth.data.role}`;

		const END_POINT = END_POINT_BASE + '/clients/data-client' + GET_PARAMS;
		await axios({
			method: 'get',
			url: END_POINT,
			headers: { Authorization: `Bearer ${localStorageAuth.data.token}` },
		})
			.then((response) => {
				// 1 - done
				if (response.data.status === 1) {
					serverResponse = {
						data: {
							status: response.data.status,
							client: response.data.client,
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
