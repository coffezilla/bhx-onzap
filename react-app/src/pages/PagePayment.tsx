/* eslint-disable */
/* eslint-disable react/jsx-one-expression-per-line */
import { useParams, Link, useHistory } from 'react-router-dom';
import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import Swal from 'sweetalert2';
import { Helmet } from 'react-helmet';

import '../SweetAlertCustom.scss';

import { getHasLocalStorageAuth } from '../helpers/handleStorage';
import { validateForm, IForm } from '../components/FormValidation';
import ModalCustom from '../components/ModalCustom';
import Placeholder from '../components/Placeholder';
import InputFileLive from '../components/InputFileLive';
import HeaderTop from '../components/HeaderTop/HeaderTop';
import HeaderTopSecondary from '../components/HeaderTopSecondary/HeaderTopSecondary';

import { END_POINT_BASE } from '../Api/Api';

//
import { getFiles, addFile, removeFile } from '../Api/filesHandle';
import { getPaymentData, editPayment, removePayment } from '../Api/paymentsHandle';
import Footer from '../components/Footer/Footer';

interface IResFiles {
	data: {
		files?: any;
		message?: string;
		status: number;
	};
}

type modalIndex = 'MODAL_EDIT_PAYMENT' | 'MODAL_ADD_FILE';

const PagePayment = () => {
	const [isLoading, setIsLoading] = useState<boolean>(true);
	const [dataFiles, setDataFiles] = useState<any[] | null>(null);
	const [dataPayment, setDataPayment] = useState<any>(null);
	const { pid } = useParams<any>();
	const [fileToken, setFileToken] = useState<any>(null);
	const history = useHistory();
	const [modalState, setModalState] = useState({
		MODAL_EDIT_PAYMENT: { status: false },
		MODAL_ADD_FILE: { status: false },
	});
	const [formLoading, setFormLoading] = useState<boolean>(false);
	const [formFields, setFormFields] = useState<IForm['inputs']>([
		{
			name: 'payment_id',
			value: pid,
			error: '',
			type: 'text',
			isRequired: true,
		},
		{
			name: 'name',
			value: 'Boleto',
			error: '',
			type: 'text',
			isRequired: true,
			maxLength: 50,
		},
		{
			name: 'attachment',
			value: '',
			error: '',
			type: 'text',
			files: [],
			isRequired: true,
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
			name: 'price',
			value: '',
			error: '',
			type: 'text',
			files: [],
			isRequired: true,
			maxLength: 50,
		},
	]);
	const [formEditFields, setFormEditFields] = useState<IForm['inputs']>([
		{
			name: 'payment_id',
			value: pid,
			error: '',
			type: 'text',
			isRequired: true,
		},
		{
			name: 'name',
			value: '',
			error: '',
			type: 'text',
			isRequired: true,
			maxLength: 100,
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
			value: 1,
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
			maxLength: 100,
		},
		{
			name: 'price_after',
			value: '',
			error: '',
			type: 'text',
			isRequired: true,
			maxLength: 100,
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
			maxLength: 300,
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
		if (modalName === 'MODAL_ADD_FILE') {
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
			const toastApi = toast.loading('Registrando arquivo...', {
				position: 'bottom-right',
			});
			setFormLoading(true);
			addFile(
				pid,
				formFields[1].value,
				formFields[2].files,
				formFields[3].value,
				formFields[4].value,
			).then((responseData: any) => {
				if (responseData.data.status === 1) {
					loadingDataFiles();
					setFormFields([
						{ ...formFields[0] },
						{ ...formFields[1], value: 'Boleto' },
						{ ...formFields[2], value: '' },
						{ ...formFields[3] },
						{ ...formFields[4] },
					]);
					toast.success('Arquivo registrado!', {
						duration: 5000,
						id: toastApi,
					});
				} else {
					toast.error('Erro!', {
						duration: 5000,
						id: toastApi,
					});
				}
				closeModal('MODAL_ADD_FILE');
				setFormLoading(false);
			});
		}
	};

	const handleSubmitEdit = (e: any) => {
		e.preventDefault();

		const isValid = validationForm(formEditFields, setFormEditFields);
		if (isValid) {
			const toastApi = toast.loading('Atualizando cobrança...', {
				position: 'bottom-right',
			});
			setFormLoading(true);
			editPayment(
				pid,
				formEditFields[1].value,
				formEditFields[2].value,
				formEditFields[3].value,
				formEditFields[4].value,
				formEditFields[5].value,
				formEditFields[6].value,
				formEditFields[7].value,
				formEditFields[8].value,
			).then((responseData: any) => {
				if (responseData.data.status === 1) {
					loadingDataPayment();
					toast.success('Cobrança atualizada!', {
						duration: 5000,
						id: toastApi,
					});
				} else {
					toast.error('Erro!', {
						duration: 5000,
						id: toastApi,
					});
				}
				closeModal('MODAL_EDIT_PAYMENT');
				setFormLoading(false);
			});
		}
	};

	const handleSubmitRemove = () => {
		Swal.fire({
			title: 'Deletar cobrança',
			text: 'Deseja deletar esta cobrança?',
			allowEnterKey: false,
			confirmButtonText: `Deletar cobrança`,
			showCancelButton: true,
			cancelButtonText: `Cancelar`,
			allowEscapeKey: true,
			showCloseButton: true,
			didOpen: () => {
				const closeButtonNewIcon = '<i class="hover:underline">Fechar</i>';
				const swalButtonDefault = document.querySelector('.swal-theme-pes__close_icon');
				if (swalButtonDefault) {
					swalButtonDefault.innerHTML = closeButtonNewIcon;
				}
			},
			showClass: {
				popup: 'swal-theme-pes__animation swal-theme-pes__animation--open ',
			},
			hideClass: {
				popup: 'swal-theme-pes__animation swal-theme-pes__animation--close',
			},
			customClass: {
				container: 'swal-theme-pes__container',
				closeButton: 'swal-theme-pes__close_icon',
				htmlContainer: 'swal-theme-pes__html_container',
				actions: 'swal-theme-pes__actions',
				popup: 'swal-theme-pes__popup w-max-sm',
				title: 'swal-theme-pes__title',
				confirmButton:
					'swal-theme-pes__button swal-theme-pes__button--confirm border block px-3 py-2 w-full rounded-md bg-blue-500 hover:bg-blue-600 text-white shadow mb-3',
				cancelButton:
					'swal-theme-pes__button swal-theme-pes__button--cancel border block px-3 py-2 w-full rounded-md bg-white hover:bg-gray-50 text-gray-600',
				denyButton: 'swal-theme-pes__button swal-theme-pes__button--deny',
			},
		}).then((result: any) => {
			// setIsLoading(true);
			if (result.isConfirmed) {
				const toastApi = toast.loading('Removendo cobrança...', {
					position: 'bottom-right',
				});
				removePayment(pid).then((responseData: any) => {
					if (responseData.data.status === 1) {
						history.push(`/client/${dataPayment.client_id}`);
						toast.success('Cobrança removida!', {
							duration: 5000,
							id: toastApi,
						});
					} else {
						toast.error('Erro!', {
							duration: 5000,
							id: toastApi,
						});
					}
				});
			}
		});
	};

	const handleSubmitFileRemove = (fileId: any) => {
		Swal.fire({
			title: 'Deletar arquivo?',
			text: 'Deseja deletar este arquivo de cobrança?',
			allowEnterKey: false,
			confirmButtonText: `Deletar arquivo`,
			showCancelButton: true,
			cancelButtonText: `Cancelar`,
			allowEscapeKey: true,
			showCloseButton: true,
			didOpen: () => {
				const closeButtonNewIcon = '<i class="hover:underline">Fechar</i>';
				const swalButtonDefault = document.querySelector('.swal-theme-pes__close_icon');
				if (swalButtonDefault) {
					swalButtonDefault.innerHTML = closeButtonNewIcon;
				}
			},
			showClass: {
				popup: 'swal-theme-pes__animation swal-theme-pes__animation--open ',
			},
			hideClass: {
				popup: 'swal-theme-pes__animation swal-theme-pes__animation--close',
			},
			customClass: {
				container: 'swal-theme-pes__container',
				closeButton: 'swal-theme-pes__close_icon',
				htmlContainer: 'swal-theme-pes__html_container',
				actions: 'swal-theme-pes__actions',
				popup: 'swal-theme-pes__popup w-max-sm',
				title: 'swal-theme-pes__title',
				confirmButton:
					'swal-theme-pes__button swal-theme-pes__button--confirm border block px-3 py-2 w-full rounded-md bg-blue-500 hover:bg-blue-600 text-white shadow mb-3',
				cancelButton:
					'swal-theme-pes__button swal-theme-pes__button--cancel border block px-3 py-2 w-full rounded-md bg-white hover:bg-gray-50 text-gray-600',
				denyButton: 'swal-theme-pes__button swal-theme-pes__button--deny',
			},
		}).then((result: any) => {
			// setIsLoading(true);
			if (result.isConfirmed) {
				const toastApi = toast.loading('Removendo arquivo...', {
					position: 'bottom-right',
				});

				removeFile(fileId).then((responseData: any) => {
					if (responseData.data.status === 1) {
						loadingDataFiles();
						toast.success('Arquivo removido!', {
							duration: 5000,
							id: toastApi,
						});
					} else {
						toast.error('Erro!', {
							duration: 5000,
							id: toastApi,
						});
					}
				});
			}
		});
	};

	// ------------------------ // FORM

	const loadingDataPayment = async () => {
		await getPaymentData(pid).then((responseData: any) => {
			if (responseData.data.status === 1) {
				setDataPayment(responseData.data.payment);

				setFormFields([
					{ ...formFields[0] },
					{ ...formFields[1], value: 'Boleto' },
					{ ...formFields[2], value: '' },
					{ ...formFields[3], value: responseData.data.payment.due_date },
					{ ...formFields[4], value: responseData.data.payment.price_before_due_date },
				]);

				setFormEditFields([
					{ ...formEditFields[0] },
					{ ...formEditFields[1], value: responseData.data.payment.name },
					{ ...formEditFields[2], value: responseData.data.payment.due_date },
					{ ...formEditFields[3], value: responseData.data.payment.status },
					{ ...formEditFields[4], value: responseData.data.payment.price_before_due_date },
					{ ...formEditFields[5], value: responseData.data.payment.price_after_due_date },
					{
						...formEditFields[6],
						value:
							responseData.data.payment.payment_date === '30/11/-0001'
								? ''
								: responseData.data.payment.payment_date,
					},
					{ ...formEditFields[7], value: responseData.data.payment.note },
					{ ...formEditFields[8], value: responseData.data.payment.price_paid },
				]);
			} else {
				history.push('/hub');
			}
		});
	};

	const loadingDataFiles = async () => {
		setDataFiles(null);
		await getFiles(pid).then((responseFiles: IResFiles) => {
			if (responseFiles.data.status === 1) {
				setDataFiles(responseFiles.data.files);
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
		loadingDataPayment();
		loadingDataFiles();
	}, []);

	if (dataPayment === null) {
		return <Placeholder />;
	}

	return (
		<>
			<Helmet>
				<title>COBRANÇA ADMIN {dataPayment.ref} - onPoint</title>
				<meta
					name="description"
					content="Baixe boletos e imprima comprovantes de serviço na área do cliente BHX Sites"
				/>
			</Helmet>
			<div className="min-h-screen flex justify-between flex-col">
				<div>
					<ModalCustom
						status={modalState.MODAL_EDIT_PAYMENT.status}
						closeModal={closeModal}
						modal="MODAL_EDIT_PAYMENT"
						className="md:rounded-lg p-3 md:p-5"
					>
						<h1 className="font-bold text-md mb-5">Edição de cobrança</h1>
						{!formLoading ? (
							<form onSubmit={handleSubmitEdit}>
								<label htmlFor={formEditFields[3].name} className="block mb-3">
									<span className="block mb-1 font-bold text-xs md:text-md">Status:</span>
									<select
										name={formEditFields[3].name}
										id={formEditFields[3].name}
										className={`border block px-3 py-2 w-full rounded-md outline-0 ${
											Number(formEditFields[3].value) === 1
												? 'text-green-500 bg-green-100'
												: 'text-orange-500 bg-orange-100'
										}`}
										value={formEditFields[3].value}
										onChange={(e: any) => handleChange(e, formEditFields, setFormEditFields)}
									>
										<option value="1">Pago</option>
										<option value="2">Aguardando pagamento</option>
									</select>
									<span className="text-sm text-red-500 italic">{formEditFields[3].error}</span>
								</label>

								<label htmlFor={formEditFields[1].name} className="block mb-3">
									<span className="block mb-1 font-bold text-xs md:text-md">Nome da cobrança:</span>
									<input
										type={formEditFields[1].type}
										name={formEditFields[1].name}
										id={formEditFields[1].name}
										placeholder="Mensalidade..."
										maxLength={formEditFields[1].maxLength}
										value={formEditFields[1].value}
										onChange={(e: any) => handleChange(e, formEditFields, setFormEditFields)}
										className="border block px-3 py-2 w-full rounded-md outline-0"
									/>
									<span className="text-sm text-red-500 italic">{formEditFields[1].error}</span>
								</label>

								<div className="flex justify-between space-x-5">
									<label htmlFor={formEditFields[2].name} className="block mb-3 basis-1/3">
										<span className="block mb-1 font-bold text-xs md:text-md">
											Data de vencimento:
										</span>
										<input
											type={formEditFields[2].type}
											name={formEditFields[2].name}
											id={formEditFields[2].name}
											placeholder="DD/MM/YYYY"
											maxLength={formEditFields[2].maxLength}
											value={formEditFields[2].value}
											onChange={(e: any) =>
												handleChange(e, formEditFields, setFormEditFields, 'DATE')
											}
											className="border block px-3 py-2 w-full rounded-md outline-0"
										/>
										<span className="text-sm text-red-500 italic">{formEditFields[2].error}</span>
									</label>

									<label htmlFor={formEditFields[4].name} className="block mb-3 basis-1/3">
										<span className="block mb-1 font-bold text-xs md:text-md">
											Preço antes do vencimento:
										</span>
										<input
											type={formEditFields[4].type}
											name={formEditFields[4].name}
											id={formEditFields[4].name}
											placeholder="99,00"
											maxLength={formEditFields[4].maxLength}
											value={formEditFields[4].value}
											onChange={(e: any) =>
												handleChange(e, formEditFields, setFormEditFields, 'MONEY')
											}
											className="border block px-3 py-2 w-full rounded-md outline-0"
										/>
										<span className="text-sm text-red-500 italic">{formEditFields[4].error}</span>
									</label>

									<label htmlFor={formEditFields[5].name} className="block mb-3 basis-1/3">
										<span className="block mb-1 font-bold text-xs md:text-md">
											Preço após o vencimento:
										</span>
										<input
											type={formEditFields[5].type}
											name={formEditFields[5].name}
											id={formEditFields[5].name}
											placeholder="99,00"
											maxLength={formEditFields[5].maxLength}
											value={formEditFields[5].value}
											onChange={(e: any) =>
												handleChange(e, formEditFields, setFormEditFields, 'MONEY')
											}
											className="border block px-3 py-2 w-full rounded-md outline-0"
										/>
										<span className="text-sm text-red-500 italic">{formEditFields[5].error}</span>
									</label>
								</div>

								{Number(formEditFields[3].value) === 1 && (
									<>
										<hr className="my-5 border-dashed" />
										<h2 className="font-bold text-sm mb-5">Confirmação de pagamento</h2>
										<div className="flex justify-between space-x-5">
											<label htmlFor={formEditFields[8].name} className="block mb-3 basis-1/2">
												<span className="block mb-1 font-bold text-xs md:text-md">Valor pago:</span>
												<input
													type={formEditFields[8].type}
													name={formEditFields[8].name}
													id={formEditFields[8].name}
													placeholder="99,00"
													maxLength={formEditFields[8].maxLength}
													value={formEditFields[8].value}
													onChange={(e: any) =>
														handleChange(e, formEditFields, setFormEditFields, 'MONEY')
													}
													className="border block px-3 py-2 w-full rounded-md outline-0"
												/>
												<span className="text-sm text-red-500 italic">
													{formEditFields[8].error}
												</span>
											</label>
											<label htmlFor={formEditFields[6].name} className="block mb-3 basis-1/2">
												<span className="block mb-1 font-bold text-xs md:text-md">
													Confirmação de pagamento:
												</span>
												<input
													type={formEditFields[6].type}
													name={formEditFields[6].name}
													id={formEditFields[6].name}
													placeholder="DD/MM/YYYY"
													maxLength={formEditFields[6].maxLength}
													value={formEditFields[6].value}
													onChange={(e: any) =>
														handleChange(e, formEditFields, setFormEditFields, 'DATE')
													}
													className="border block px-3 py-2 w-full rounded-md outline-0"
												/>
												<span className="text-sm text-red-500 italic">
													{formEditFields[6].error}
												</span>
											</label>
										</div>

										<label htmlFor={formEditFields[7].name} className="block mb-3">
											<span className="block mb-1 font-bold text-xs md:text-md">Anotação:</span>
											<input
												type={formEditFields[7].type}
												name={formEditFields[7].name}
												id={formEditFields[7].name}
												maxLength={formEditFields[7].maxLength}
												value={formEditFields[7].value}
												onChange={(e: any) => handleChange(e, formEditFields, setFormEditFields)}
												className="border block px-3 py-2 w-full rounded-md outline-0"
											/>
											<span className="text-sm text-red-500 italic">{formEditFields[7].error}</span>
										</label>
									</>
								)}

								<button
									type="submit"
									className="border block px-3 py-2 w-full rounded-md bg-blue-500 hover:bg-blue-600 text-white shadow mb-3"
								>
									Confirmar
								</button>
								<button
									type="button"
									onClick={() => closeModal('MODAL_EDIT_PAYMENT')}
									className="border block px-3 py-2 w-full rounded-md bg-white hover:bg-gray-50 text-gray-600 "
								>
									Cancelar
								</button>
							</form>
						) : (
							<Placeholder title="Atualizando..." />
						)}
					</ModalCustom>

					<ModalCustom
						status={modalState.MODAL_ADD_FILE.status}
						closeModal={closeModal}
						modal="MODAL_ADD_FILE"
						className="md:rounded-lg p-3 md:p-5"
					>
						<h1 className="font-bold text-md mb-5">Cadastro de boleto</h1>
						{!formLoading ? (
							<form onSubmit={handleSubmitAdd} encType="multipart/form-data">
								<label htmlFor={formFields[1].name} className="block mb-3">
									<span className="block mb-1 font-bold text-xs md:text-md">Nome do boleto:</span>
									<input
										type={formFields[1].type}
										name={formFields[1].name}
										id={formFields[1].name}
										placeholder="Boleto..."
										maxLength={formFields[1].maxLength}
										value={formFields[1].value}
										onChange={(e: any) => handleChange(e, formFields, setFormFields)}
										className="border block px-3 py-2 w-full rounded-md outline-0"
									/>
									<span className="text-sm text-red-500 italic">{formFields[1].error}</span>
								</label>

								<label htmlFor={formFields[2].name} className="block mb-3">
									<span className="block mb-1 font-bold text-xs md:text-md">Arquivo anexo:</span>
									<InputFileLive
										inputValueFile={formFields[2].value}
										inputNameFile={formFields[2].name}
										inputValues={formFields}
										setInputValues={setFormFields}
										maxSize={2000}
										onChangeHandle={handleChange}
										customClass=""
									/>

									<span className="text-sm text-red-500 italic">{formFields[2].error}</span>
								</label>

								<label htmlFor={formFields[3].name} className="block mb-3">
									<span className="block mb-1 font-bold text-xs md:text-md">
										Data de vencimento:
									</span>
									<input
										type={formFields[3].type}
										name={formFields[3].name}
										id={formFields[3].name}
										placeholder="DD/MM/YYYY"
										maxLength={formFields[3].maxLength}
										value={formFields[3].value}
										onChange={(e: any) => handleChange(e, formFields, setFormFields, 'DATE')}
										className="border block px-3 py-2 w-full rounded-md outline-0"
									/>
									<span className="text-sm text-red-500 italic">{formFields[3].error}</span>
								</label>

								<label htmlFor={formFields[4].name} className="block mb-3">
									<span className="block mb-1 font-bold text-xs md:text-md">Valor:</span>
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

								<button
									type="submit"
									className="border block px-3 py-2 w-full rounded-md bg-blue-500 hover:bg-blue-600 text-white shadow mb-3"
								>
									Cadastrar boleto
								</button>
								<button
									type="button"
									onClick={() => closeModal('MODAL_ADD_FILE')}
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
						<li className="text-sm ">
							<Link to={`/client/${dataPayment.client_id}`}>
								<p className="text-blue-400 hover:underline inline-block">
									{dataPayment.client_name}
								</p>
							</Link>
						</li>
						<li className="text-xs text-gray-500">
							<i className="bi bi-chevron-right "></i>
						</li>
						<li className="text-gray-400 text-sm">
							#{pid} {dataPayment.name}
						</li>
					</HeaderTopSecondary>

					<div className="container mx-auto my-2 md:my-5 px-2 md:px-5 3xl:px-0">
						<div className="my-2 lg:my-3">
							<button
								className="bg-blue-50 hover:bg-blue-100 text-blue-400 py-1 px-3 mb-3 rounded-md"
								type="button"
								onClick={() => openModal('MODAL_EDIT_PAYMENT')}
							>
								Editar dados
							</button>

							<div className="block">
								<p
									className={` text-sm py-1 px-3 rounded-md inline-block my-2 lg:my-3  ${
										Number(dataPayment.email_sended_number) === 2
											? 'bg-green-100 text-green-500'
											: 'bg-orange-100 text-orange-500'
									}`}
								>
									<span className="font-bold">E-mail de cobrança automático:</span>{' '}
									{dataPayment.email_sended_text}{' '}
									{Number(dataPayment.email_sended_number) === 2 &&
										' - ' + dataPayment.email_sended_date}
								</p>
							</div>

							<div className="block">
								<p
									className={` text-sm py-1 px-3 rounded-md inline-block my-2 lg:my-3  ${
										dataPayment.charge_status_number === 1
											? 'bg-green-100 text-green-500'
											: dataPayment.charge_status_number === 2
											? 'bg-orange-100 text-orange-500'
											: dataPayment.charge_status_number === 3
											? 'bg-red-100 text-red-500'
											: 'bg-gray-100 text-gray-500'
									}`}
								>
									<span className="font-bold">Status:</span> {dataPayment.charge_status_text}
								</p>
							</div>

							<ul className="space-y-1 text-sm my-3">
								<li>
									<span className="font-bold">Serviço:</span> {dataPayment.service_description}
								</li>
								<li>
									<span className="font-bold">Referência:</span> {dataPayment.ref}
								</li>
								<li>
									<span className="font-bold">Título:</span> {dataPayment.name}
								</li>
								<li>
									<span className="font-bold">Valor antes do vencimento:</span> R${' '}
									{dataPayment.price_before_due_date}
								</li>
								<li>
									<span className="font-bold">Vencimento:</span> {dataPayment.due_date}
								</li>
								<li>
									<span className="font-bold">Valor após o vencimento:</span> R${' '}
									{dataPayment.price_after_due_date}
								</li>
							</ul>
						</div>

						<div className="my-3">
							<h2 className="font-bold text-md md:text-lg mb-1 md:mb-3 my-1 md:my-5">
								Comprovante de pagamento
							</h2>
							{dataPayment.charge_status_number === 1 ? (
								<div>
									<Link to={`/receipt/${pid}`}>
										<p className="text-blue-400 hover:underline inline-block">
											Visualizar comprovante
										</p>
									</Link>
									<ul className="space-y-1 text-sm my-5">
										<li>
											<span className="font-bold">Confirmação de pagamento:</span>{' '}
											{dataPayment.payment_date}
										</li>
										<li>
											<span className="font-bold">Valor pago:</span> R$ {dataPayment.price_paid}
										</li>
										<li>
											<span className="font-bold">Nota:</span> {dataPayment.note}
										</li>
									</ul>
								</div>
							) : (
								<p className=" text-gray-400 text-sm">"Comprovante não disponível"</p>
							)}
						</div>

						<div className="my-3">
							<h2 className="font-bold text-md md:text-lg mb-1 md:mb-3 my-1 md:my-5">
								Boleto de cobrança
							</h2>
							<button
								className="bg-blue-50 hover:bg-blue-100 text-blue-400 py-1 px-3 rounded-md"
								type="button"
								onClick={() => openModal('MODAL_ADD_FILE')}
							>
								Adicionar boleto PDF
							</button>
						</div>

						{!isLoading && dataFiles !== null ? (
							dataFiles.length > 0 ? (
								<div className="my-2 md:my-5 overflow-x-auto">
									<table className="table-fixed sm:table-auto border-collapse border border-slate-400 w-full tr-even:bg-grey-100">
										<thead>
											<tr className="bg-gray-400">
												<th className="border border-slate-300 w-96">Arquivo</th>
												<th className="border border-slate-300 w-40">Data de emissão</th>
												<th className="border border-slate-300 w-40">Data de Vencimento</th>
												<th className="border border-slate-300 w-40">Valor</th>
												<th className="border border-slate-300 w-40">Edição</th>
											</tr>
										</thead>

										<tbody>
											{dataFiles.map((res) => {
												return (
													<tr className="odd:bg-white even:bg-gray-200" key={res.id}>
														<td className="border border-slate-300 text-sm py-1 px-2 ">
															{fileToken !== null &&
																fileToken.token !== undefined &&
																fileToken.email !== undefined &&
																fileToken.timestamp !== undefined && (
																	<a
																		href={`${END_POINT_BASE}/files/boleto?file=${res.id}&hash=${res.name}&role=ADMIN&token=${fileToken.token}&email=${fileToken.email}&timestamp=${fileToken.timestamp}`}
																	>
																		<p className="text-blue-400 hover:underline inline-block">
																			#{res.id} {res.title} - {res.name}
																		</p>
																	</a>
																)}
														</td>
														<td className="border border-slate-300 text-sm py-1 px-2">
															{res.emited_date}
														</td>
														<td className="border border-slate-300 text-sm py-1 px-2">
															{res.due_date}
														</td>
														<td className="border border-slate-300 text-sm py-1 px-2">
															{res.charge_value}
														</td>
														<td className="border border-slate-300 text-sm py-1 px-2 ">
															<button
																className="text-red-500 hover:underline "
																type="button"
																onClick={() => handleSubmitFileRemove(res.id)}
															>
																Deletar arquivo
															</button>
														</td>
													</tr>
												);
											})}
										</tbody>
									</table>
								</div>
							) : (
								<Placeholder title="Nenhum boleto cadastrado" className="text-red-500" />
							)
						) : (
							<Placeholder />
						)}

						<div className="mt-3 md:mt-5 mb-3 ">
							<button
								className="bg-red-50 hover:bg-red-100 text-red-400 py-1 px-3 rounded-md"
								type="button"
								onClick={() => handleSubmitRemove()}
							>
								Deletar cobrança
							</button>
						</div>
					</div>
				</div>
				<Footer />
			</div>

			{/* <pre className="text-xs">{JSON.stringify(dataPayment, null, 1)}</pre> */}
			{/* <pre className="text-xs">{JSON.stringify(dataFiles, null, 1)}</pre> */}
			{/* <pre className="text-xs">{JSON.stringify(formFields, null, 1)}</pre> */}
		</>
	);
};

export default PagePayment;
