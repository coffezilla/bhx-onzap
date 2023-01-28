/* eslint-disable */
import { useEffect, useState } from 'react';

const PixelABTest = ({ isQrCodeSyncing, isQrCodeConnected, alias }) => {
	const [loop, setLoop] = useState(null);
	const [image, setImage] = useState('');

	useEffect(() => {
		let tokenRandom = 0;

		if (isQrCodeSyncing) {
			setLoop(
				setInterval(function () {
					tokenRandom++;
					setImage(`http://localhost:3001/${alias}.png?token=${tokenRandom}`);
				}, 1000),
			);
		} else {
			console.log('false');
			clearInterval(loop);
		}
	}, [isQrCodeSyncing]);

	return (
		<div>
			{!isQrCodeConnected && isQrCodeSyncing ? (
				<p>
					<img src={image} alt="qr code" style={{ border: '10px solid white' }} />
				</p>
			) : (
				<p>Flase...</p>
			)}
		</div>
	);
};

export default PixelABTest;
