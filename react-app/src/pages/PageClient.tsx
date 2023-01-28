/* eslint-disable */
/* eslint-disable react/jsx-one-expression-per-line */
import { useParams, Link, useHistory } from 'react-router-dom';
import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { Helmet } from 'react-helmet';

import { validateForm, IForm } from '../components/FormValidation';
import ModalCustom from '../components/ModalCustom';
import { getHasLocalStorageAuth } from '../helpers/handleStorage';
import Placeholder from '../components/Placeholder';
import HeaderTop from '../components/HeaderTop/HeaderTop';
import HeaderTopSecondary from '../components/HeaderTopSecondary/HeaderTopSecondary';

import { END_POINT_BASE } from '../Api/Api';

interface IResPayments {
	data: {
		payments?: any;
		message?: string;
		status: number;
	};
}

import { getPayments, addPayment } from '../Api/paymentsHandle';
import { getClientData } from '../Api/clientsHandle';
import Footer from '../components/Footer/Footer';

type modalIndex = 'MODAL_ADD_PAYMENT' | 'MODAL_SECONDARY';

const PageClient = () => {
	const history = useHistory();
	const [isLoading, setIsLoading] = useState<boolean>(true);
	const [dataPayments, setDataPayments] = useState<any[] | null>(null);
	const [dataClient, setDataClient] = useState<any>(null);
	const { cid } = useParams<any>();
	const [fileToken, setFileToken] = useState<any>(null);
	const [modalState, setModalState] = useState({
		MODAL_ADD_PAYMENT: { status: false },
		MODAL_SECONDARY: { status: false },
	});
	const [formLoading, setFormLoading] = useState<boolean>(false);
	const [formFields, setFormFields] = useState<IForm['inputs']>([
		{
			name: 'client_id',
			value: cid,
			error: '',
			type: 'text',
			isRequired: true,
		},
		{
			name: 'name',
			value: 'Mensalidade',
			error: '',
			type: 'text',
			isRequired: true,
			maxLength: 50,
		},
		{
			name: 'due_date',
			value: '',
			error: '',
			type: 'text',
			isRequired: true,
			maxLength: 10,
			minLength: 10,
		},
		{
			name: 'status',
			value: 2,
			error: '',
			type: 'text',
			isRequired: true,
		},
		{
			name: 'price_before',
			value: '',
			error: '',
			type: 'text',
			isRequired: true,
			maxLength: 50,
		},
		{
			name: 'price_after',
			value: '',
			error: '',
			type: 'text',
			isRequired: true,
			maxLength: 50,
		},
		{
			name: 'payment_confirm_date',
			value: '',
			error: '',
			type: 'text',
			maxLength: 10,
			minLength: 10,
		},
		{
			name: 'payment_confirm_note',
			value: '',
			error: '',
			type: 'text',
		},
		{
			name: 'payment_confirm_price',
			value: '',
			error: '',
			type: 'text',
			maxLength: 50,
		},
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
			const toastApi = toast.loading('Registrando cobrança...', {
				position: 'bottom-right',
			});
			setFormLoading(true);
			addPayment(
				cid,
				formFields[1].value,
				formFields[2].value,
				formFields[3].value,
				formFields[4].value,
				formFields[5].value,
				formFields[6].value,
				formFields[7].value,
				formFields[8].value,
			).then((responseData: any) => {
				if (responseData.data.status === 1) {
					loadingDataPayments();
					setFormFields([
						{ ...formFields[0] },
						{ ...formFields[1], value: 'Mensalidade' },
						{ ...formFields[2] },
						{ ...formFields[3] },
						{ ...formFields[4] },
						{ ...formFields[5] },
						{ ...formFields[6] },
						{ ...formFields[7] },
						{ ...formFields[8] },
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

	const loadingDataClient = async () => {
		await getClientData(cid).then((responseData: any) => {
			if (responseData.data.status === 1) {
				setDataClient(responseData.data.client);
			} else {
				history.push('/hub');
			}
		});
	};

	const loadingDataPayments = async () => {
		setDataPayments(null);
		await getPayments(cid).then((responsePayments: IResPayments) => {
			if (responsePayments.data.status === 1) {
				setDataPayments(responsePayments.data.payments);
			} else {
			}
			setIsLoading(false);
		});
	};

	useEffect(() => {
		const localStorageAuth = getHasLocalStorageAuth();
		setFileToken({
			token: localStorageAuth.data.token,
			email: localStorageAuth.data.email,
			timestamp: localStorageAuth.data.timestamp,
		});
		loadingDataClient();
		loadingDataPayments();
	}, []);

	if (dataClient === null) {
		return <Placeholder />;
	}

	return (
		<>
			<Helmet>
				<title>Cliente {dataClient.name} ADM - onPoint</title>
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
						<h1 className="font-bold text-md mb-5">Cadastro de cobrança</h1>
						{!formLoading ? (
							<form onSubmit={handleSubmitAdd}>
								<label htmlFor={formFields[3].name} className="block mb-3">
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
								</label>

								<label htmlFor={formFields[1].name} className="block mb-3">
									<span className="block mb-1 font-bold text-xs md:text-md">Nome da cobrança:</span>
									<input
										type={formFields[1].type}
										name={formFields[1].name}
										id={formFields[1].name}
										placeholder="Mensalidade..."
										maxLength={formFields[1].maxLength}
										value={formFields[1].value}
										onChange={(e: any) => handleChange(e, formFields, setFormFields)}
										className="border block px-3 py-2 w-full rounded-md outline-0"
									/>
									<span className="text-sm text-red-500 italic">{formFields[1].error}</span>
								</label>

								<div className="flex justify-between space-x-5">
									<label htmlFor={formFields[2].name} className="block mb-3 basis-1/3">
										<span className="block mb-1 font-bold text-xs md:text-md">
											Data de vencimento:
										</span>
										<input
											type={formFields[2].type}
											name={formFields[2].name}
											id={formFields[2].name}
											placeholder="DD/MM/YYYY"
											maxLength={formFields[2].maxLength}
											value={formFields[2].value}
											onChange={(e: any) => handleChange(e, formFields, setFormFields, 'DATE')}
											className="border block px-3 py-2 w-full rounded-md outline-0"
										/>
										<span className="text-sm text-red-500 italic">{formFields[2].error}</span>
									</label>

									<label htmlFor={formFields[4].name} className="block mb-3 basis-1/3">
										<span className="block mb-1 font-bold text-xs md:text-md">
											Preço antes do vencimento:
										</span>
										<input
											type={formFields[4].type}
											name={formFields[4].name}
											id={formFields[4].name}
											placeholder="99,00"
											maxLength={formFields[4].maxLength}
											value={formFields[4].value}
											onChange={(e: any) => handleChange(e, formFields, setFormFields, 'MONEY')}
											className="border block px-3 py-2 w-full rounded-md outline-0"
										/>
										<span className="text-sm text-red-500 italic">{formFields[4].error}</span>
									</label>

									<label htmlFor={formFields[5].name} className="block mb-3 basis-1/3">
										<span className="block mb-1 font-bold text-xs md:text-md">
											Preço após o vencimento:
										</span>
										<input
											type={formFields[5].type}
											name={formFields[5].name}
											id={formFields[5].name}
											placeholder="99,00"
											maxLength={formFields[5].maxLength}
											value={formFields[5].value}
											onChange={(e: any) => handleChange(e, formFields, setFormFields, 'MONEY')}
											className="border block px-3 py-2 w-full rounded-md outline-0"
										/>
										<span className="text-sm text-red-500 italic">{formFields[5].error}</span>
									</label>
								</div>

								{Number(formFields[3].value) === 1 && (
									<>
										<hr className="my-5 border-dashed" />
										<h2 className="font-bold text-sm mb-5">Confirmação de pagamento</h2>
										<div className="flex justify-between space-x-5">
											<label htmlFor={formFields[8].name} className="block mb-3  basis-1/2">
												<span className="block mb-1 font-bold text-xs md:text-md">Valor pago:</span>
												<input
													type={formFields[8].type}
													name={formFields[8].name}
													id={formFields[8].name}
													placeholder="99,00"
													maxLength={formFields[8].maxLength}
													value={formFields[8].value}
													onChange={(e: any) => handleChange(e, formFields, setFormFields, 'MONEY')}
													className="border block px-3 py-2 w-full rounded-md outline-0"
												/>
												<span className="text-sm text-red-500 italic">{formFields[8].error}</span>
											</label>

											<label htmlFor={formFields[6].name} className="block mb-3  basis-1/2">
												<span className="block mb-1 font-bold text-xs md:text-md">
													Confirmação de pagamento:
												</span>
												<input
													type={formFields[6].type}
													name={formFields[6].name}
													id={formFields[6].name}
													placeholder="DD/MM/YYYY"
													maxLength={formFields[6].maxLength}
													value={formFields[6].value}
													onChange={(e: any) => handleChange(e, formFields, setFormFields, 'DATE')}
													className="border block px-3 py-2 w-full rounded-md outline-0"
												/>
												<span className="text-sm text-red-500 italic">{formFields[6].error}</span>
											</label>
										</div>

										<label htmlFor={formFields[7].name} className="block mb-3">
											<span className="block mb-1 font-bold text-xs md:text-md">Anotação:</span>
											<input
												type={formFields[7].type}
												name={formFields[7].name}
												id={formFields[7].name}
												maxLength={formFields[7].maxLength}
												value={formFields[7].value}
												onChange={(e: any) => handleChange(e, formFields, setFormFields)}
												className="border block px-3 py-2 w-full rounded-md outline-0"
											/>
											<span className="text-sm text-red-500 italic">{formFields[7].error}</span>
										</label>
									</>
								)}

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
							<Link to="/hub">
								<p className="text-blue-400 hover:underline inline-block">Dashboard</p>
							</Link>
						</li>
						<li className="text-xs text-gray-500">
							<i className="bi bi-chevron-right "></i>
						</li>
						<li className="text-gray-400 text-sm">{dataClient.name}</li>
					</HeaderTopSecondary>

					<div className="container mx-auto my-2 md:my-5 px-2 md:px-5 3xl:px-0">
						<div className="my-2 lg:my-3">
							<ul className="space-y-1 text-sm">
								<li>
									<span className="font-bold">Empresa:</span> {dataClient.name}
								</li>
								<li>
									<span className="font-bold">Dia de vencimento:</span>{' '}
									{dataClient.service_due_date}
								</li>
								<li>
									<span className="font-bold">Cobrança automática por e-mail:</span>{' '}
									{Number(dataClient.email_auto_sender) === 1 ? 'Sim' : 'Não'}
								</li>
								<li>
									<span className="font-bold">CNPJ:</span> {dataClient.cnpj}
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
							</ul>

							<h2 className="font-bold text-md md:text-lg mb-1 md:mb-3 my-1 md:my-5">
								Cobranças disponíveis
							</h2>

							<button
								className="bg-blue-50 hover:bg-blue-100 text-blue-400 py-1 px-3 mb-3 rounded-md"
								type="button"
								onClick={() => openModal('MODAL_ADD_PAYMENT')}
							>
								Adicionar cobrança
							</button>
						</div>

						{!isLoading && dataPayments !== null ? (
							dataPayments.length > 0 ? (
								<div className="my-2 md:my-5 overflow-x-auto">
									<table className="table-fixed sm:table-auto border-collapse border border-slate-400 w-full tr-even:bg-grey-100">
										<thead>
											<tr className="bg-gray-400">
												<th className="border border-slate-300 w-60">Título</th>
												<th className="border border-slate-300 w-40">Referência</th>
												<th className="border border-slate-300 w-40">Vencimento</th>
												<th className="border border-slate-300 w-40">Comprovante</th>
												<th className="border border-slate-300 w-40">Boleto(s)</th>
												<th className="border border-slate-300 w-32">Status</th>
												<th className="border border-slate-300 w-32">E-mail de cobrança</th>
											</tr>
										</thead>
										<tbody>
											{dataPayments.map((res) => {
												return (
													<tr className="odd:bg-white even:bg-gray-200" key={res.id}>
														<td className="border border-slate-300 text-sm py-1 px-2 ">
															<Link to={`/payment/${res.id}`}>
																<p className="text-blue-400 hover:underline inline-block">
																	#{res.id} {res.name}
																</p>
															</Link>
														</td>

														<td className="border border-slate-300 text-sm py-1 px-2">{res.ref}</td>
														<td className="border border-slate-300 text-sm py-1 px-2">
															{res.due_date}
														</td>
														<td className="border border-slate-300 text-sm py-1 px-2">
															{res.charge_status_number === 1 ? (
																<Link to={`/receipt/${res.id}`}>
																	<p className="text-blue-400 hover:underline inline-block">
																		Visualizar
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
																<td className="border border-slate-300 text-sm py-1 px-2 ">
																	{res.ticket_files.length > 0 ? (
																		res.ticket_files.map((file: any) => {
																			return (
																				<a
																					href={`${END_POINT_BASE}/files/boleto?file=${file.id}&hash=${file.name}&role=ADMIN&token=${fileToken.token}&email=${fileToken.email}&timestamp=${fileToken.timestamp}`}
																					key={file.id}
																				>
																					<p className="text-blue-400 hover:underline">
																						#{file.id} {file.title}
																					</p>
																				</a>
																			);
																		})
																	) : (
																		<p>Vazio</p>
																	)}
																</td>
															)}

														<td
															className={`border border-slate-300 text-sm py-1 px-2  ${
																res.charge_status_number === 1
																	? 'text-green-500'
																	: res.charge_status_number === 2
																	? 'text-orange-300'
																	: res.charge_status_number === 3
																	? 'text-red-500'
																	: 'text-gray-500'
															}`}
														>
															{res.charge_status_text}
														</td>
														<td
															className={`border border-slate-300 text-sm py-1 px-2  ${
																Number(res.email_sended_number) === 2
																	? 'text-green-500'
																	: 'text-orange-300'
															}`}
														>
															{res.email_sended_text}
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
						)}
					</div>
				</div>

				<Footer />
			</div>
			{/* <pre className="text-xs">{JSON.stringify(dataClient, null, 1)}</pre> */}
			{/* // <pre className="text-xs">{JSON.stringify(dataPayments, null, 1)}</pre> */}
		</>
	);
};

export default PageClient;
