/* eslint-disable */
/* eslint-disable react/jsx-one-expression-per-line */
import { Link, useHistory } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';

import toast from 'react-hot-toast';
import { Helmet } from 'react-helmet';

import { IRdxUser } from '../redux/ducks/User';

import { validateForm, IForm } from '../components/FormValidation';
import ModalCustom from '../components/ModalCustom';
import PixelABTest from '../components/PixelABTest';
import Card from '../components/Card';
import Xarrow from 'react-xarrows';

import { getHasLocalStorageAuth } from '../helpers/handleStorage';
import Placeholder from '../components/Placeholder';
import HeaderTop from '../components/HeaderTop/HeaderTop';
import HeaderTopSecondary from '../components/HeaderTopSecondary/HeaderTopSecondary';

import { END_POINT_BASE } from '../Api/Api';

type modalIndex = 'MODAL_ADD_PAYMENT' | 'MODAL_SECONDARY';

interface IResPayments {
	data: {
		botmap?: any;
		message?: string;
		status: number;
	};
}

// import { getPayments } from '../Api/paymentsClientHandle';
import { addBotMessage, getClientBotMap } from '../Api/botMapHandle';
// import { getClientData } from '../Api/clientsClientHandle';
import Footer from '../components/Footer/Footer';

const PageClientHub = () => {
	const rdxEmail = useSelector((store: IRdxUser) => store.email);
	const rdxIsWALogged = useSelector((store: IRdxUser) => store.isWALogged);
	const rdxAll = useSelector((store: IRdxUser) => store);
	console.log(rdxEmail);
	const [isLoading, setIsLoading] = useState<boolean>(true);
	const [dataBotMap, setDataBotMap] = useState<any[] | null>(null);

	// qr code status
	const [isQrCodeSyncing, setIsQrCodeSyncing] = useState(false); // syncinc image
	const [isImageQrCodeLoading, setIsImageQrCodeLoading] = useState(false); // getting data
	const [isQrCodeConnected, setIsQrCodeConnected] = useState<boolean | null>(null); // data connected

	// const [dataClient, setDataClient] = useState<any>(null);
	const [fileToken, setFileToken] = useState<any>();
	const [modalState, setModalState] = useState({
		MODAL_ADD_PAYMENT: { status: false },
		MODAL_SECONDARY: { status: false },
	});
	const [formLoading, setFormLoading] = useState<boolean>(false);
	const [formFields, setFormFields] = useState<IForm['inputs']>([
		{
			name: 'message_id',
			value: 0,
			error: '',
			type: 'text',
			isRequired: true,
		},
		{
			name: 'message',
			value: '',
			error: '',
			type: 'text',
			isRequired: true,
			maxLength: 100,
		},
		{
			name: 'order',
			value: 1,
			error: '',
			type: 'text',
			isRequired: true,
			maxLength: 10,
		},
		{
			name: 'keyOption',
			value: 1,
			error: '',
			isRequired: true,
			type: 'text',
		},
		// {
		// 	name: 'price_before',
		// 	value: '',
		// 	error: '',
		// 	type: 'text',
		// 	maxLength: 50,
		// },
		// {
		// 	name: 'price_after',
		// 	value: '',
		// 	error: '',
		// 	type: 'text',
		// 	maxLength: 50,
		// },
		// {
		// 	name: 'payment_confirm_date',
		// 	value: '',
		// 	error: '',
		// 	type: 'text',
		// 	maxLength: 10,
		// },
		// {
		// 	name: 'payment_confirm_note',
		// 	value: '',
		// 	error: '',
		// 	type: 'text',
		// },
		// {
		// 	name: 'payment_confirm_price',
		// 	value: '',
		// 	error: '',
		// 	type: 'text',
		// 	maxLength: 50,
		// },
	]);

	// ------------------------ MODAL
	const openModal = (
		modalName: modalIndex,
		modalData: { slug: String; group: String } | null = { slug: '', group: '' },
	) => {
		setModalState({ ...modalState, [modalName]: { status: true } });

		//
		if (modalName === 'MODAL_SECONDARY') {
		}
	};

	const closeModal = (modalName: modalIndex) => {
		const documentBody: HTMLBodyElement | null = document.querySelector('body');
		if (documentBody !== null) {
			documentBody.className = '';
		}
		setModalState({ ...modalState, [modalName]: { status: false } });
	};
	// ------------------------ // MODAL

	// ------------------------ FORM

	// FORM
	const validationForm = (form: any, setForm: any) => {
		const inputRequired = validateForm(form, setForm);
		const hasNoErrors = inputRequired.hasPassed;

		return hasNoErrors;
	};

	const handleChange = (
		e: any,
		form: any,
		setForm: any,
		mask: 'TEXT' | 'NUMBER' | 'MONEY' | 'CPF' | 'CEP' | 'DATE' = 'TEXT',
	) => {
		const isCheckBox = e.target.type === 'checkbox';
		let currentValue = e.target.value;

		// OPTIONAL: clean spaces
		if (e.target.name === 'password') {
			currentValue = currentValue.replace(/\s/g, '');
			currentValue = currentValue.toLowerCase();
		}

		if (mask === 'NUMBER') {
			currentValue = currentValue.replace(/\D/g, ''); //Remove tudo o que não é dígito
		}

		if (mask === 'MONEY') {
			currentValue = currentValue.replace(/[^\d\,]/g, ''); //Remove tudo o que não é dígito
		}

		if (mask === 'DATE') {
			currentValue = currentValue.replace(/\D/g, ''); //Remove tudo o que não é dígito
			currentValue = currentValue.replace(/(\d{2})(\d)/, '$1/$2'); //Coloca um ponto entre o terceiro e o quarto dígitos
			currentValue = currentValue.replace(/(\d{2})(\d)/, '$1/$2'); //Coloca um ponto entre o terceiro e o quarto dígitos
		}

		setForm(
			form.map((field: any) => {
				if (field.name === e.target.name) {
					return {
						...field,
						value: isCheckBox ? e.target.checked : currentValue,
						error: '',
					};
				}
				return { ...field };
			}),
		);
	};

	const handleSubmitAdd = (e: any) => {
		e.preventDefault();

		const isValid = validationForm(formFields, setFormFields);
		if (isValid) {
			console.log('enviado');
			const toastApi = toast.loading('Registrando cobrança...', {
				position: 'bottom-right',
			});
			setFormLoading(true);
			addBotMessage(
				formFields[1].value,
				formFields[2].value,
				formFields[3].value,
				formFields[0].value,
			).then((responseData: any) => {
				if (responseData.data.status === 1) {
					// loadingDataPayments();
					loadingDataBotMap();
					setFormFields([
						{ ...formFields[0], value: 0 },
						{ ...formFields[1], value: '' },
						{ ...formFields[2], value: 1 },
						{ ...formFields[3], value: 1 },
					]);
					toast.success('Cobrança registrada!', {
						duration: 5000,
						id: toastApi,
					});
				} else {
					toast.error('Erro!', {
						duration: 5000,
						id: toastApi,
					});
				}
				closeModal('MODAL_ADD_PAYMENT');
				setFormLoading(false);
			});
		}
	};
	// ------------------------ // FORM
	// const loadingDataClient = async () => {
	// 	await getClientData().then((responseData: any) => {
	// 		if (responseData.data.status === 1) {
	// 			setDataClient(responseData.data.client);
	// 		} else {
	// 		}
	// 	});
	// };

	//
	const waLogout = (number: any) => {
		console.log('checking whatsapp login');
		// setIsImageQrCodeLoading(true);
		// setIsQrCodeSyncing(true);
		vagabunda(number).then((response) => {
			console.log('get data wa', response);
		});
	};
	const vagabunda = async (number: any) => {
		let response = { data: '' };
		await axios(`/logout/${number}`).then((responseExp: any) => {
			console.log('contato', responseExp);
			// response = { ...response, data: responseExp };

			// if (Number(responseExp.data.status) === 3 || Number(responseExp.data.status) === 1) {
			// 	setIsQrCodeConnected(true);
			// } else {
			// 	setIsQrCodeConnected(false);
			// }

			// setIsImageQrCodeLoading(false);
			// setIsImageQrCodeLoading(false);
			// setIsQrCodeSyncing(false);
		});
		return response;
	};

	//
	const checkWALogin = (number: any) => {
		console.log('checking whatsapp login');
		// setIsImageQrCodeLoading(true);
		setIsQrCodeSyncing(true);
		getWAStatus(number).then((response) => {
			console.log('get data wa', response);
		});
	};
	const getWAStatus = async (number: any) => {
		let response = { data: '' };
		await axios(`/check-login/${number}`).then((responseExp: any) => {
			response = { ...response, data: responseExp };

			if (Number(responseExp.data.status) === 3 || Number(responseExp.data.status) === 1) {
				setIsQrCodeConnected(true);
			} else {
				setIsQrCodeConnected(false);
			}

			// setIsImageQrCodeLoading(false);
			// setIsImageQrCodeLoading(false);
			setIsQrCodeSyncing(false);
		});
		return response;
	};

	//
	const handleWALogin = (number: any) => {
		console.log('Added whatsapp');
		setIsImageQrCodeLoading(true);
		setIsQrCodeSyncing(true);
		getWAQrCode(number).then((response) => {
			console.log('get data wa', response);
		});
	};

	//
	const getWAQrCode = async (number: any) => {
		let response = { data: '' };
		await axios(`/login/${number}`).then((responseExp: any) => {
			response = { ...response, data: responseExp };

			if (Number(responseExp.data.status) === 3 || Number(responseExp.data.status) === 1) {
				setIsQrCodeConnected(true);
			} else {
				setIsQrCodeConnected(false);
			}

			setIsImageQrCodeLoading(false);
			setIsQrCodeSyncing(false);
		});
		return response;
	};

	// bot map
	const loadingDataBotMap = () => {
		setDataBotMap(null);
		getClientBotMap().then((responseBotMap: IResPayments) => {
			console.log('neve', responseBotMap.data);
			if (responseBotMap.data.status === 1) {
				setDataBotMap(responseBotMap.data.botmap);
			} else {
			}
			setIsLoading(false);
		});
	};

	// const loadingDataPayments = async () => {
	// 	setDataPayments(null);
	// 	await getPayments().then((responsePayments: IResPayments) => {
	// 		if (responsePayments.data.status === 1) {
	// 			setDataPayments(responsePayments.data.payments);
	// 		} else {
	// 		}
	// 		setIsLoading(false);
	// 	});
	// };

	// handle click current item
	const handleClick = (id: number) => {
		const currentMessageId = getOptionsItem(id);
		// console.log("lkjasldfjas", )

		setFormFields([
			{ ...formFields[0], value: currentMessageId.id },
			{ ...formFields[1], value: '' },
			{ ...formFields[2], value: 1 },
			{ ...formFields[3], value: 1 },
		]);

		openModal('MODAL_ADD_PAYMENT');

		console.log('clicked', currentMessageId);
	};

	// get single item
	const getCurrentItem = (id: number) => {
		let selected: any = [];
		dataBotMap?.forEach((landingPage: any, level: any) => {
			const findSelected = landingPage.filter((item: any) => item.answerTo === id);
			// selected.push
			if (findSelected.length > 0) {
				selected.push(findSelected);
				// selected = { ...findSelected };
			}
		});

		return selected[0];
	};

	// get array of options
	const getOptionsItem = (id: number) => {
		let selected: any = [];
		dataBotMap?.forEach((landingPage: any, level: any) => {
			const findSelected = landingPage.filter((item: any) => item.id === id);
			if (findSelected.length > 0) {
				selected = { ...findSelected[0], level: level };
			}
		});

		return selected;
	};

	useEffect(() => {
		const localStorageAuth = getHasLocalStorageAuth();
		setFileToken({
			token: localStorageAuth.data.token,
			email: localStorageAuth.data.email,
			timestamp: localStorageAuth.data.timestamp,
		});
		// loadingDataClient();
		// loadingDataPayments();
		loadingDataBotMap();
		console.log('man', rdxEmail);
		checkWALogin(rdxEmail);
	}, []);

	// if (dataClient === null) {
	// 	return <Placeholder />;
	// }

	return (
		<>
			<Helmet>
				<title>Dashboard - Área do cliente</title>
				<meta
					name="description"
					content="Baixe boletos e imprima comprovantes de serviço na área do cliente BHX Sites"
				/>
			</Helmet>

			<div className="min-h-screen flex justify-between flex-col">
				<div>
					<ModalCustom
						status={modalState.MODAL_ADD_PAYMENT.status}
						closeModal={closeModal}
						modal="MODAL_ADD_PAYMENT"
						className="md:rounded-lg p-3 md:p-5"
					>
						<h1 className="font-bold text-md mb-5">Cadastro de opção</h1>
						{!formLoading ? (
							<form onSubmit={handleSubmitAdd}>
								{/* <label htmlFor={formFields[3].name} className="block mb-3">
									<span className="block mb-1 font-bold text-xs md:text-md">Status:</span>
									<select
										name={formFields[3].name}
										id={formFields[3].name}
										value={formFields[3].value}
										className={`border block px-3 py-2 w-full rounded-md outline-0 ${
											Number(formFields[3].value) === 1
												? 'text-green-500 bg-green-100'
												: 'text-orange-500 bg-orange-100'
										}`}
										onChange={(e: any) => handleChange(e, formFields, setFormFields)}
									>
										<option value="1">Pago</option>
										<option value="2">Aguardando pagamento</option>
									</select>

									<span className="text-sm text-red-500 italic">{formFields[3].error}</span>
								</label> */}

								<label htmlFor={formFields[1].name} className="block mb-3">
									<span className="block mb-1 font-bold text-xs md:text-md">Mensagem:</span>
									<input
										type={formFields[1].type}
										name={formFields[1].name}
										id={formFields[1].name}
										placeholder="Mensagem..."
										maxLength={formFields[1].maxLength}
										value={formFields[1].value}
										onChange={(e: any) => handleChange(e, formFields, setFormFields)}
										className="border block px-3 py-2 w-full rounded-md outline-0"
									/>
									<span className="text-sm text-red-500 italic">{formFields[1].error}</span>
								</label>

								<label htmlFor={formFields[2].name} className="block mb-3">
									<span className="block mb-1 font-bold text-xs md:text-md">Ordem:</span>
									<input
										type={formFields[2].type}
										name={formFields[2].name}
										id={formFields[2].name}
										placeholder="Ordem..."
										maxLength={formFields[2].maxLength}
										value={formFields[2].value}
										onChange={(e: any) => handleChange(e, formFields, setFormFields)}
										className="border block px-3 py-2 w-full rounded-md outline-0"
									/>
									<span className="text-sm text-red-500 italic">{formFields[2].error}</span>
								</label>

								<label htmlFor={formFields[3].name} className="block mb-3">
									<span className="block mb-1 font-bold text-xs md:text-md">Texto Chave:</span>
									<input
										type={formFields[3].type}
										name={formFields[3].name}
										id={formFields[3].name}
										placeholder="1..."
										maxLength={formFields[3].maxLength}
										value={formFields[3].value}
										onChange={(e: any) => handleChange(e, formFields, setFormFields)}
										className="border block px-3 py-2 w-full rounded-md outline-0"
									/>
									<span className="text-sm text-red-500 italic">{formFields[3].error}</span>
								</label>

								<button
									type="submit"
									className="border block px-3 py-2 w-full rounded-md bg-blue-500 hover:bg-blue-600 text-white shadow mb-3"
								>
									Cadastrar cobrança
								</button>
								<button
									type="button"
									onClick={() => closeModal('MODAL_ADD_PAYMENT')}
									className="border block px-3 py-2 w-full rounded-md bg-white hover:bg-gray-50 text-gray-600 "
								>
									Cancelar
								</button>
							</form>
						) : (
							<Placeholder title="Registrando..." />
						)}
					</ModalCustom>
					<HeaderTop />
					<HeaderTopSecondary>
						<li className="text-sm ">
							<p className=" inline-block  text-gray-400">Dashboard</p>
						</li>
					</HeaderTopSecondary>

					{isImageQrCodeLoading && (
						<PixelABTest
							isQrCodeSyncing={isQrCodeSyncing}
							isQrCodeConnected={isQrCodeConnected}
							alias={rdxEmail}
						/>
					)}

					<pre>{JSON.stringify(isImageQrCodeLoading, null, 1)}</pre>
					<pre className="text-sm">{JSON.stringify(rdxAll, null, 1)}</pre>
					{isQrCodeConnected ? (
						<p>connected</p>
					) : isImageQrCodeLoading ? (
						<p>connectando...</p>
					) : (
						!isQrCodeConnected &&
						!isQrCodeSyncing && (
							<button onClick={() => handleWALogin(rdxEmail)} className="bg-blue-100">
								Conectar: {rdxEmail}
							</button>
						)
					)}

					{/* {isQrCodeConnected ? <p>Test Connected</p> : <p>NOT connected</p>} */}

					<div className="xl:container mx-auto my-2 md:my-5 px-2 md:px-5 3xl:px-0 ">
						{/* <div className="my-2 lg:my-3">
							<h2 className="font-bold text-md md:text-lg mb-1 md:mb-3 my-1 md:my-5">
								Área do cliente
							</h2>

							<ul className="space-y-1 text-sm">
								<li>
									<span className="font-bold">Empresa:</span> {dataClient.name}
								</li>
								<li>
									<span className="font-bold">Serviço:</span> {dataClient.service_description}
								</li>
								<li>
									<span className="font-bold">E-mail cobrança:</span> {dataClient.email}
								</li>
								<li>
									<span className="font-bold">Status:</span> {dataClient.service_status_text}
								</li>
								<li>
									<span className="font-bold">Dia de vencimento:</span> {dataClient.due_day}
								</li>
							</ul>
						</div> */}
						<h2 className="font-bold text-md md:text-lg mb-1 md:mb-3 my-1 md:my-5">
							Últimas cobranças
						</h2>

						<button type="button" onClick={() => waLogout(rdxEmail)}>
							DESLOGAR
						</button>

						<pre>{JSON.stringify(dataBotMap, null, 1)}</pre>

						<div className="border">
							{dataBotMap &&
								dataBotMap.map((section: any, index: any) => {
									return (
										<div
											className="border border-gray-300 flex justify-center space-x-4 py-10"
											key={`level-${index}`}
										>
											{section.map((item: any) => {
												return (
													<div key={`card-${item.id}`}>
														<Card
															item={item}
															handleClick={handleClick}
															options={getCurrentItem(item.id)}
														/>
														{Number(item.answerTo) !== 0 && (
															<Xarrow
																end={`test-${item.id}`}
																start={`test-${item.answerTo}`}
																zIndex={0}
																startAnchor="bottom"
																endAnchor="top"
																strokeWidth={2}
															/>
														)}
													</div>
												);
											})}
										</div>
									);
								})}
						</div>

						{/* {!isLoading && dataPayments !== null ? (
							dataPayments.length > 0 ? (
								<div className="my-2 md:my-5 overflow-x-auto">
									<table className="table-fixed sm:table-auto border-collapse border border-slate-400 w-full tr-even:bg-grey-100">
										<thead>
											<tr className="bg-gray-300">
												<th className="border border-gray-400 text-sm py-3 text-gray-500 text-left px-2 w-60">
													Cobrança
												</th>
												<th className="border border-gray-400 text-sm py-3 text-gray-500 text-left px-2 w-40">
													Referência
												</th>
												<th className="border border-gray-400 text-sm py-3 text-gray-500 text-left px-2 w-40">
													Vencimento
												</th>
												<th className="border border-gray-400 text-sm py-3 text-gray-500 text-left px-2 w-40">
													Comprovante
												</th>
												<th className="border border-gray-400 text-sm py-3 text-gray-500 text-left px-2 w-40">
													Boleto
												</th>
												<th className="border border-gray-400 text-sm py-3 text-gray-500 text-left px-2 w-40">
													Valor antes do vencimento
												</th>
												<th className="border border-gray-400 text-sm py-3 text-gray-500 text-left px-2 w-32">
													Status de pagamento
												</th>
											</tr>
										</thead>
										<tbody>
											{dataPayments.map((res) => {
												return (
													<tr className="odd:bg-white even:bg-gray-200" key={res.id}>
														<td className="border border-gray-300 text-sm py-1 px-2 ">
															<p className="inline-block">{res.name}</p>
														</td>
														<td className="border border-gray-300 text-sm py-1 px-2 ">{res.ref}</td>
														<td className="border border-gray-300 text-sm py-1 px-2 ">
															{res.due_date}
														</td>
														<td className="border border-gray-300 text-sm py-1 px-2 ">
															{res.charge_status_number === 1 ? (
																<Link to={`/receipt/${res.id}`}>
																	<p className="text-blue-400 hover:underline inline-block">
																		Visualizar comprovante
																	</p>
																</Link>
															) : (
																'-'
															)}
														</td>
														{fileToken !== null &&
															fileToken.token !== undefined &&
															fileToken.email !== undefined &&
															fileToken.timestamp !== undefined && (
																<td className="border border-gray-300 text-sm py-1 px-2  ">
																	{res.ticket_files.length > 0 ? (
																		res.ticket_files.map((file: any) => {
																			return (
																				<div key={file.id}>
																					{res.charge_status_number === 1 && <p className="">-</p>}
																					{(res.charge_status_number === 2 ||
																						res.charge_status_number === 3) && (
																						<a
																							href={`${END_POINT_BASE}/files/boleto?file=${file.id}&hash=${file.name}&role=CLIENT&token=${fileToken.token}&email=${fileToken.email}&timestamp=${fileToken.timestamp}`}
																						>
																							<p className="text-blue-400 hover:underline">
																								{file.title}
																							</p>
																						</a>
																					)}
																				</div>
																			);
																		})
																	) : (
																		<p>Vazio</p>
																	)}
																</td>
															)}
														<td className="border border-gray-300 text-sm py-1 px-2  ">
															R$ {res.pay_price_before_due_date}
														</td>
														<td
															className={`border border-gray-300 text-sm py-1 px-2   ${
																res.charge_status_number === 1
																	? 'text-green-500'
																	: res.charge_status_number === 2
																	? 'text-orange-300'
																	: 'text-red-500'
															}`}
														>
															{res.charge_status_text}
														</td>
													</tr>
												);
											})}
										</tbody>
									</table>
								</div>
							) : (
								<Placeholder title="Vazio" />
							)
						) : (
							<Placeholder />
						)} */}
						<p className="text-sm">
							* Para registros antigos solicite conosco enviando uma mensagem pelo nosso{' '}
							<a
								href="https://www.bhxsites.com.br/contato"
								target="_blank"
								className="text-blue-400 hover:underline"
							>
								Formulário de contato
							</a>
							.
						</p>
					</div>
				</div>

				<Footer />

				{/* <pre className="text-xs">{JSON.stringify(dataClient, null, 1)}</pre> */}
				{/* <pre className="text-xs">{JSON.stringify(dataPayments, null, 1)}</pre> */}
			</div>
		</>
	);
};

export default PageClientHub;
