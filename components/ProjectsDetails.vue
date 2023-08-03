<script setup lang="ts">
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
const { getProjectStatus, fail, succeed, cancel } = await usePact()

const status = computed(() => {
	const states = {
		0: "CREATED",
		1: "CANCELLED",
		2: "SUCCEEDED",
		3: "FAILED",
		4: "PENDING",
		5: "ACTIVE"
	}
	
	if (blockchainStatus.value?.status?.int === 1) return states[1]
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

const showOwnerActions = computed(() => true)

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

const onBeforeCancel = async () => {
	// todo: alert
	await cancel(blockchainStatus.value?.projectId)
	setTimeout(() => {
		getBlockchainProjectStatus()
	}, 5000)
}


const onBeforeSucceed = async () => {
	// todo: alert
	await succeed(blockchainStatus.value?.projectId)
	setTimeout(() => {
		getBlockchainProjectStatus()
	}, 5000)
}
const onBeforeFail = async () => {
	// todo: alert
	await fail(blockchainStatus.value?.projectId)
	setTimeout(() => {
		getBlockchainProjectStatus()
	}, 5000)
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
	  <Transition
		  appear
		  enter-active-class="transition ease-out duration-300"
		  enter-from-class="opacity-0"
		  enter-to-class="opacity-100"
		  leave-active-class="transition ease-in duration-300"
		  leave-from-class="opacity-100"
		  leave-to-class="opacity-0"
	  >
	  <div v-if="status === 'CANCELLED'" class="bg-white/30 backdrop-blur absolute inset-0 flex items-center">
		  <div class="translate-x-96 border-8 rounded-xl w-96 h-40 flex items-center justify-center border-red-500 bg-red-white/50 backdrop-blur -rotate-45">
			  <div class="text-4xl text-red-500 uppercase">Cancelled</div>
		  </div>
	  </div>
	  </Transition>
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
      
	    <div  class="h-full col-span-4">
        <div
          class="relative flex flex-col items-center justify-start w-full h-full px-8 space-y-4"
        >
	        <div v-if="isProjectOwner && showOwnerActions" class="w-full flex flex-col items-center justify-between space-y-4">
		        <div class="w-full">
			        <button :disabled="status !== 'CREATED'" @click="onBeforeCancel" class="btn w-full btn-error">Cancel Project</button>
		        </div>
		        <div class="w-full flex items-center justify-between space-x-4">
			        <button :disabled="status !== 'ACTIVE'"  @click="onBeforeSucceed" class="btn btn-primary flex-1">Succeed Project</button>
			        <button :disabled="status !== 'ACTIVE'" @click="onBeforeFail" class="btn btn-warning flex-1">Fail Project</button>
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
