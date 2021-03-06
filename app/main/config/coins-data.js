// https://www.atomicexplorer.com/#/faucet/coqui
const tokenconfig = require('./tokenconfig');

const data = [
  {
    coin: 'KMD',
    name: 'Komodo',
    txversion: 4,
    electrumServers: [
      {
        host: 'electrum1.cipig.net',
        port: 10001
      },
      {
        host: 'electrum2.cipig.net',
        port: 10001
      }
    ],
    active: 1
  },
  {
    coin: 'BTC',
    name: 'Bitcoin',
    electrumServers: [
      {
        host: 'electrum1.cipig.net',
        port: 10000
      },
      {
        host: 'electrum2.cipig.net',
        port: 10000
      }
    ],
    active: 1
  }
];

function generateElectrums(d) {
  const result = [];
  for (let i = 0; i < d.length; i += 1) {
    const record = d[i];
    for (let j = 0; j < record.electrumServers.length; j += 1) {
      const electrum = record.electrumServers[j];
      result.push({
        method: 'electrum',
        coin: record.coin,
        ipaddr: electrum.host,
        port: electrum.port
      });
    }
  }
  return result;
}

exports.generateElectrums = generateElectrums;

exports.default = function loadCoinsData(config) {
  const coinsdata = data.concat([tokenconfig]);

  return config.set('marketmaker', {
    data: coinsdata,
    electrums: generateElectrums(coinsdata),
    tokenconfig
  });
};
