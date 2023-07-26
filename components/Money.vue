<script setup lang="ts">
type MoneyProps = {
  amount?: string | number;
  currency?: string;
  decimals?: number;
  short?: boolean;
  sign?: string;
};

const props = withDefaults(defineProps<MoneyProps>(), {
  currency: "USD",
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
const currencySign = ref(props.sign || "$");
</script>

<template>
  <span>
    <span class="text-sm mr-0.5">{{ currencySign }}</span
    >{{ amount }}<span class="text-sm">{{ sign }}</span>
  </span>
</template>
