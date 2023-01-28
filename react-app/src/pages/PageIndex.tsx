/* eslint-disable */
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { Helmet } from 'react-helmet';

import { rdxLoginUser } from '../redux/ducks/User';

import { validateForm, IForm } from '../components/FormValidation';

import { serverLoginUser } from '../components/Auth';
import Footer from '../components/Footer/Footer';

const PageIndex = () => {
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
			serverLoginUser(formFields, 'CLIENT').then((responseServerLogin: any) => {
				if (responseServerLogin.data.status === 1) {
					dispatch(rdxLoginUser(responseServerLogin.data.role, responseServerLogin.data.email));
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
				<title>Área do cliente Login - BHX Sites</title>
				<meta
					name="description"
					content="Baixe boletos e imprima comprovantes de serviço na área do cliente BHX Sites"
				/>
			</Helmet>
			<div
				className="h-screen md:flex justify-between flex-col bg-container  bg-center bg-repeat-x"
				style={{ backgroundImage: `url("/bg-login.jpg")` }}
			>
				<div className="md:flex justify-center items-center basis-full">
					<div className="container mx-auto max-w-6xl my-2 px-2 md:px-5 3xl:px-0 md:flex justify-between">
						<div className="basis-1/2 px-5 ">
							<img
								src="/logo-full-2xl.png"
								alt="Logo BHX Sites"
								className="w-44 lg:w-auto block mx-auto lg:mx-0 my-3 mb-3 lg:mb-5"
							/>
							<h1 className="text-md lg:text-5xl font-bold lg:leading-[3.5rem] text-center  w-full lg:text-left lg:max-w-sm">
								Bem-vindo(a) a área do cliente BHX Sites
							</h1>
							<p className="w-full lg:max-w-sm my-5 text-gray-400 text-center lg:text-left ">
								Baixe boletos, acompanhe seu serviço e imprima comprovantes de pagamento. Rápido,
								prático e sem burocracia, como a vida deve ser.
							</p>
						</div>
						<div className="bg-white border md:max-w-[500px] w-full p-3 md:p-10  md:rounded-lg basis-1/2 ">
							<h1 className="text-lg font-bold  mb-5">FAÇA O LOGIN</h1>

							{!isLogging ? (
								<form onSubmit={handleSubmit}>
									<label htmlFor={formFields[0].name} className="block mb-3">
										<span className="block mb-1 font-bold text-xs md:text-md">E-mail:</span>
										<input
											type={formFields[0].type}
											name={formFields[0].name}
											id={formFields[0].name}
											placeholder="meu@email.com.br"
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
											placeholder="******"
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
									<p className="text-gray-600 text-sm">
										Caso esteja com problemas para acessar,
										<a
											href="http://www.bhxsites.com.br/contato"
											className="text-blue-400 hover:underline"
										>
											{' '}
											clique aqui
										</a>{' '}
										para solicitar suporte.
									</p>
								</form>
							) : (
								<p>logging...</p>
							)}
						</div>
					</div>
				</div>
				<Footer />
			</div>
		</>
	);
};

export default PageIndex;
