<script setup lang="ts">
type MoneyProps = {
  amount?: string | number;
  currency?: string;
  decimals?: number;
  short?: boolean;
  sign?: boolean | string;
};

const props = withDefaults(defineProps<MoneyProps>(), {
	sign: "$KDA",
	currency: "other"
});

const localeOptions = computed(() => {
	const options = {
		minimumFractionDigits: props.decimals || 2,
	}
	
	if (props.currency !== 'other') {
		options.style = "currency"
		options.currency = props.currency || "USD"
	}
	
	return options
});

const locale = computed(() => "en-EN");
const sign = ref("");
const currencySign = ref(props.sign || null);
const amount = computed(() => {
	let amount = Number(props.amount || 0);
	
	if (props.short) {
		const a = amount / 100;
		currencySign.value = props.sign || "$USD";
		sign.value = amount > 1000 ? (amount > 1000000 ? "m" : "k") : "";
		return `${a.toFixed(0)}`;
	}
	
	return amount.toFixed(2).toLocaleString(locale.value, localeOptions.value);
});
const { asUsd } = useKdaUsd(`${props.amount}`, "kda")
const convertedAmount = computed(() => {
	let amount = Number(asUsd.value || 0);
	
	if (props.short) {
		const a = amount / 100;
		sign.value = amount > 1000 ? (amount > 1000000 ? "m" : "k") : "";
		return `${a.toFixed(0)}`;
	}
	return amount.toFixed(2).toLocaleString(locale.value, localeOptions.value);
})
</script>

<template>
  <span class="group cursor-pointer">
    <span v-if="currencySign" class="text-xs mr-0.5 group-hover:hidden inline transition-all duration-200">
	    {{ currencySign }}
    </span>
	  <span class="group-hover:hidden inline transition-all duration-200">
		  {{ amount }}
	  </span>
	  <span class="text-xs mr-0.5 group-hover:inline hidden transition-all duration-200">$USD</span>
	  <span class="group-hover:inline hidden transition-all duration-200">
		  {{ convertedAmount }}
	  </span>
	  <span v-if="short">
		  {{ sign }}
	  </span>
  </span>
</template>
