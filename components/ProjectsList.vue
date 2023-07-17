<script setup lang="ts">
import Pagination from "~/components/Pagination.vue";
import ProjectCard from "~/components/ProjectCard.vue";
import { useProjects } from "~/composables/useProjects";

const { pagination, fetchAll: fetchProjects, list: projects } = useProjects();
fetchProjects({ page: 1 });
</script>

<template>
  <div class="mb-20 max-w-7xl">
    <ul class="grid grid-cols-4 gap-4 my-12">
      <li v-for="project in projects" :key="project.uuid">
        <ProjectCard
          :project="project"
          :category-name="project.categories?.name"
        />
      </li>
    </ul>

    <Pagination
      v-bind="pagination"
      @changed:page="(page) => fetchProjects({ page })"
    />
  </div>
</template>
