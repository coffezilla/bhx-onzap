interface IProps {
	children?: any;
}

const HeaderTopSecondary = ({ children }: IProps) => {
	return (
		<div className="bg-gray-200 py-2 px-5 w-full flex justify-between">
			<ul className="flex space-x-3 items-center">{children}</ul>
		</div>
	);
};

export default HeaderTopSecondary;
