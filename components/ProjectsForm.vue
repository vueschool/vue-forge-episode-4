<script setup lang="ts">
import { watchDebounced } from "@vueuse/core";
import { useFilePreview } from "~/composables/useFilePreview";
import { CategoryT, UuidT } from "~/types";
import { toTypedSchema } from "@vee-validate/zod";
import * as zod from "zod";

// Validation
const validationSchema = toTypedSchema(
  zod.object({
    title: zod
      .string()
      .nonempty("Title is required")
      .min(10, { message: "Title must be at least 10 characters long" }),
    description: zod.string().nonempty("Description is required"),
    categoryUuid: zod.string().nonempty("Category is required"),
    softCap: zod
      .number()
      .min(10000, { message: "Too low" })
      .max(100000, { message: "Too high" }),
    hardCap: zod
      .number()
      .min(10000, { message: "Too low" })
      .max(100000, { message: "Too high" }),
    startDate: zod.date().min(new Date()),
    endDate: zod.date().min(new Date(new Date().getMonth() + 6)),
  })
);

type ProjectProps = {
  uuid?: UuidT | null | undefined;
};
const props = defineProps<ProjectProps>();

const { create } = useProjects();

const { list: categories, fetchAll } = useCategories();
fetchAll();

const form = reactive({
  title: "",
  description: "",
  image: "",
  categoryUuid: "",
  softCap: 10_000,
  hardCap: 25_000,
  finishesAt: new Date().toString(),
  startsAt: new Date().toString(),
});

const softCap = computed(() => {
  return parseInt(`${form.softCap}`);
});
const hardCap = computed(() => {
  return parseInt(`${form.hardCap}`);
});

watchDebounced(
  [softCap, hardCap],
  ([soft, hard]) => {
    if (soft > hard) {
      form.hardCap = hard !== 10000 ? soft + 10000 : soft;
    }
  },
  { debounce: 500, maxWait: 1000 }
);

const fileInput = ref(null);

const category = computed(() => {
  return categories.value.find(
    (category) => category.uuid === form.categoryUuid
  );
});

const pledged = computed(() => {
  return Math.floor(Math.random() * 100);
});

const backers = computed(() => {
  return Math.floor(Math.random() * 1000);
});

const funded = computed(() => {
  return Math.floor(Math.random() * 10000);
});

const addImage = () => {
  const files = fileInput.value.files;
  if (files && files[0]) {
    const reader = new FileReader();
    reader.onload = (e) => {
      form.image = e.target.result;
    };
    reader.readAsDataURL(files[0]);
  }
};

const submitForm = async () => {
  // const newForm = await create({
  //   ...form,
  //   hardCap: form.hardCap.toString(),
  //   softCap: form.softCap.toString(),
  //   excerpt: `${form.description.substring(0, 130)} ...`,
  //   image: form.image || "https://placehold.co/500x320",
  // });
  useAlerts().success("Project created");
  // navigateTo(`/projects/${newForm.uuid}`);
};
</script>

