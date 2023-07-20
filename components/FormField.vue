<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    label: string;
    name: string;
    modelValue: any;
    as?: string;
    hint?: string;
    id?: string;
    class?: string;
  }>(),
  {
    class: "input input-bordered",
  }
);
const emit = defineEmits<{
  (e: "update:modelValue", payload: typeof props.modelValue): void;
}>();

// handle custom v-model
const value = ref(props.modelValue);
watch(value, (val) => emit("update:modelValue", val));
watch(
  () => props.modelValue,
  (val) => (value.value = val)
);

const id = computed(() => props.id || props.name);
</script>

<script lang="ts">
export default {
  inheritAttrs: false,
};
</script>
<template>
  <div class="w-full max-w-full form-control">
    <label class="label" :for="id">
      <span class="label-text">
        <slot name="label">{{ label }}</slot>
      </span>
      <span class="label-text-alt">
        <slot name="label-text-alt"></slot>
        <span class="inline-block ml-2 text-error">
          <slot name="error-message">
            <ErrorMessage :name="name" class="text-error" />
          </slot>
        </span>
      </span>
    </label>

    <slot name="after-label"></slot>

    <slot name="input">
      <Field
        :id="id"
        v-model="value"
        :name="name"
        v-bind="$attrs"
        :as="as"
        class="w-full"
        :class="class"
      />
    </slot>

    <slot name="after-input"></slot>

    <label :for="id" class="label" v-if="hint">
      <span class="text-gray-400 label-text-alt">
        <slot name="hint">
          {{ hint }}
        </slot>
      </span>
    </label>
  </div>
</template>
