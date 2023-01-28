/* eslint-disable */
import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Helmet } from 'react-helmet';

import { IRdxUser } from '../redux/ducks/User';
import Placeholder from '../components/Placeholder';
import HeaderTop from '../components/HeaderTop/HeaderTop';
import HeaderTopSecondary from '../components/HeaderTopSecondary/HeaderTopSecondary';

//
import { getClients } from '../Api/clientsHandle';
import Footer from '../components/Footer/Footer';

interface IResClients {
	data: {
		clients?: any;
		message?: string;
		status: number;
	};
}

const PageHub = () => {
	const [isLoading, setIsLoading] = useState<boolean>(true);
	const [dataClients, setDataClients] = useState<any[]>([]);
	const rdxUserisRole = useSelector((state: IRdxUser) => state.role);

	const loadingData = () => {
		getClients().then((responseClients: IResClients) => {
			if (responseClients.data.status === 1) {
				setDataClients(responseClients.data.clients);
			} else {
			}
			setIsLoading(false);
		});
	};

	useEffect(() => {
		loadingData();
	}, []);

	if (rdxUserisRole === 'CLIENT') {
		return <p>Loading...</p>;
	}

	return (
		<>
			<Helmet>
				<title>Dashboard ADM - onPoint</title>
				<meta
					name="description"
					content="Baixe boletos e imprima comprovantes de serviço na área do cliente BHX Sites"
				/>
			</Helmet>
			<div className="min-h-screen flex justify-between flex-col">
				<div>
					<HeaderTop />
					<HeaderTopSecondary>
						<li className="text-gray-400 text-sm">Dashboard</li>
					</HeaderTopSecondary>

					<div className="xl:container mx-auto my-2 md:my-5 px-2 md:px-5 3xl:px-0">
						<div className="my-2 lg:my-3">
							<h2 className="font-bold text-md md:text-lg mb-1 md:mb-3 my-1 md:my-5">Clientes</h2>
						</div>

						{!isLoading ? (
							dataClients.length > 0 ? (
								<div className="my-2 md:my-5 overflow-x-auto">
									<table className="table-fixed sm:table-auto border-collapse border border-slate-400 w-full tr-even:bg-grey-100">
										<thead>
											<tr className="bg-gray-300">
												<th className="border border-gray-400 w-56 text-sm py-3 text-gray-500 text-left px-2">
													Clientes
												</th>
												<th className="border border-gray-400 w-40 text-sm py-3 text-gray-500 text-left px-2">
													Última cobrança
												</th>
												<th className="border border-gray-400 w-40 text-sm py-3 text-gray-500 text-left px-2">
													Próxima cobrança
												</th>
												<th className="border border-gray-400 w-40 text-sm py-3 text-gray-500 text-left px-2">
													Cobrança em aberto
												</th>
												<th className="border border-gray-400 w-40 text-sm py-3 text-gray-500 text-left px-2">
													Status do cliente
												</th>
											</tr>
										</thead>

										<tbody>
											{dataClients.map((res) => {
												return (
													<tr className="odd:bg-white even:bg-gray-100" key={res.id}>
														<td className="border border-gray-300 text-sm py-1 px-2 ">
															<Link to={`/client/${res.id}`}>
																<p className="text-blue-400 hover:underline inline-block">
																	#{res.id} {res.name}
																</p>
															</Link>
														</td>
														<td className="border border-gray-300 text-sm py-1 px-2">
															{res.last_charge}
														</td>
														<td className="border border-gray-300 text-sm py-1 px-2">
															{res.next_charge}
														</td>
														<td className="border border-gray-300 text-sm py-1 px-2">
															{res.status_number === 1
																? '-'
																: res.opened_charge.map((charge: any, index: number) => {
																		return <p key={charge + index}>{charge}</p>;
																  })}
														</td>
														<td
															className={`border border-gray-300 text-sm py-1 px-2  ${
																res.status_number === 1
																	? 'text-green-500'
																	: res.status_number === 2
																	? 'text-orange-300'
																	: 'text-red-500'
															}`}
														>
															{res.status_text}
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

			{/* <pre className="text-xs">{JSON.stringify(dataClients, null, 1)}</pre> */}
		</>
	);
};

export default PageHub;
