/* eslint-disable */
/* eslint-disable react/jsx-one-expression-per-line */
import { useSelector } from 'react-redux';
import { useParams, Link, useHistory } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';

import Placeholder from '../components/Placeholder';
import HeaderTop from '../components/HeaderTop';
import HeaderTopSecondary from '../components/HeaderTopSecondary';
import { IRdxUser } from '../redux/ducks/User';

import { getPaymentData } from '../Api/paymentsHandle';
import { getPaymentClientData } from '../Api/paymentsClientHandle';
import Footer from '../components/Footer/Footer';

const PageReceipt = () => {
	const { rid } = useParams<any>();
	const history = useHistory();
	const [dataPayment, setDataPayment] = useState<any>(null);
	const rdxUserisRole = useSelector((state: IRdxUser) => state.role);

	const loadingDataPayment = async () => {
		if (rdxUserisRole === 'ADMIN') {
			await getPaymentData(rid).then((responseData: any) => {
				if (responseData.data.status === 1) {
					setDataPayment(responseData.data.payment);
				} else {
					history.push('/hub');
				}
			});
		} else {
			await getPaymentClientData(rid).then((responseData: any) => {
				if (responseData.data.status === 1) {
					setDataPayment(responseData.data.payment);
				} else {
					history.push('/hub');
				}
			});
		}
	};

	useEffect(() => {
		loadingDataPayment();
	}, []);

	if (dataPayment === null) {
		return <Placeholder />;
	}

	return (
		<>
			<Helmet>
				<title>Comprovante de pagamento - REF: CCC</title>
				<meta
					name="description"
					content="Baixe boletos e imprima comprovantes de serviço na área do cliente BHX Sites"
				/>
			</Helmet>
			<div className="min-h-screen flex justify-between flex-col">
				<div>
					<div className="print:hidden">
						<HeaderTop />
						{rdxUserisRole === 'ADMIN' && (
							<HeaderTopSecondary>
								<li className="text-sm">
									<Link to="/hub">
										<p className="text-blue-400 hover:underline inline-block">Hub onPoint</p>
									</Link>
								</li>
								<li className="text-xs text-gray-500">
									<i className="bi bi-chevron-right"></i>
								</li>
								<li className="text-sm">
									<Link to={`/client/${dataPayment.client_id}`}>
										<p className="text-blue-400 hover:underline inline-block">
											{dataPayment.client_name}
										</p>
									</Link>
								</li>
								<li className="text-xs text-gray-500">
									<i className="bi bi-chevron-right"></i>
								</li>
								<li className="text-sm">
									<Link to={`/payment/${rid}`}>
										<p className="text-blue-400 hover:underline inline-block">
											#{rid} {dataPayment.name}
										</p>
									</Link>
								</li>
								<li className="text-xs text-gray-500">
									<i className="bi bi-chevron-right"></i>
								</li>
								<li className="text-gray-400 text-sm">Comprovante de pagamento</li>
							</HeaderTopSecondary>
						)}

						{rdxUserisRole === 'CLIENT' && (
							<HeaderTopSecondary>
								<li className="text-sm">
									<Link to="/dashboard">
										<p className="text-blue-400 hover:underline inline-block">Dashboard</p>
									</Link>
								</li>
								<li className="text-xs text-gray-500">
									<i className="bi bi-chevron-right"></i>
								</li>

								<li className="text-gray-400 text-sm">Comprovante de pagamento</li>
							</HeaderTopSecondary>
						)}
					</div>

					<div className="container mx-auto my-2 md:my-5 px-2 md:px-5 3xl:px-0">
						<div className="container mx-auto my-2 md:my-5 px-2 md:px-5 3xl:px-0 print:hidden">
							<button
								className="bg-blue-50 hover:bg-blue-100 text-blue-400 py-1 px-3 rounded-md"
								type="button"
								onClick={() => window.print()}
							>
								Imprimir comprovante
							</button>
						</div>
						<div className="p-10 border">
							<h2 className="font-bold text-lg">Comprovante de pagamento</h2>
							<div className="my-3">
								<ul className="space-y-1 text-sm my-3">
									<li>
										<span className="font-bold">Documento Referência:</span> {dataPayment.ref}
									</li>
									<li>
										<span className="font-bold">Recebemos de:</span> {dataPayment.client_name},
										CNPJ: {dataPayment.cnpj}
									</li>
									<li>
										<span className="font-bold">Valor total pago:</span> R$ {dataPayment.price_paid}
									</li>
									<li>
										<span className="font-bold">Referente a prestação de serviço:</span>{' '}
										{dataPayment.service_description}
									</li>
									<li>
										<span className="font-bold">Data de vencimento:</span> {dataPayment.due_date}
									</li>
									<li>
										<span className="font-bold">Data de pagamento:</span> {dataPayment.payment_date}
									</li>
									<li>
										<span className="font-bold">Anotação:</span> {dataPayment.note}
									</li>
								</ul>
							</div>
							<p className="text-sm">
								Este é um comprovante de pagamento de serviços BHX Sites. Salve este comprovante por
								e-mail ou em papel impresso para manter-se organizado(a).
							</p>
							<p className="text-sm mt-3 font-bold">Data de emissão: {dataPayment.today}</p>
						</div>
						<div className="p-10 border mt-3">
							<div className="my-3">
								<img src="/logo-full.png" alt="Logo BHX Sites" className="mb-10" />
								<ul className="space-y-1 text-sm my-3">
									<li>
										<span className="font-bold">Prestadora de serviço:</span> BHX Sites
									</li>
									<li>
										<span className="font-bold">Website:</span> www.bhxsites.com.br
									</li>
									<li>
										<span className="font-bold">E-mail de contato:</span>{' '}
										atendimento@bhxsites.com.br
									</li>
									<li>
										<span className="font-bold">CNPJ:</span> 29.512.903/0001-33
									</li>
								</ul>
							</div>
						</div>
					</div>
				</div>
				<Footer />
			</div>

			{/*<pre className="text-xs">{JSON.stringify(dataPayment, null, 1)}</pre>*/}
		</>
	);
};

export default PageReceipt;
