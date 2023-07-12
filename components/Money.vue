<script setup lang="ts">
type MoneyProps = {
	amount?: string | number
	currency?: string
	decimals?: number
	short?: boolean
}

const props = withDefaults(defineProps<MoneyProps>(), {
	currency: 'USD',
})
const localeOptions = computed(() => ({
	style: 'currency',
	currency: props.currency || 'USD',
	minimumFractionDigits: props.decimals || 2,
}))

const locale = computed(() => 'en-EN')
const sign = ref('')
const amount = computed(() => {
	let amount = Number(props.amount || 0 )
	
	if (props.short) {
		const a = (amount / 100)
		currencySign.value = '$'
		sign.value = amount > 1000 ? amount > 1000000 ? 'm' : 'k' : ''
		return `${a.toFixed(0)}`
	}
	
	return amount.toLocaleString(locale.value, localeOptions.value)
})
const currencySign = ref('')

</script>

<template>
	<span>
		<span class="text-sm">{{ currencySign }}</span>{{ amount }}<span class="text-sm">{{ sign }}</span>
	</span>
</template>
