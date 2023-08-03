<script setup lang="ts">
const { alerts, dismiss } = useAlerts();
</script>
<template>
  <div class="fixed bottom-0 z-10 w-full p-2 right-2 sm:p-0 sm:w-auto sm:bottom-5"  >
    <TransitionGroup name="list" tag="div">
    <div v-for="alert in alerts" :key="alert.id" :class="`alert alert-${alert.type} mb-4 border-t-[1px] shadow-sm w-max justify-between`">
      <AlertIcon :type="alert.type" />
      <div class="flex flex-col">
        <span class="font-bold" v-if="alert.title">{{ alert.title }}</span>
        <p>{{ alert.message }}</p>
      </div>
      <button class="btn btn-ghost" @click="dismiss(alert.id)" v-if="alert.dismissible">Dismiss</button>
    </div>
  </TransitionGroup>
  </div>
</template>
<style scoped>
.list-move,
.list-enter-active,
.list-leave-active {
  transition: all 0.5s ease;
}

.list-enter-from{
  opacity: 0;
  transform: translateX(60px);
}

.list-leave-to {
  opacity: 0;
  transform: translateX(60px) translateY(-100%);
}

.list-leave-active {
  position: absolute;
}
</style>

