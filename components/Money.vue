<script setup lang="ts">
type MoneyProps = {
	amount?: string | number
	currency?: string
	decimals?: number
}

const props = defineProps<MoneyProps>()
const localeOptions = computed(() => ({
	style: 'currency',
	currency: props.currency || 'USD',
	minimumFractionDigits: props.decimals || 2,
}))

const locale = computed(() => 'en-EN')

const amount = computed(() => Number(props.amount || 0 ).toLocaleString(locale.value, localeOptions.value))


</script>

<template>
	<span>
		{{ amount }}
		<span class="text-sm">{{ currency }}</span>
	</span>
</template>
