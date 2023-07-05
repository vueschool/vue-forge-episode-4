<script setup lang="ts">
import { UuidT } from '~/types'

const route = useRoute()
const uuid = computed(() => route?.params.uuid as UuidT)
</script>

<template>
	<NavBar />
	<ProjectsDetails v-if="uuid" :uuid="uuid"/>
</template>
