<script setup lang="ts">
// Get categories for dropdown
const { list: categories, fetchAll } = useCategories();
fetchAll();
</script>

<template>
  <div>
    <!-- Code out the create project form here -->
    <h1>You'll create this form 🙂</h1>
  </div>
</template>
