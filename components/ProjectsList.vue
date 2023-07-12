<script setup lang="ts">
import Pagination from '~/components/Pagination.vue'
import ProjectCard from '~/components/ProjectCard.vue'
import { useProjects } from '~/composables/useProjects'

const { list: projects, pagination, fetchAll: fetchProjects } = useProjects()

onMounted( () => {
	setTimeout(() => {
		fetchProjects({ page: 1 })
	}, 1500)
})
</script>


<template>
	<div class="max-w-7xl mb-20">
		<ul class="grid grid-cols-4 gap-4 my-12">
			<li
				v-for="project in projects" :key="project.uuid"
			>
				<ProjectCard v-bind="project" :category="project.category.name" />
			</li>
		</ul>

		<Pagination v-bind="pagination" @changed:page="(page) => fetchProjects({ page })" />
	</div>
</template>