<template>
  <div class="w-full mx-auto mb-20 max-w-7xl">
    <div class="w-full py-12 h-44">
      <h3 class="text-3xl">Kickstart your own project</h3>
    </div>

    <div class="grid grid-cols-12">
      <Form
        @submit="submitForm"
        class="w-full col-span-8"
        :validation-schema="validationSchema"
      >
        <div
          class="relative flex flex-col items-center justify-start w-full h-full px-8 space-y-4"
        >
          <FormField
            label="What is your projects name?"
            name="title"
            v-model="form.title"
            hint="Use a very handy title that people could identify your
                project"
          />

          <FormField
            label="What is your project about?"
            name="description"
            v-model="form.description"
            hint="Describe with full detail your project so that people
                understand exactly what it is about."
          />

          <!-- TODO: take care of image upload -->
          <div class="w-full max-w-full form-control">
            <label class="label">
              <span class="label-text">Upload an image</span>
            </label>
            <input
              @change="addImage"
              ref="fileInput"
              type="file"
              class="w-full file-input file-input-bordered"
            />
            <label class="label">
              <span class="text-gray-400 label-text-alt"
                >If you use nice a image it's more likely that backers will
                notice your project.</span
              >
            </label>
          </div>

          <FormField
            label="Which category does your project fit in?"
            name="categoryUuid"
            v-model="form.categoryUuid"
            hint="Selecting a fitting category ensures the right people find your project."
          />

          <FormField
            label="What is the soft cap of your project?"
            name="softCap"
            type="range"
            min="0"
            max="100000"
            class="range"
            step="10000"
            v-model.number="form.softCap"
            hint="Soft cap is the minimum amount of money that you need to raise
                in order to start your project."
          >
            <template #label-text-alt>
              <Money :amount="form.softCap" />
            </template>

            <template #after-input>
              <div class="flex justify-between w-full px-2 text-xs">
                <span>|</span>
                <span>|</span>
                <span>|</span>
                <span>|</span>
                <span>|</span>
              </div>
              <div class="flex justify-between w-full px-2 text-xs">
                <span><Money :amount="10000" /></span>
                <span><Money :amount="25000" /></span>
                <span><Money :amount="50000" /></span>
                <span><Money :amount="75000" /></span>
                <span><Money :amount="100000" /></span>
              </div>
            </template>
          </FormField>

          <FormField
            label="What is the hard cap of your project?"
            name="hardCap"
            type="range"
            min="0"
            max="100000"
            class="range"
            step="10000"
            v-model.number="form.hardCap"
            hint="Hard cap is the maximum amount of money that you need to raise
                in order to start your project."
          >
            <template #label-text-alt>
              <Money :amount="form.hardCap" />
            </template>

            <template #after-input>
              <div class="flex justify-between w-full px-2 text-xs">
                <span>|</span>
                <span>|</span>
                <span>|</span>
                <span>|</span>
                <span>|</span>
              </div>
              <div class="flex justify-between w-full px-2 text-xs">
                <span><Money :amount="10000" /></span>
                <span><Money :amount="25000" /></span>
                <span><Money :amount="50000" /></span>
                <span><Money :amount="75000" /></span>
                <span><Money :amount="100000" /></span>
              </div>
            </template>
          </FormField>

          <div class="w-full max-w-full form-control">
            <label class="label">
              <span class="label-text">
                When should your project funding start?
              </span>
              <span class="label-text-alt">
                <ErrorMessage name="startsAt" />
              </span>
            </label>
            <Field
              name="startsAt"
              v-model="form.startsAt"
              type="date"
              class="w-full input input-bordered"
            />
            <label class="label">
              <span class="text-gray-400 label-text-alt">
                This is the date that your project will start receiving funds.
              </span>
            </label>
          </div>

          <div class="w-full max-w-full form-control">
            <label class="label">
              <span class="label-text">
                When should your project funding end?
              </span>
              <span class="label-text-alt">
                <ErrorMessage name="finishesAt" />
              </span>
            </label>
            <Field
              name="finishesAt"
              v-model="form.finishesAt"
              type="date"
              class="w-full input input-bordered"
            />

            <label class="label">
              <span class="text-gray-400 label-text-alt">
                This is the date that your project will stop receiving funds.
              </span>
            </label>
          </div>

          <div class="w-full max-w-full form-control">
            <button class="btn btn-primary">Publish your project</button>
          </div>
        </div>
      </Form>
      <div class="h-full col-span-4">
        <div class="max-w-[500px] px-8">
          <ClientOnly>
            <ProjectCard
              class="fixed w-[500px]"
              :project="{
                ...form,
                backers,
                pledged,
                funded: funded.toString(),
                finishesAt: form.finishesAt.toString(),
                startsAt: form.startsAt.toString(),
                title: form.title || 'Your title here',
                image: form.image || 'https://placehold.co/500x320',
                excerpt: form.description
                  ? `${form?.description?.substring(0, 130)}...`
                  : 'This is a description of your project. You can change it in the form. You have up to 130 characters to describe your project.',
                categoryUuid: form.categoryUuid,
                createdAt: new Date().toString(),
                lastUpdatedAt: new Date().toString(),
                hardCap: form.hardCap.toString(),
                softCap: form.softCap.toString(),
                uuid: '',
              }"
              :category-name="category?.name ?? 'Some Category'"
            />
          </ClientOnly>
        </div>
      </div>
    </div>
  </div>
</template>
