// note immune pilot brother good cube milk usage exist logic reform dinner

var aelf = new window.NightElf.AElf({
  // httpProvider: 'http://192.168.199.210:5000/chain',
  httpProvider: [
    // 'http://192.168.197.56:8101/chain',
    'http://34.213.112.35:8000'
  ],
  // httpProvider: 'http://192.168.197.70:8000/chain',
  appName: 'Test'
});

aelf.chain.getChainStatus((error, result) => {
  console.log('>>>>>>>>>>>>> getChainStatus >>>>>>>>>>>>>');
  console.log(error, result);
});

// aelf.chain.getChainStatus().then(result => {
//   console.log(result);
// });

var wallet = {
  address: 'AZsECHAzWgWpCoywTdv8mU8s75yicmkmhrJFWc5p6uJ19sb9m'
  // address withoud permission
  // address: '65dDNxzcd35jESiidFXN5JV8Z7pCwaFnepuYQToNefSgqk9'
};
// It is different from the wallet created by Aelf.wallet.getWalletByPrivateKey();
// There is only one value named address;
aelf.chain.contractAt(
  'WnV9Gv3gioSh3Vgaw8SSB96nV8fWUNxuVozCf6Y14e7RXyGaM',
  wallet
).then(result => {
  console.log(result);
}).catch(error => {
  console.log('error: ', error);
});

var tokenContract = {};

async function init() {
  tokenContract = await aelf.chain.contractAt(
    'WnV9Gv3gioSh3Vgaw8SSB96nV8fWUNxuVozCf6Y14e7RXyGaM',
    wallet
  );
}

init();

tokenContract.GetBalance.call({
// tokenContractInstanceTemp.GetBalance.call({
  symbol: 'ELF',
  owner: 'AZsECHAzWgWpCoywTdv8mU8s75yicmkmhrJFWc5p6uJ19sb9m'
}).then(result => {
  console.log('then: ', result);
}).catch(error => {
  console.log('error: ', error);
});
