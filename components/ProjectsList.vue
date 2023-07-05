<script setup lang="ts">
import Pagination from '~/components/Pagination.vue'
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
				class="card col-span-1 glass flex flex-col items-start justify-start space-y-4 shadow"
				v-for="project in projects" :key="project.uuid"
			>
				<figure>
					<img :src="project.image" alt="car!" />
				</figure>
				<div class="card-body">
					<h2 class="card-title capitalize min-h-12 flex items-start justify-start">
						<span>{{ project.title }}</span>
					</h2>
					<p class="min-h-72">{{ project.slurp }}</p>

					<div>
						<progress class="progress progress-primary w-56" :value="project.pledged" max="100"></progress>
					</div>

					<div>
						<div class="badge badge-primary badge-outline">primary</div>
						<div class="badge badge-secondary badge-outline">secondary</div>
					</div>

					<div class="card-actions justify-end mt-8">
						<nuxt-link
							:to="{ name: 'project-uuid', params: { uuid: project.uuid} }"
							class="btn btn-primary btn-sm"
						>
							More details!
						</nuxt-link>
					</div>
				</div>
			</li>
		</ul>

		<Pagination v-bind="pagination" @changed:page="(page) => fetchProjects({ page })" />
	</div>
</template>
