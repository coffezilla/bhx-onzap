/* eslint-disable operator-linebreak */
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { Helmet } from 'react-helmet';

import { rdxLoginUser } from '../redux/ducks/User';

import { validateForm, IForm } from '../components/FormValidation';

import { serverLoginUser } from '../components/Auth';

const PageLogin = () => {
	const history = useHistory();
	const [formFields, setFormFields] = useState<IForm['inputs']>([
		{
			name: 'email',
			value: '',
			error: '',
			type: 'email',
			isRequired: true,
		},
		{
			name: 'password',
			value: '',
			error: '',
			type: 'password',
			isRequired: true,
		},
	]);

	const dispatch = useDispatch();
	const [isLogging, setIsLogging] = useState<boolean>(false);

	const validationForm = () => {
		const inputRequired = validateForm(formFields, setFormFields);
		const hasNoErrors = inputRequired.hasPassed;

		return hasNoErrors;
	};

	const handleChange = (e: any) => {
		const isCheckBox = e.target.type === 'checkbox';
		let currentValue = e.target.value;

		// OPTIONAL: clean spaces
		if (e.target.name === 'password') {
			currentValue = currentValue.replace(/\s/g, '');
			currentValue = currentValue.toLowerCase();
		}

		setFormFields(
			formFields.map((field: any) => {
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

	const handleSubmit = (e: any) => {
		e.preventDefault();
		setIsLogging(true);
		const isValid = validationForm();

		if (isValid) {
			// use async function for server validation
			serverLoginUser(formFields, 'ADMIN').then((responseServerLogin: any) => {
				if (responseServerLogin.data.status === 1) {
					dispatch(
						rdxLoginUser(responseServerLogin.data.role, responseServerLogin.data.email, false),
					);
					if (responseServerLogin.data.role === 'ADMIN') {
						history.push('/hub');
					}
					if (responseServerLogin.data.role === 'CLIENT') {
						history.push('/dashboard');
					}
				} else {
					alert('Senha ou dado inválido');
				}
			});
		}
		setIsLogging(false);
	};

	return (
		<>
			<Helmet>
				<title>Administrador onPoint</title>
				<meta
					name="description"
					content="Baixe boletos e imprima comprovantes de serviço na área do cliente BHX Sites"
				/>
			</Helmet>
			<div className=" bg-slate-200 h-screen w-full flex justify-center items-center">
				<div className="bg-white border md:max-w-[500px] w-full h-full md:h-auto p-3 md:p-10  md:rounded-lg ">
					<h1 className="text-xl font-bold text-center mb-5">LOGIN ADMINISTRADOR</h1>

					{!isLogging ? (
						<form onSubmit={handleSubmit}>
							<label htmlFor={formFields[0].name} className="block mb-3">
								<span className="block mb-1 font-bold text-xs md:text-md">E-mail:</span>
								<input
									type={formFields[0].type}
									name={formFields[0].name}
									id={formFields[0].name}
									maxLength={formFields[0].maxLength}
									value={formFields[0].value}
									onChange={handleChange}
									className="border block px-3 py-2 w-full rounded-md"
								/>
								<span className="text-sm text-red-500 italic">{formFields[0].error}</span>
							</label>

							<label htmlFor={formFields[1].name} className="block mb-3">
								<span className="block mb-1 font-bold text-xs md:text-md">Senha:</span>
								<input
									type={formFields[1].type}
									name={formFields[1].name}
									id={formFields[1].name}
									maxLength={formFields[1].maxLength}
									value={formFields[1].value}
									onChange={handleChange}
									className="border block px-3 py-2 w-full rounded-md"
								/>
								<span className="text-sm text-red-500 italic">{formFields[1].error}</span>
							</label>

							<button
								type="submit"
								className="border block px-3 py-2 w-full rounded-md bg-blue-500 hover:bg-blue-600 text-white shadow mb-3"
							>
								Fazer login
							</button>
							<button
								type="button"
								onClick={() => history.push('/')}
								className="border block px-3 py-2 w-full rounded-md bg-white hover:bg-gray-50 text-gray-600 "
							>
								Cancelar
							</button>
						</form>
					) : (
						<p>logging...</p>
					)}
				</div>
			</div>
		</>
	);
};

export default PageLogin;
