<script setup lang="ts">
import { UuidT } from '~/types'

const route = useRoute()
const uuid = computed(() => route?.params.uuid as UuidT)
</script>

<template>
	<div class="flex-col flex items-center justify-start relative">
		<NavBar />
		<ProjectsDetails class="mt-24" v-if="uuid" :uuid="uuid"/>
	</div>
</template>
