import { PactNumber } from "@kadena/pactjs";

export const useKdaUsd = (
  usdOrKda: number | string | Ref<number | string>,
  currency = "kda"
) => {
  const currentRate = useState<number | undefined>("kda-usd-rate");
  const rateError = useState("kda-usd-rate-error");
  const rateLoading = useState("kda-usd-rate-loading");
  const value = ref(usdOrKda);

  /**
   * Fetch rate from coingecko
   */
  async function refreshRate() {
    rateLoading.value = true;
    rateError.value = false;
    currentRate.value = undefined;

    try {
      const data = await $fetch<any>(
        "https://api.coingecko.com/api/v3/coins/kadena?tickers=true"
      );
      const rate = data?.market_data?.current_price?.usd;
      if (rate) {
        currentRate.value = rate;
      } else {
        rateError.value = new Error("No rate found");
      }
    } catch (error) {
      rateError.value = error;
    } finally {
      rateLoading.value = false;
    }
  }

  const asKda = computed(() => {
    if (currency === "kda") return value.value;
    return usdToKda(value.value);
  });

  const asUsd = computed(() => {
    if (currency === "usd") return value.value;
    return kdaToUsd(value.value);
  });

  /**
   * Convert USD to KDA
   */
  function usdToKda(usd: number | string) {
    if (currentRate.value) {
      return new PactNumber(usd).dividedBy(currentRate.value);
    }
    return null;
  }

  /**
   * Convert KDA to USD
   */
  function kdaToUsd(kda: number | string) {
    if (currentRate.value) {
      return new PactNumber(kda).multipliedBy(currentRate.value);
    }
    return null;
  }

  /**
   * If the rate not in memory, fetch it from coingecko
   */
  async function initRate() {
    if (currentRate.value || rateLoading.value) return;
    await refreshRate();
  }
  initRate();

  return {
    asKda,
    asUsd,
  };
};
