/* eslint-disable */
/* eslint-disable react/jsx-one-expression-per-line */
import { Link, useHistory } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';

import Card from '../components/Card';
import Xarrow from 'react-xarrows';

import { getHasLocalStorageAuth } from '../helpers/handleStorage';
import Placeholder from '../components/Placeholder';
import HeaderTop from '../components/HeaderTop/HeaderTop';
import HeaderTopSecondary from '../components/HeaderTopSecondary/HeaderTopSecondary';

import { END_POINT_BASE } from '../Api/Api';

interface IResPayments {
	data: {
		botMap?: any;
		message?: string;
		status: number;
	};
}

// import { getPayments } from '../Api/paymentsClientHandle';
import { getClientBotMap } from '../Api/botMapHandle';
// import { getClientData } from '../Api/clientsClientHandle';
import Footer from '../components/Footer/Footer';

const PageClientHub = () => {
	const [isLoading, setIsLoading] = useState<boolean>(true);
	const [dataBotMap, setDataBotMap] = useState<any[] | null>(null);
	// const [dataClient, setDataClient] = useState<any>(null);
	const [fileToken, setFileToken] = useState<any>();

	// const loadingDataClient = async () => {
	// 	await getClientData().then((responseData: any) => {
	// 		if (responseData.data.status === 1) {
	// 			setDataClient(responseData.data.client);
	// 		} else {
	// 		}
	// 	});
	// };

	// bot map
	const loadingDataBotMap = async () => {
		setDataBotMap(null);
		await getClientBotMap().then((responseBotMap: IResPayments) => {
			if (responseBotMap.data.status === 1) {
				setDataBotMap(responseBotMap.data.botMap);
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

	//
	const handleClick = (id: number) => {
		const myLp = getLandingPageData(id);
		console.log('clicked', myLp);
	};

	//
	const getLandingPageOptions = (id: number) => {
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

	//
	const getLandingPageData = (id: number) => {
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
					<HeaderTop />
					<HeaderTopSecondary>
						<li className="text-sm ">
							<p className=" inline-block  text-gray-400">Dashboard</p>
						</li>
					</HeaderTopSecondary>

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

						<pre>{JSON.stringify(dataBotMap, null, 1)}</pre>
						<div className="border">
							{dataBotMap &&
								dataBotMap.map((section: any, index: any) => {
									return (
										<div
											className="border border-gray-300 flex justify-center space-x-4 py-10"
											key={index}
										>
											{section.map((item: any) => {
												return (
													<>
														<Card
															item={item}
															key={item.id}
															handleClick={handleClick}
															options={getLandingPageOptions(item.id)}
														/>
														{item.answerTo !== 0 && (
															<Xarrow
																end={`test-${item.id}`}
																start={`test-${item.answerTo}`}
																zIndex={0}
																startAnchor="bottom"
																endAnchor="top"
																strokeWidth={2}
															/>
														)}
													</>
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
