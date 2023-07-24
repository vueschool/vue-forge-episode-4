export const useWallet = () => {
  function connect() {}
  function disconnect() {}
  return { connect, disconnect, account, balance, getBalance };
};
