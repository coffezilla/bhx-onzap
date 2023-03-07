import { useState } from 'react';
import axios from 'axios';
import PixelABTest from './components/PixelABTest';

function App() {
	// test ab facebook landing page
	const [loaded, setLoaded] = useState(false);
	const [isQrCodeSyncing, setIsQrCodeSyncing] = useState(false); // syncinc image
	const [isQrCodeLoading, setIsQrCodeLoading] = useState(false); // getting data
	const [isQrCodeConnected, setIsQrCodeConnected] = useState(false); // data connected

	const handleWA = (number) => {
		console.log('Added whatsapp');
		setIsQrCodeLoading(true);
		setIsQrCodeSyncing(true);
		getData(number).then((response) => {
			console.log('get data wa', response);
		});
	};

	const getData = async (number) => {
		let response = { data: '' };
		await axios(`/login/${number}`).then((responseExp) => {
			response = { ...response, data: responseExp };

			if (
				Number(responseExp.data.status) === 3 ||
				Number(responseExp.data.status) === 1
			) {
				setIsQrCodeConnected(true);
			} else {
				setIsQrCodeConnected(false);
			}

			setIsQrCodeLoading(false);
			setIsQrCodeSyncing(false);
		});
		return response;
	};

	return (
		<div className='App'>
			<h3>W1</h3>
			<PixelABTest
				isQrCodeSyncing={isQrCodeSyncing}
				isQrCodeConnected={isQrCodeConnected}
				alias={'ww1'}
			/>
			{!isQrCodeConnected && isQrCodeLoading ? (
				<>
					<h2>Loading...</h2>
				</>
			) : (
				<>
					<button onClick={() => setIsQrCodeSyncing(true)}>Start watch</button>
					<button onClick={() => handleWA('ww1')}>Clicar 1: ww1</button>
					<button onClick={() => setIsQrCodeSyncing(false)}>Stop watch</button>
				</>
			)}

			{isQrCodeConnected ? <p>Test Connected</p> : <p>NOT connected</p>}
			{/* <img
        src="http://localhost:3001/out.png?v1"
        alt="qr code"
        style={{ border: "10px solid white" }}
      /> */}

			<h3>W2</h3>
			<button onClick={() => handleWA('ww3')}>Clicar 2: ww2</button>
		</div>
	);
}

export default App;
