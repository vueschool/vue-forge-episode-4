<script setup lang="ts">
type ProjectCardProps = {
	uuid?: string | null | undefined,
	title?: string,
	excerpt?: string,
	image?: string,
	category?: string,
	softCap?: string,
	hardCap?: string,
	backers?: number,
	funded?: number,
	pledged?: number
	finishesAt?: Date | string | number
}

const props = defineProps<ProjectCardProps>()
</script>


<template>
	<div class="card col-span-1 glass flex flex-col items-start justify-start space-y-4 shadow">
		<figure>
			<img :src="image" :alt="title" class="w-[500px]" />
		</figure>
		<div class="card-body">
			<h2 class="card-title capitalize min-h-12 flex items-start justify-start">
				<span>{{ title }}</span>
			</h2>
			<p class="h-36">
				{{ excerpt }}
			</p>

			<div class="flex items-center justify-between">
				<div class="badge badge-secondary badge-outline">
					<span>Backers: </span>
					{{ backers }}
				</div>
				
				<div class="badge badge-accent badge-outline">
					<span>Funded: </span>
					<Money :amount="funded" short />
				</div>
			</div>
			<div class="w-full">
				<progress class="progress progress-primary w-full" :value="pledged" max="100"></progress>
			</div>
	
			<div class="flex items-center justify-between">
				<div class="badge badge-primary badge-outline text-xs">{{ category }}</div>
				<span class="text-primary"><Money :amount="softCap" short/> / <Money :amount="hardCap" short/></span>
			</div>
	
			<div class="card-actions justify-between mt-8">
				<span class="text-sm text-primary">
					<Counter :date="finishesAt" />
				</span>
				<nuxt-link
					v-if="uuid"
					:to="{ name: 'projects-uuid', params: { uuid } }"
					class="btn btn-primary btn-sm"
				>
					More details!
				</nuxt-link>
				
				<span
					v-else
					class="btn btn-primary btn-sm"
				>
					More details!
				</span>
			</div>
		</div>
	</div>
</template>
