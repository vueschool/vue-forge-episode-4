<script setup lang="ts">
import Pagination from "~/components/Pagination.vue";
import ProjectCard from "~/components/ProjectCard.vue";
import { useProjects } from "~/composables/useProjects";

const { pagination, fetchAll: fetchProjects, list } = useProjects();
const { data: projects } = await useAsyncData(
  "fetch-projects-list",
  async () => {
    await fetchProjects({ page: 1 });
    return list.value;
  }
);
</script>

<template>
  <div class="mb-20 max-w-7xl">
    <ul class="grid grid-cols-4 gap-4 my-12">
      <li v-for="project in projects" :key="project.uuid">
        <ProjectCard
          :project="project"
          :category-name="project.category?.name"
        />
      </li>
    </ul>

    <Pagination
      v-bind="pagination"
      @changed:page="(page) => fetchProjects({ page })"
    />
  </div>
</template>
