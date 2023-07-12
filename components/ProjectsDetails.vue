<script setup lang="ts">
import { useProjects } from '~/composables/useProjects'
import uuid from '~/server/api/projects/[uuid]'
type ProjectProps = {
	uuid: string
}
const props = defineProps<ProjectProps>()

const { item: project, pagination, fetchOne } = useProjects()

const finishesAt = computed(() => {
	return new Date(project.finishesAt)
})

onMounted(() => {
	fetchOne({ uuid : props.uuid })
})

watch(() => props.uuid, (value) => {
	fetchOne({ uuid: value })
}, { deep: true })

</script>


<template>
	<div class="max-w-7xl mb-20 mx-auto">
		<div class="h-44 w-full py-12">
			<h3 class="text-3xl">
				{{ project.title }}
			</h3>
		</div>
		
		<div class="grid grid-cols-12">
		 <div class="col-span-8">
			 <img :src="project.image" alt="" class="w-full object-cover">
		 </div>
			<div class="col-span-4 h-full">
				<div class="flex flex-col items-center justify-start px-8 w-full space-y-4 h-full relative">
					<div class="w-full">
						<progress class="progress progress-primary w-full" :value="project.pledged" max="100"></progress>
					</div>
					<div class="flex flex-col items-start justify-start w-full">
						<span class="text-3xl text-primary">
							<Money :amount="project.funded" />
						</span>
						<span class="text-gray-500 text-sm"> pledged of <Money :amount="project.softCap" /> / <Money :amount="project.hardCap" />  </span>
					</div>
					
					<div class="flex flex-col items-start justify-start w-full">
						<span class="text-3xl text-primary">
							{{ project.backers }}
						</span>
						<span class="text-gray-500 text-sm uppercase">
							Backers
						</span>
					</div>
					
					<div class="flex flex-col items-start justify-start w-full">
						<span class="text-xl text-secondary">
							<Counter :date="project.finishesAt" />
						</span>
						<span class="text-gray-500 text-sm uppercase">
							Time to go
						</span>
					</div>
					
					<div class="flex flex-col items-center justify-center w-full space-y-4 absolute bottom-0 inset-x-0 px-8 text-center">
						<button class="btn btn-primary">
							Fund this Project
						</button>
						<span class="text-xs text-gray-400">
							All or nothing, this project will only be funded if it reaches at least the soft cap by
							<Date :date="project.finishesAt" />
						</span>
					</div>
				</div>
			</div>
		</div>
		<div class="grid grid-cols-12 my-12">
			<div class="col-span-8 whitespace-pre-wrap">
				{{ project.description }}
			</div>
			<div class="col-span-4">
			</div>
		</div>
	</div>
</template>
