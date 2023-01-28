/* eslint-disable */

import axios from 'axios';
import { getHasLocalStorageAuth } from '../helpers/handleStorage';

import { END_POINT_BASE } from './Api';

// GET
export const getPayments = async (clientId) => {
	const localStorageAuth = getHasLocalStorageAuth();
	const hasLocalStorageAuth = localStorageAuth.status;
	let serverResponse = { data: { status: 0 } };

	if (hasLocalStorageAuth) {
		const GET_PARAMS = `?auth_email=${localStorageAuth.data.email}&auth_timestamp=${localStorageAuth.data.timestamp}&client_id=${clientId}&role=${localStorageAuth.data.role}`;

		const END_POINT = END_POINT_BASE + '/payments/payments' + GET_PARAMS;
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
							payments: response.data.payments,
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
export const getPaymentData = async (paymentId) => {
	const localStorageAuth = getHasLocalStorageAuth();
	const hasLocalStorageAuth = localStorageAuth.status;
	let serverResponse = { data: { status: 0 } };

	if (hasLocalStorageAuth) {
		const GET_PARAMS = `?auth_email=${localStorageAuth.data.email}&auth_timestamp=${localStorageAuth.data.timestamp}&payment_id=${paymentId}&role=${localStorageAuth.data.role}`;

		const END_POINT = END_POINT_BASE + '/payments/data-payment' + GET_PARAMS;
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
							payment: response.data.payment,
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
export const addPayment = async (
	clientId,
	name,
	dueDate,
	status,
	priceBefore,
	priceAfter,
	paymentConfirmDate,
	paymentConfirmNote,
	paymentConfirmPrice,
) => {
	const localStorageAuth = getHasLocalStorageAuth();
	const hasLocalStorageAuth = localStorageAuth.status;
	let serverResponse = { data: { status: 0 } };

	if (hasLocalStorageAuth) {
		const formData = new FormData();
		formData.append('auth_timestamp', localStorageAuth.data.timestamp);
		formData.append('auth_email', localStorageAuth.data.email);
		formData.append('client_id', clientId);
		formData.append('name', name);
		formData.append('due_date', dueDate);
		formData.append('status', status);
		formData.append('price_before', priceBefore);
		formData.append('price_after', priceAfter);
		formData.append('payment_confirm_date', paymentConfirmDate);
		formData.append('payment_confirm_note', paymentConfirmNote);
		formData.append('payment_confirm_price', paymentConfirmPrice);
		formData.append('role', localStorageAuth.data.role);

		const END_POINT = END_POINT_BASE + '/payments/add-payment';
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

// POST edit
export const editPayment = async (
	paymentId,
	name,
	dueDate,
	status,
	priceBefore,
	priceAfter,
	paymentConfirmDate,
	paymentConfirmNote,
	paymentConfirmPrice,
) => {
	const localStorageAuth = getHasLocalStorageAuth();
	const hasLocalStorageAuth = localStorageAuth.status;
	let serverResponse = { data: { status: 0 } };

	if (hasLocalStorageAuth) {
		const formData = new FormData();
		formData.append('auth_timestamp', localStorageAuth.data.timestamp);
		formData.append('auth_email', localStorageAuth.data.email);
		formData.append('payment_id', paymentId);
		formData.append('name', name);
		formData.append('due_date', dueDate);
		formData.append('status', status);
		formData.append('price_before', priceBefore);
		formData.append('price_after', priceAfter);
		formData.append('payment_confirm_date', paymentConfirmDate);
		formData.append('payment_confirm_note', paymentConfirmNote);
		formData.append('payment_confirm_price', paymentConfirmPrice);
		formData.append('role', localStorageAuth.data.role);

		const END_POINT = END_POINT_BASE + '/payments/edit-payment';
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

// POST delete
export const removePayment = async (paymentId) => {
	const localStorageAuth = getHasLocalStorageAuth();
	const hasLocalStorageAuth = localStorageAuth.status;
	let serverResponse = { data: { status: 0 } };

	if (hasLocalStorageAuth) {
		const formData = new FormData();
		formData.append('auth_timestamp', localStorageAuth.data.timestamp);
		formData.append('auth_email', localStorageAuth.data.email);
		formData.append('payment_id', paymentId);
		formData.append('role', localStorageAuth.data.role);

		const END_POINT = END_POINT_BASE + '/payments/remove-payment';
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
