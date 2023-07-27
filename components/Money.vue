<script setup lang="ts">
type MoneyProps = {
  amount?: string | number;
  currency?: string;
  decimals?: number;
  short?: boolean;
  sign?: string;
};

const props = withDefaults(defineProps<MoneyProps>(), {
  sign: "$KDA",
  currency: "other",
});

const localeOptions = computed(() => {
  const options = {
    minimumFractionDigits: props.decimals || 2,
  };

  if (props.currency !== "other") {
    options.style = "currency";
    options.currency = props.currency || "USD";
  }

  return options;
});

const locale = computed(() => "en-EN");
const sign = ref("");
const currencySign = ref(props.sign || null);
const amount = computed(() => {
  let amount = Number(props.amount || 0);

  if (props.short) {
    const a = amount / 100;
    currencySign.value = props.sign || "$";
    sign.value = amount > 1000 ? (amount > 1000000 ? "m" : "k") : "";
    return `${a.toFixed(0)}`;
  }

  return amount.toLocaleString(locale.value, localeOptions.value);
});
const unchangedAmount = computed(() => props.amount || 0);
const { asUsd, asKda } = useKdaUsd(unchangedAmount, "kda");
const convertedAmount = computed(() => {
  let amount = Number(asUsd.value || 0);

  if (props.short) {
    const a = amount / 100;
    sign.value = amount > 1000 ? (amount > 1000000 ? "m" : "k") : "";
    return `${a.toFixed(0)}`;
  }
  return amount.toLocaleString(locale.value, localeOptions.value);
});
</script>

<template>
  <span class="cursor-pointer group">
    <span
      v-if="currencySign"
      class="text-xs mr-0.5 group-hover:hidden inline transition-all duration-200 w-8"
    >
      {{ currencySign }}
    </span>
    <span class="inline transition-all duration-200 group-hover:hidden">
      {{ amount }}
    </span>
    <span
      class="text-xs mr-0.5 group-hover:inline hidden transition-all duration-200 w-8"
      >$USD</span
    >
    <span class="hidden transition-all duration-200 group-hover:inline">
      {{ convertedAmount }}
    </span>
  </span>
</template>
