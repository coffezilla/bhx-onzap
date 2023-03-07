const venom = require('venom-bot');
const express = require('express');
const http = require('http');
const app = express();
// const post = process.env.PORT || 3001

const server = http.createServer(app);
const { body, validationResult } = require('express-validator');

app.listen(3001, function () {
	console.log('Example app listening on port 3001!');
});
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// middleware
app.use(express.static('public'));

const fs = require('fs');
// const venom = require('venom-bot');

const loggedOnes = [];

const loggedWa = [
	{
		sessionName: 'primeiro',
		client: null,
	},
];

const data = [
	[
		{
			id: 1,
			title: 'Olá',
			answerTo: 0,
			keyText: '',
		},
	],
	[
		{
			id: 4,
			title: 'Ligar para a empresa',
			answerTo: 1,
			keyText: '3',
		},
		{
			id: 3,
			title: 'Comprar produtos',
			answerTo: 1,
			keyText: '2',
		},
		{
			id: 2,
			title: 'Saber mais sobre a empresa',
			answerTo: 1,
			keyText: '1',
		},
	],
	[
		{
			id: 7,
			title: 'Papel de parede',
			answerTo: 3,
			keyText: '3',
		},
		{
			id: 6,
			title: 'Persiana',
			answerTo: 3,
			keyText: '2',
		},
		{
			id: 5,
			title: 'Cortina',
			answerTo: 3,
			keyText: '1',
		},
	],
	[
		{
			id: 8,
			title: 'Nossos papéis de parede são incríveis!',
			answerTo: 7,
			keyText: '1',
		},
		{
			id: 9,
			title: 'Nossas persianas são mara!',
			answerTo: 6,
			keyText: '1',
		},
		{
			id: 11,
			title: 'Cortina Tecido',
			answerTo: 5,
			keyText: '2',
		},
		{
			id: 10,
			title: 'Cortina blackout',
			answerTo: 5,
			keyText: '1',
		},
	],
	[
		{
			id: 12,
			title: 'Tecidos são ótimos!',
			answerTo: 11,
			keyText: '1',
		},
		{
			id: 13,
			title: 'A nossa blackout é de primeira!',
			answerTo: 10,
			keyText: '1',
		},
	],
];

// const express = require('express');
// const venom = require('venom-bot');
// const app = express();

let venomClient = null;
//
// const getLandingPageData = (id) => {
// 	let selected = [];
// 	data.forEach((landingPage, level) => {
// 		const findSelected = landingPage.filter((item) => item.id === id);
// 		if (findSelected.length > 0) {
// 			selected = findSelected;
// 		}
// 	});
// 	console.log('da', data);
// 	return selected[0];
// };

//
const getNextMessageChat = (first = true, currentId, option) => {
	let selected = [];
	if (!first) {
		data.forEach((landingPage, level) => {
			const findSelected = landingPage.filter(
				(item) => item.answerTo === currentId && item.keyText === option
			);
			if (findSelected.length > 0) {
				selected = findSelected;
			}
		});
	} else {
		selected = [
			{
				id: 1,
				title: 'Pergunta 1 - Escolha 1 ou 2',
				answerTo: 0,
				keyText: '',
			},
		];
	}

	// console.log('da', data);
	return selected[0];
};
//
app.get('/', (req, res) => {
	res.send('hello world');
});

// login wa
app.get('/check-login/:wa', (req, res) => {
	console.log('foo', loggedOnes);
	console.log('foo2', loggedWa);
	const currentWA = req.params.wa;

	const isAlreadyLogged = getCurrentItem(currentWA);
	console.log('Man', isAlreadyLogged);

	// console.log("sss", req.params.wa)
	if (isAlreadyLogged) {
		res.json({ status: 3, message: 'ok' });
	} else {
		//   venom
		res.json({ status: 0, message: 'not logged' });
	}
});

const currentWA = 'devrenato.js@gmail.com';

