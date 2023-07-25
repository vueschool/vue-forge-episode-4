<script setup lang="ts">
import { watchDebounced } from "@vueuse/core";
import { nanoid } from "nanoid";
import { CategoryT, UuidT } from "~/types";
import { toTypedSchema } from "@vee-validate/zod";
import * as zod from "zod";

type ProjectProps = {
  uuid?: UuidT | null | undefined;
};
const props = defineProps<ProjectProps>();

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
    startsAt: zod.custom<`${string}`>(
      (val) => {
        if (typeof val !== "string") return false;
        const selectedDate = new Date(`${val} 00:00:00`);
        const isInFuture = selectedDate > new Date();
        const isToday = selectedDate.getDate() === new Date().getDate();
        return isInFuture || isToday;
      },
      { message: "Start date must be today or later" }
    ),
    finishesAt: zod.custom<`${string}`>(
      (val) => {
        if (typeof val !== "string") return false;
        const isInFuture = new Date(val) > new Date();
        const isLessThans6MonthsOut = getDateXMonthsFromNow(6) > new Date(val);
        return isInFuture && isLessThans6MonthsOut;
      },
      { message: "End date must be no more than 6 months away" }
    ),
  })
);

// Set initial form values
// and keep up with form state
const form = reactive({
  projectId: nanoid(),
  title: "",
  description: "",
  image: "",
  categoryUuid: "",
  softCap: 10_000,
  hardCap: 25_000,
  startsAt: useDateFormat(getDateXMinutesFromNow(10), "YYYY-MM-DD").value,
  finishesAt: useDateFormat(getDateXMonthsFromNow(6), "YYYY-MM-DD").value,
});

// keep hardcap always above softcap and vice versa
watch([() => form.softCap], ([soft]) => {
  if (soft > form.hardCap) {
    const plus500 = soft + 5000;
    form.hardCap = plus500 < 10000 ? plus500 : soft;
  }
});
watch([() => form.hardCap], ([hard]) => {
  if (form.softCap > hard) {
    const minus500 = hard - 5000;
    form.softCap = minus500 < 0 ? hard : minus500;
  }
});

// Get categories for dropdown
const { list: categories, fetchAll } = useCategories();
fetchAll();
const category = computed(() => {
  return categories.value.find(
    (category) => category.uuid === form.categoryUuid
  );
});

// handle form submit
const { create: createProjectInDB } = useProjects();
const finishesAt = computed(() => {
  return form.finishesAt ? new Date(form?.finishesAt) : null;
});

const startsAt = computed(() => {
  return form.startsAt ? new Date(form?.startsAt) : null;
});

const isFinishDateBeforeStartDate = computed(() => {
  return (
    finishesAt.value &&
    startsAt.value &&
    finishesAt.value.getTime() < startsAt.value.getTime()
  );
});

const errors = reactive<Record<string, string | null>>({
  title: null,
  description: null,
  image: null,
  categoryUuid: null,
  finishesAt: null,
  softCap: null,
  hardCap: null,
  startsAt: null,
});

const validateFinishDateIsAfterStartDate = async () => {
  if (isFinishDateBeforeStartDate.value) {
    errors.finishesAt = "Finish date must be after start date";
  } else {
    errors.finishesAt = null;
  }
};

watchDebounced([startsAt, finishesAt], validateFinishDateIsAfterStartDate, {
  debounce: 500,
  maxWait: 1000,
});

const softCap = computed(() => form.softCap);
const hardCap = computed(() => form.hardCap);
const { asKda: softCapAsKda } = useKdaUsd(softCap, "usd");
const { asKda: hardCapAsKda } = useKdaUsd(hardCap, "usd");

const { create: createOnBlockchain } = await usePact();
const submitForm = async () => {
  // The result is the request Key, we should save it in local storage
  // start listening to the request key and create the project on the WEB2.0
  // backend, setting the status to pending.
  // Listening is a long term process, once listening is done, we should
  // update the status to success or error.

  // If the user reloads the page, we should check if the request key is
  // present in local storage, if so, we should start listening to the
  // request key again.
  const startsAt = new Date(new Date(form.startsAt).setHours(15)).toISOString();

  if (!softCapAsKda.value || !hardCapAsKda.value) {
    throw createError(
      "There was an error converting the soft and hard caps to KDA"
    );
  }

  const { requestKey } = await createOnBlockchain({
    id: form.projectId,
    name: form.title,
    startsAt: startsAt, // form.startsAt,
    finishesAt: form.finishesAt,
    softCap: softCapAsKda.value?.toString(),
    hardCap: hardCapAsKda.value?.toString(),
  });

  if (requestKey) {
    const newForm = await createProjectInDB({
      ...form,
      hardCap: form.hardCap.toString(),
      softCap: form.softCap.toString(),
      excerpt: `${form.description.substring(0, 130)} ...`,
      image: form.image || "https://placehold.co/500x320",
      requestKey,
    });

    useAlerts().success("Project created");
    navigateTo(`/projects/${newForm.uuid}`);
  } else {
    useAlerts().error("There was an error creating your project!");
  }
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
            as="textarea"
            hint="Describe with full detail your project so that people
                understand exactly what it is about."
          />

          <AppFileUpload
            bucket="projects"
            @file:uploaded="form.image = $event"
          />

          <FormField
            label="Which category does your project fit in?"
            as="select"
            name="categoryUuid"
            v-model="form.categoryUuid"
            hint="Selecting a fitting category ensures the right people find your project."
          >
            <option disabled selected :value="null">Pick one</option>
            <option
              v-for="category in categories"
              :key="category.uuid"
              :value="category.uuid"
            >
              {{ category.name }}
            </option>
          </FormField>

          <FormField
            label="What is the soft cap of your project?"
            name="softCap"
            type="range"
            min="0"
            max="100000"
            class="range"
            step="5000"
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
            step="5000"
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

          <FormField
            label="When should your project funding start?"
            name="startsAt"
            type="date"
            v-model="form.startsAt"
            hint="This is the date that your project will open to start receiving funds."
          />

          <FormField
            label="When should your project funding end?"
            name="finishesAt"
            type="date"
            v-model="form.finishesAt"
            hint="This is the date that your project will stop receiving funds."
          />

          <button type="submit" class="w-full btn btn-primary">
            Publish your project
          </button>
        </div>
      </Form>
      <div class="h-full col-span-4">
        <div class="max-w-[500px] px-8">
          <ClientOnly>
            <ProjectCard
              class="fixed w-[500px]"
              :project="{
                ...form,
                backers: Math.floor(Math.random() * 1000),
                pledged: 0,
                funded: Math.floor(Math.random() * 10000).toString(),
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
