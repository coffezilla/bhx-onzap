// Supports ES6
// import { create, Whatsapp } from 'venom-bot';
const venom = require('venom-bot');

venom
  .create({
    session: 'session-name', //name of session
    headless: false,
    multidevice: true // for version not multidevice use false.(default: true)
  })
  .then((client) => start(client))
  .catch((erro) => {
    console.log(erro);
  });

function start(client) {
  client.onMessage((message) => {
    if (message.body === 'hi' && message.isGroupMsg === false) {
      client
        .sendText(message.from, 'Welcome Venom 🕷')
        .then((result) => {
          console.log('Result: ', result); //return object success
        })
        .catch((erro) => {
          console.error('Error when sending: ', erro); //return object error
        });
    }
  });

client.onStateChange((state) => {
  console.log('State changed: ', state);
  // force whatsapp take over
  if ('CONFLICT'.includes(state)) client.useHere();
  // detect disconnect on whatsapp
  if ('UNPAIRED'.includes(state)) console.log('logout');
});


client.onStreamChange((state) => {
  console.log('State Connection Stream: ' + state);
  clearTimeout(time);
  if (state === 'DISCONNECTED' || state === 'SYNCING') {
    time = setTimeout(() => {
      console.log("playtime")
      client.close();
    }, 80000);
  }
});


// Catch ctrl+C
process.on('SIGINT', function() {
   console.log("XXlose")
  client.close();
});

// Try-catch close
try {
   console.log("try")
} catch (error) {
   console.log("close")
   client.close();
}


}