venom
	.create({
		session: currentWA, // name of session
		statusFind: (statusSession, session) => {
			console.log('Status Session: ', statusSession); //return isLogged || notLogged || browserClose || qrReadSuccess || qrReadFail || autocloseCalled || desconnectedMobile || deleteToken || chatsAvailable || deviceNotConnected || serverWssNotConnected || noOpenBrowser || initBrowser || openBrowser || connectBrowserWs || initWhatsapp || erroPageWhatsapp || successPageWhatsapp || waitForLogin || waitChat || successChat
			//Create session wss return "serverClose" case server for close
			console.log('Session name: ', session);
		},
		options: {
			headless: false,
		},
		catchQR: (base64Qr, asciiQR, attempts, urlCode) => {
			// console.log('Number of attempts to read the qrcode: ', attempts);
			// console.log('Terminal qrcode: ', asciiQR);
			// console.log('base64 image string qrcode: ', base64Qrimg);
			// console.log('urlCode (data-ref): ', urlCode);
			// console.log(asciiQR); // Optional to log the QR in the terminal
			var matches = base64Qr.match(/^data:([A-Za-z-+\\/]+);base64,(.+)$/),
				response = {};
			if (matches.length !== 3) {
				return new Error('Invalid input string');
			}
			response.type = matches[1];
			response.data = new Buffer.from(matches[2], 'base64');
			var imageBuffer = response;
			require('fs').writeFile(
				`./public/${currentWA}.png`,
				imageBuffer['data'],
				'binary',
				function (err) {
					if (err != null) {
						console.log(err);
					}
				}
			);
		},

		BrowserInstance: (browser, waPage) => {
			console.log('Browser PID:', browser.process().pid);
			waPage.screenshot({ path: 'screenshot.png' });
		},
		// useChrome: false,
		// logQR: false,
		statusFind: (statusSession, session) => {
			console.log('tudo', statusSession);
		},
		multidevice: true, // for version not multidevice use false.(default: true)
	})
	.then((client) => {
		// setClient(client);
		start(client);
		// checkUser(client);
		console.log('feito');
		loggedOnes.push(currentWA);
		client.onStateChange((state) => {
			console.log('changeddddd', state);
		});

		loggedWa.push({ sessionName: currentWA, client: client });
		fs.unlink(`./public/${currentWA}.png`, () => {
			console.log('deleted');
		});

		// res.json({ status: 1, message: 'foo' });
	})
	.catch((erro) => {
		console.log(erro);
		// res.json({ status: 2, message: 'error' });
	});

// login wa
app.get('/login/:wa', (req, res) => {
	console.log('foo', loggedOnes);
	console.log('foo2', loggedWa);

	// console.log("sss", req.params.wa)
	const currentWA = req.params.wa;

	const isAlreadyLogged = getCurrentItem(currentWA);
	console.log('Man', isAlreadyLogged);

	// console.log("sss", req.params.wa)
	if (isAlreadyLogged) {
		// if (loggedOnes.includes(currentWA)) {
		res.json({ status: 3, message: 'ok' });
	} else {
		venom
			.create({
				session: currentWA, // name of session
				catchQR: (base64Qr, asciiQR, attempts, urlCode) => {
					// console.log('Number of attempts to read the qrcode: ', attempts);
					// console.log('Terminal qrcode: ', asciiQR);
					// console.log('base64 image string qrcode: ', base64Qrimg);
					// console.log('urlCode (data-ref): ', urlCode);
					// console.log(asciiQR); // Optional to log the QR in the terminal
					var matches = base64Qr.match(/^data:([A-Za-z-+\\/]+);base64,(.+)$/),
						response = {};
					if (matches.length !== 3) {
						return new Error('Invalid input string');
					}
					response.type = matches[1];
					response.data = new Buffer.from(matches[2], 'base64');
					var imageBuffer = response;
					require('fs').writeFile(
						`./public/${currentWA}.png`,
						imageBuffer['data'],
						'binary',
						function (err) {
							if (err != null) {
								console.log(err);
							}
						}
					);
				},

				BrowserInstance: (browser, waPage) => {
					console.log('Browser PID:', browser.process().pid);
					waPage.screenshot({ path: 'screenshot.png' });
				},
				// useChrome: false,
				// logQR: false,
				statusFind: (statusSession, session) => {
					console.log('tudo', statusSession);
				},
				multidevice: true, // for version not multidevice use false.(default: true)
			})
			.then((client) => {
				// setClient(client);
				start(client);
				// checkUser(client);
				console.log('feito');
				loggedOnes.push(currentWA);
				client.onStateChange((state) => {
					console.log('changeddddd', state);
				});

				loggedWa.push({ sessionName: currentWA, client: client });
				fs.unlink(`./public/${currentWA}.png`, () => {
					console.log('deleted');
				});

				// res.json({ status: 1, message: 'foo' });
			})
			.catch((erro) => {
				console.log(erro);
				// res.json({ status: 2, message: 'error' });
			});
	}
});

