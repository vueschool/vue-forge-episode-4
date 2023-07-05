<script setup lang="ts">
import { useTimeAgo } from '@vueuse/core'

type CounterProps = {
	date?: string
}
const props = defineProps<CounterProps>()

const date = computed(() => new Date(props.date))
const ago = useTimeAgo(date)
</script>

<template>
	<div class="flex gap-5">
		{{ ago }}
	</div>
</template>
