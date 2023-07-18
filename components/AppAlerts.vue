<script setup lang="ts">
const { alerts, success, error, warning, info, dismiss } = useAlerts();
</script>
<template>
  <div
    class="fixed bottom-0 z-10 w-full p-2 right-2 sm:p-0 sm:w-auto sm:bottom-5"
  >
    <TransitionGroup name="list" tag="ul">
      <div
        v-for="alert in alerts"
        :key="alert.id"
        class="mb-4 border-t-[1px] shadow-sm alert !pr-0"
        :class="`border-t-${alert.type}`"
      >
        <div class="flex justify-between sm:w-80">
          <div class="flex items-center">
            <div class="mx-4">
              <div class="font-bold" v-if="alert.title">{{ alert.title }}</div>
              <div class="">{{ alert.message }}</div>
            </div>
          </div>
          <button
            v-if="alert.dismissiable"
            @click="dismiss(alert)"
            class="p-1 transition rounded hover:bg-white"
          >
            x
          </button>
        </div>
      </div>
    </TransitionGroup>
  </div>
</template>

<style scoped>
.list-move, /* apply transition to moving elements */
.list-enter-active,
.list-leave-active {
  transition: all 0.6s ease;
}

.list-enter-from {
  opacity: 0;
  transform: translateX(60px);
}

.list-leave-to {
  opacity: 0;
  transform: translateX(60px) translateY(-100%);
}

/* ensure leaving items are taken out of layout flow so that moving
   animations can be calculated correctly. */
.list-leave-active {
  position: absolute;
}
</style>
