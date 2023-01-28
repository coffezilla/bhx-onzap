/* eslint-disable */
interface IProps {
	className?: string;
}

const Footer = ({ className = '' }: IProps) => {
	return (
		<div className={`print:hidden basis-50 pt-14 pb-5 ${className}`}>
			<ul className="text-center text-[12px] text-gray-500">
				<li>
					Sistema onPoint: Área do cliente - Desenvolvido por{' '}
					<a
						href="https://www.bhxsites.com.br"
						className="text-blue-400 hover:underline"
						target="_blank"
					>
						BHX Sites
					</a>{' '}
				</li>
				<li>
					<a
						href="https://www.bhxsites.com.br/suporte-bhxsites"
						className="text-blue-400 hover:underline"
						target="_blank"
					>
						Suporte sistemas
					</a>{' '}
					-{' '}
					<a
						href="https://www.bhxsites.com.br/contato"
						className="text-blue-400 hover:underline"
						target="_blank"
					>
						Atendimento suporte
					</a>
				</li>
			</ul>
		</div>
	);
};

export default Footer;
