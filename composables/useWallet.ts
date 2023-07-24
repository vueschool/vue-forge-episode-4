import { useFakeWallet } from "./useFakeWallet";

export const useWallet = () => {
  // when we're ready with the real wallet,
  // let's import it in here and return instead of fake wallet
  return useFakeWallet();
};
