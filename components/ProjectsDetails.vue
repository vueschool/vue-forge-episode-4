<script setup lang="ts">
import { NodeJS } from 'timers'
import { useProjects } from "~/composables/useProjects";
type ProjectProps = {
  uuid: string;
};
type TBlockchainStatus = {
	status: {
		int: number;
	}
	startDate: {
		time?: Date
	},
	endDate: {
		time?: Date
	}
	'project-owner'?: string
	projectId?: string
	hardCap: number
	softCap: number
	raised: number
};

const props = defineProps<ProjectProps>();
const blockchainStatus = ref<TBlockchainStatus>({
	'project-owner': undefined,
	projectId: undefined,
	status: {
		int: 0
	},
	startDate: {
		time: undefined
	},
	endDate: {
		time: undefined
	},
	hardCap: 0,
	softCap: 0,
	raised: 0,
})
const { item: project, fetchOne } = useProjects();

await useAsyncData("fetch-project", () => fetchOne({ uuid: props.uuid }));
const { getProjectStatus, getProjectAccount, cancel } = await usePact()

const status = computed(() => {
	const states = {
		0: "CREATED",
		1: "CANCELLED",
		2: "SUCCEEDED",
		3: "FAILED",
		4: "PENDING",
		5: "ACTIVE"
	}
	
	if (project.status === 'pending') return states[4]
	
	if (blockchainStatus.value.startDate.time && new Date(blockchainStatus.value.startDate.time).valueOf() < Date.now()) {
		return states[5]
	}
	
	return states[blockchainStatus.value?.status?.int || 0]
})
const { account } = useWallet()
const isProjectOwner = computed(() => {
	return blockchainStatus.value?.['project-owner'] === account.value
})

const showOwnerActions = computed(() => false)

const getBlockchainProjectStatus = async () => {
	if (project.value.projectId) {
		const { result } = await getProjectStatus(project.value.projectId)
		if (result?.data) {
			blockchainStatus.value = result.data
		}
	}
}
const showPledgeForm = ref(false);
const softCap = computed(() => blockchainStatus.value.softCap?.decimal || 0)
const hardCap = computed(() => blockchainStatus.value.hardCap?.decimal || 0)
const raised = computed(() => blockchainStatus.value.raised || 0)
let interval: NodeJS.Timeout | string | number | undefined
const updateBlockchainProjectStatus = () => {
	getBlockchainProjectStatus()
	interval = setInterval(() => {
		getBlockchainProjectStatus()
	}, 6000)
}

const onFunded = () => {
	showPledgeForm.value = false
	setTimeout(() => {
		getBlockchainProjectStatus()
	}, 5000)
	
}

const onBeforeCancel = () => {
	// todo: alert
	
	cancel(props.uuid)
}

onMounted(() => {
	updateBlockchainProjectStatus()
})

onBeforeUnmount(() => {
	clearInterval(interval)
})

</script>

<template>
  <div class="mx-auto mb-20 max-w-7xl">
    <div class="w-full py-12 h-44">
      <h3 class="text-3xl">
        {{ project.title }}
      </h3>
    </div>

    <div class="grid grid-cols-12">
      <div class="col-span-8">
        <img
          :src="project.image"
          alt=""
          class="object-cover w-full aspect-video"
        />
      </div>
      <div class="h-full col-span-4">
        <div
          class="relative flex flex-col items-center justify-start w-full h-full px-8 space-y-4"
        >
	        <div v-if="isProjectOwner && showOwnerActions" class="w-full flex flex-col items-center justify-between space-y-4">
		        <div class="w-full">
			        <button class="btn w-full btn-error">Cancel Project</button>
		        </div>
		        <div class="w-full flex items-center justify-between space-x-4">
			        <button class="btn btn-primary flex-1">Succeed Project</button>
			        <button class="btn btn-warning flex-1">Fail Project</button>
		        </div>
	        </div>
	        <div class="w-full">
            <progress
              class="w-full progress progress-primary"
              :value="raised"
              :max="hardCap"
            ></progress>
          </div>
          <div class="flex flex-col items-start justify-start w-full">
            <span class="text-3xl text-primary">
              <ClientOnly>
                <Money :amount="raised" />
              </ClientOnly>
            </span>
            <span class="text-sm text-gray-500">
              pledged of
              <ClientOnly>
                <Money :amount="softCap" />
              </ClientOnly>
              /
              <ClientOnly>
                <Money :amount="hardCap" />
              </ClientOnly>
            </span>
          </div>

<!--          <div class="flex flex-col items-start justify-start w-full">-->
<!--            <span class="text-3xl text-primary">-->
<!--              {{ project.backers }}-->
<!--            </span>-->
<!--            <span class="text-sm text-gray-500 uppercase"> Backers </span>-->
<!--          </div>-->

          <div class="flex flex-col items-start justify-start w-full">
            <span class="text-xl text-secondary">
              <ClientOnly>
                <TimeAgo :date="blockchainStatus?.startDate?.time" />
              </ClientOnly>
            </span>
            <span v-if="blockchainStatus?.startDate?.time < new Date()" class="text-sm text-gray-500 uppercase"> Starts in </span>
            <span v-else class="text-sm text-gray-500 uppercase"> Started </span>
          </div>
	        <div class="flex flex-col items-start justify-start w-full">
            <span class="text-xl text-secondary">
              <ClientOnly>
                <TimeAgo :date="blockchainStatus?.endDate?.time" />
              </ClientOnly>
            </span>
            <span class="text-sm text-gray-500 uppercase"> Time to go </span>
          </div>
	        <div class="w-full">
            <span
	            class="text-xl text-warning uppercase"
	            v-if="status === 'PENDING'"
            >
	            This Project is still in "PENDING" state, please check back later.
            </span>
	        </div>
          <div
            class="inset-x-0 bottom-0 flex flex-col items-center justify-center w-full px-8 space-y-4 text-center"
          >
            <div v-if="!showPledgeForm">
              <button :disabled="status !== 'ACTIVE'"  @click="showPledgeForm = true" class="btn btn-primary">Fund this Project</button>
              <br />
              <span class="text-xs text-gray-400">
                All or nothing, this project will only be funded if it reaches
                at least the soft cap by
                <ClientOnly>
                  <Date :date="project.finishesAt" />
                </ClientOnly>
              </span>
            </div>
            <ProjectPledgeForm :projectId="project.projectId" v-if="showPledgeForm" />
          </div>
        </div>
      </div>
    </div>
    <div class="grid grid-cols-12 my-12">
      <div class="col-span-8 whitespace-pre-wrap">
        {{ project.description }}
      </div>
      <div class="col-span-4"></div>
    </div>
  </div>
</template>


<style>
.slide-fade {
			transition: all 0.3s ease;
		
}
.slide-fade-enter-active {
			transition: all 0.3s ease;
}
.slide-fade-enter-from {
			opacity: 0;
			transform: translateX(-10px);
}
.slide-fade-enter-to {
			opacity: 1;
			transform: translateX(0);
}
.slide-fade-leave-active {
			transition: all 0.3s ease;
}
.slide-fade-leave-from {
			opacity: 1;
			transform: translateX(0);
}
.slide-fade-leave-to {
			opacity: 0;
			transform: translateX(10px);
}

</style>
