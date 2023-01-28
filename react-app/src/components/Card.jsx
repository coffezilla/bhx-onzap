/* eslint-disable */
import { useEffect } from 'react';
// https://lo-victoria.com/making-draggable-components-in-react

const Card = ({ className = '', item, handleClick, options }) => {
	useEffect(() => {
		console.log('done', options);
	});

	return (
		<div
			className={`border z-10 relative border-gray-300 p-3 bg-white ${className}`}
			id={`test-${item.id}`}
		>
			<h3>{item.id}Test AB</h3>
			<p>Landing Page {item.title}</p>
			{options && (
				<ul>
					{options.map((answer) => {
						return <li>{answer.id}</li>;
					})}
				</ul>
			)}
			<ul className="p-2 border">
				<li>
					<button className="border" onClick={() => handleClick(item.id)}>
						Change red Text
					</button>
				</li>
				<li>
					<button className="border">Change blue Text</button>
				</li>
			</ul>
		</div>
	);
};

export default Card;