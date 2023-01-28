/* eslint-disable */
import { useHistory } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import Swal from 'sweetalert2';
import '../../SweetAlertCustom.scss';

import { clearLocalStorageAuth } from '../../helpers/handleStorage';
import { rdxLogoutUser, IRdxUser } from '../../redux/ducks/User';

const HeaderTop = () => {
	const dispatch = useDispatch();
	const history = useHistory();

	const rdxUserisAuth = useSelector((state: IRdxUser) => state.isAuth);
	const rdxUserEmail = useSelector((state: IRdxUser) => state.email);
	const logoutUser = () => {
		Swal.fire({
			title: 'Desconectar',
			text: 'Deseja deslogar da área do cliente?',
			allowEnterKey: false,
			confirmButtonText: `Confirmar`,
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
			if (result.isConfirmed) {
				clearLocalStorageAuth();
				dispatch(rdxLogoutUser());
				history.push('/');
			}
		});
	};

	return (
		<>
			{rdxUserisAuth && (
				<div className="bg-gray-600 py-2 px-5 w-full flex justify-between">
					<div>
						<img src="/logo-white.png" alt="Logo BHX Sites" />
					</div>
					<ul className="flex space-x-3 items-center">
						<li className="text-sm text-slate-300">{rdxUserEmail}</li>
						<li className="text-white">
							<button type="button" onClick={logoutUser}>
								Logout
							</button>
						</li>
					</ul>
				</div>
			)}
		</>
	);
};

export default HeaderTop;
