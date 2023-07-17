<script setup lang="ts">
const { fetchOne, item: category } = useCategories();

await fetchOne({ uuid: useRoute().params.uuid as string });

if (!category.value) {
  throw createError({ statusCode: 404, message: "Category not found" });
}
</script>

<template>
  <div v-if="category" class="mt-24 mb-20 max-w-7xl">
    <h1 class="mb-5 text-2xl">{{ category.name }}</h1>
    <ul class="grid grid-cols-4 gap-4 my-12">
      <li v-for="project in category?.projects" :key="project.uuid">
        <ProjectCard :project="project" :category-name="category.name" />
      </li>
    </ul>
  </div>
</template>
