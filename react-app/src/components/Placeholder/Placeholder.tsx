interface IProps {
	title?: string;
	className?: string;
}

const Placeholder = ({ title = 'Carregando...', className = '' }: IProps) => {
	return <p className={className}>{title}</p>;
};

export default Placeholder;