// start wp
function start(client) {
	console.log('LOGADO');
	let phoneConnected = false;

	//
	app.get('/foo', (req, res) => {
		res.json({ name: 'foo', nickname: 'boo' });
	});

	// if (phoneConnected) {
	// 	// login wa
	// 	app.get('/logout/:wa', async (req, res) => {
	// 		// if (client) {

	// 		// } else {
	// 		// 	console.log('nao funciona');
	// 		// }
	// 		phoneConnected = false;

	// 		res.json({ status: 333, message: 'LOGADO' });
	// 	});
	// } else {
	app.get('/logout/:wa', async (req, res) => {
		// if (client) {

		// } else {
		// console.log('nao funciona', client);
		let test = await client.isConnected();
		console.log('antes', test);
		// await client.logout();

		test = await client.isConnected();
		console.log('depoijs', test);

		// Is connected
		// const test = await client.isConnected();
		// }
		// phoneConnected = true;
		res.json({ status: 123, message: test });
	});
	// }

	client.onMessage((message) => {
		if (message.body === 'Hi' && message.isGroupMsg === false) {
			client
				.sendText(message.from, 'oixxx')
				.then((result) => {
					console.log('Result: ', result); //return object success
				})
				.catch((erro) => {
					console.error('Error when sending: ', erro); //return object error
				});
		}
	});

	// client.onMessage((message) => {
	// 	if (message.body === 'Hum' && message.isGroupMsg === false) {
	// 		client
	// 			.sendText(message.from, 'Dois')
	// 			.then((result) => {
	// 				console.log('Result: ', result); //return object success
	// 			})
	// 			.catch((erro) => {
	// 				console.error('Error when sending: ', erro); //return object error
	// 			});
	// 	}
	// });

	// client.onStateChange((state) => {
	// 	console.log('changeddddd');
	// });

	// client.onAck((ack) => {
	// 	console.log('ac', ack);
	// });

	// client.onStateChange((state) => {
	// 	console.log('State changed: ', state);
	// 	// force whatsapp take over
	// 	if ('CONFLICT'.includes(state)) client.useHere();
	// 	// detect disconnect on whatsapp
	// 	if ('UNPAIRED'.includes(state)) console.log('logout');
	// 	// disconected
	// 	if ('DISCONNECTED'.includes(state)) client.close();
	// 	if ('SYNCING'.includes(state)) client.close();
	// 	// if ('OPENING'.includes(state)) {
	// 	//   // remove the token
	// 	//   token_path = `tokens/${session_name}.data.json`
	// 	//   console.log('unlinking ', token_path)
	// 	//   fs.unlink(`tokens/${session_name}.data.json`, (err => console.log(err)))
	// 	//   console.log('REOPENING');
	// 	//   // reinitiate venom
	// 	//   client.close();
	// 	//   init_venom(session_name, hook, handle_function);
	// 	//   //client.restartService();
	// 	// }
	// });

	// client.onAck((ack) => {
	// 	console.log('ac', ack);
	// });
}

function offlineWa() {
	app.get('/logout/:wa', (req, res) => {
		// res.send('hello world');

		res.json({ status: 0, message: 'EMPTY' });
	});
}

// function checkUser(client) {
// 	client.onStateChange((state) => {
// 		console.log('changeddddd');
// 	});

// 	// client.onAck((ack) => {
// 	// 	console.log('ac', ack);
// 	// });
// }

// function setClient(client) {
// 	venomClient = client;
// 	// console.log('client setted', client);
// 	// client.onStateChange((state) => {
// 	// 	console.log('changeddddd');
// 	// });

// 	// client.onAck((ack) => {
// 	// 	console.log('ac', ack);
// 	// });
// }

// get single item
const getCurrentItem = (sessionName) => {
	console.log('x');
	let selected = [];
	// loggedWa.forEach((sessionOpened) => {
	const findSelected = loggedWa.filter(
		(item) => item.sessionName === sessionName
	);
	// selected.push
	if (findSelected.length > 0) {
		selected = findSelected;
		// selected = { ...findSelected };
	}
	console.log('b');
	// });

	return selected[0];
};

// app.get('*', function (req, res) {
// 	res.send('what???', 404);
// });
