<script setup lang="ts">
import { useProjects } from "~/composables/useProjects";
type ProjectProps = {
  uuid: string;
};
const props = defineProps<ProjectProps>();

const { item: project, fetchOne } = useProjects();
fetchOne({ uuid: props.uuid });

const showPledgeForm = ref(false);
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
          <div class="w-full">
            <progress
              class="w-full progress progress-primary"
              :value="project.pledged"
              :max="Number(project.hardCap)"
            ></progress>
          </div>
          <div class="flex flex-col items-start justify-start w-full">
            <span class="text-3xl text-primary">
              <Money :amount="project.pledged" />
            </span>
            <span class="text-sm text-gray-500">
              pledged of <Money :amount="project.softCap" /> /
              <Money :amount="project.hardCap" />
            </span>
          </div>

          <div class="flex flex-col items-start justify-start w-full">
            <span class="text-3xl text-primary">
              {{ project.backers }}
            </span>
            <span class="text-sm text-gray-500 uppercase"> Backers </span>
          </div>

          <div class="flex flex-col items-start justify-start w-full">
            <span class="text-xl text-secondary">
              <Counter :date="project.finishesAt" />
            </span>
            <span class="text-sm text-gray-500 uppercase"> Time to go </span>
          </div>

          <div
            class="inset-x-0 bottom-0 flex flex-col items-center justify-center w-full px-8 space-y-4 text-center"
          >
            <div v-if="!showPledgeForm" @click="showPledgeForm = true">
              <button class="btn btn-primary">Fund this Project</button>
              <br />
              <span class="text-xs text-gray-400">
                All or nothing, this project will only be funded if it reaches
                at least the soft cap by
                <Date :date="project.finishesAt" />
              </span>
            </div>
            <ProjectPledgeForm v-if="showPledgeForm" />
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
