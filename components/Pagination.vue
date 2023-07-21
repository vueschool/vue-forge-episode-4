<script setup lang="ts">
type PaginationProps = {
  page?: number;
  total?: number;
  limit?: number;
  pages?: number;
  isNextAvailable?: boolean;
  isPrevAvailable?: boolean;
  next?: number | null;
  prev?: number | null;
};

const props = withDefaults(defineProps<PaginationProps>(), {
  limit: 24,
  page: 1,
  next: null,
  prev: null,
  isNextAvailable: false,
  isPrevAvailable: false,
});

const emit = defineEmits<{
  (e: "changed:page", id: number): void;
}>();

const changePage = (page: number | null | undefined) => {
  if (page) {
    emit("changed:page", page);
  }
};
</script>

<template>
  <div
    class="fixed inset-x-0 flex items-center justify-center w-full bottom-10"
  >
    <div class="join">
      <button
        class="join-item btn"
        :disabled="!isPrevAvailable"
        @click="changePage(prev)"
      >
        «
      </button>
      <button class="join-item btn">Page {{ page }}</button>
      <button
        class="join-item btn"
        :disabled="!isNextAvailable"
        @click="changePage(next)"
      >
        »
      </button>
    </div>
  </div>
</template>
