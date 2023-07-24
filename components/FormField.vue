<script setup lang="ts">
const props = defineProps<{
  label: string;
  name: string;
  modelValue: any;
  as?: string;
  hint?: string;
  id?: string;
  class?: string;
}>();

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

// handle input attributes
const id = computed(() => props.id || props.name);
const classes = computed(() => {
  if (props.class) return props.class;
  if (props.as === "select") return "select select-bordered";
  if (props.as === "textarea") return "textarea textarea-bordered h-64";
  return "input input-bordered";
});
const $attrs = useAttrs();
const fieldAttrs = computed(() => {
  return {
    id: props.id,
    name: props.name,
    ...$attrs,
    class: `w-full ${classes.value}`,
  };
});
</script>

<script lang="ts">
export default {
  inheritAttrs: false,
};
</script>
<template>
  <div class="w-full max-w-full mb-4 form-control">
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

    <Field
      v-if="as !== 'select'"
      :as="as"
      v-bind="fieldAttrs"
      v-model="value"
    ></Field>

    <Field v-if="as === 'select'" :as="as" v-bind="fieldAttrs" v-model="value">
      <slot></slot>
    </Field>

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
