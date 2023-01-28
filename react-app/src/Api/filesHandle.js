/* eslint-disable */

import axios from 'axios';
import { getHasLocalStorageAuth } from '../helpers/handleStorage';

import { END_POINT_BASE } from './Api';

// GET
export const getFiles = async (paymentId) => {
	const localStorageAuth = getHasLocalStorageAuth();
	const hasLocalStorageAuth = localStorageAuth.status;
	let serverResponse = { data: { status: 0 } };

	if (hasLocalStorageAuth) {
		const GET_PARAMS = `?auth_email=${localStorageAuth.data.email}&auth_timestamp=${localStorageAuth.data.timestamp}&payment_id=${paymentId}&role=${localStorageAuth.data.role}`;

		const END_POINT = END_POINT_BASE + '/files/files' + GET_PARAMS;
		await axios({
			method: 'get',
			url: END_POINT,
			headers: {
				Authorization: `Bearer ${localStorageAuth.data.token}`,
			},
		})
			.then((response) => {
				// 1 - done
				if (response.data.status === 1) {
					serverResponse = {
						data: {
							status: response.data.status,
							files: response.data.files,
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
export const getFilesData = async (fileId) => {
	const localStorageAuth = getHasLocalStorageAuth();
	const hasLocalStorageAuth = localStorageAuth.status;
	let serverResponse = { data: { status: 0 } };

	if (hasLocalStorageAuth) {
		const GET_PARAMS = `?auth_email=${localStorageAuth.data.email}&auth_timestamp=${localStorageAuth.data.timestamp}&file_id=${fileId}&role=${localStorageAuth.data.role}`;

		const END_POINT = END_POINT_BASE + '/files/data-file' + GET_PARAMS;
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
							file: response.data.file,
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
export const addFile = async (paymentId, title, file, dueDate, price) => {
	const localStorageAuth = getHasLocalStorageAuth();
	const hasLocalStorageAuth = localStorageAuth.status;
	let serverResponse = { data: { status: 0 } };

	if (hasLocalStorageAuth) {
		const formData = new FormData();
		formData.append('auth_timestamp', localStorageAuth.data.timestamp);
		formData.append('auth_email', localStorageAuth.data.email);
		formData.append('payment_id', paymentId);
		formData.append('title', title);
		formData.append('file', file[0]);
		formData.append('due_date', dueDate);
		formData.append('price', price);
		formData.append('role', localStorageAuth.data.role);

		const END_POINT = END_POINT_BASE + '/files/add-file';
		await axios({
			method: 'post',
			url: END_POINT,
			data: formData,
			headers: {
				Authorization: `Bearer ${localStorageAuth.data.token}`,
				'Content-Type': 'multipart/form-data',
			},
		})
			.then((response) => {
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

// POST delete
export const removeFile = async (fileId) => {
	const localStorageAuth = getHasLocalStorageAuth();
	const hasLocalStorageAuth = localStorageAuth.status;
	let serverResponse = { data: { status: 0 } };

	if (hasLocalStorageAuth) {
		const formData = new FormData();
		formData.append('auth_timestamp', localStorageAuth.data.timestamp);
		formData.append('auth_email', localStorageAuth.data.email);
		formData.append('file_id', fileId);
		formData.append('role', localStorageAuth.data.role);

		const END_POINT = END_POINT_BASE + '/files/remove-file';
		await axios({
			method: 'post',
			url: END_POINT,
			data: formData,
			headers: { Authorization: `Bearer ${localStorageAuth.data.token}` },
		})
			.then((response) => {
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
