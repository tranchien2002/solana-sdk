const { Account, Connection, PublicKey, SystemProgram, Transaction } = require('@solana/web3.js');
const bs58 = require('bs58');

const connection = new Connection('https://devnet.solana.com', 'recent');

const createAccount = () => {
  let keypair = new Account();
  let privateKey = bs58.encode(keypair.secretKey);
  return privateKey;
};

const getPublickey = privateKey => {
  try {
    const a = new Account(bs58.decode(privateKey));
    return a.publicKey.toString();
  } catch (_) {
    return undefined;
  }
};

const getAccount = async publicKey => {
  try {
    let pub = new PublicKey(publicKey);
    let info = await connection.getAccountInfo(pub);
    return info;
  } catch (_) {
    return undefined;
  }
};

const getBalance = async publicKey => {
  try {
    let pub = new PublicKey(publicKey);
    let balance = await connection.getBalance(pub);
    return balance;
  } catch (_) {
    return undefined;
  }
};

const transfer = async (privateKey, to, amount) => {
  const account = new Account(bs58.decode(privateKey));
  const tx = new Transaction().add(
    SystemProgram.transfer({
      fromPubkey: account.publicKey,
      toPubkey: to,
      lamports: amount
    })
  );
  let res = await connection.sendTransaction(tx, [account], {
    preflightCommitment: 'single'
  });
  return res;
};

// let a = decodeAccount(
//   '5mMrcq7KUqHrhnoCGKVnAB3khjkjoDM48LKJK7dKJdEYZy33dzk6yHi9pf6b2M7EUFRvqR63eABdNofMG2Xnae5o'
// );
// let pub = new PublicKey('3HN6hKHFC5w4W5mctBNjUQmTgCJFvqio5xU4bxrJqBe9');
// console.log(pub);
// console.log(bs58.decode('7Kg12WyEMymKFotMCdsWeXnC8hej6Bc8cFZwu4RB15BW'));

// getBalance('7Kg12WyEMymKFotMCdsWeXnC8hej6Bc8cFZwu4RB15BW').then(e => console.log(e));

// transfer(
//   '5mMrcq7KUqHrhnoCGKVnAB3khjkjoDM48LKJK7dKJdEYZy33dzk6yHi9pf6b2M7EUFRvqR63eABdNofMG2Xnae5o',
//   '7Kg12WyEMymKFotMCdsWeXnC8hej6Bc8cFZwu4RB15BW',
//   2 * 1e9
// ).then(e => console.log(e));
module.exports = {
  createAccount: createAccount,
  getPublickey: getPublickey,
  getAccount: getAccount,
  getBalance: getBalance,
  transfer: transfer
};
