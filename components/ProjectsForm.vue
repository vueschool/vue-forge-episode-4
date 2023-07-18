<script setup lang="ts">
import { watchDebounced } from "@vueuse/core";
import { useFilePreview } from "~/composables/useFilePreview";
import { CategoryT, UuidT } from "~/types";
import { PactNumber } from "@kadena/pactjs";
import {
  Pact,
  createWalletConnectSign,
  getClient,
  isSignedCommand,
} from "@kadena/client";
import { nanoid } from "nanoid";

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
  finishesAt: "",
  softCap: 0,
  hardCap: 0,
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

const finishesAt = computed(() => {
  return form.finishesAt ? new Date(form?.finishesAt) : Date.now();
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
  try {
    const beneficiaryGuard = `(read-keyset 'ks)`; // this is from the wallet
    const publicKey =
      "1c131be8d83f1d712b33ae0c7afd60bca0db80f362f5de9ba8792c6f4e7df488"; // this is from the wallet
    const projectOwnerAccount = `k:${publicKey}`; // this is from the wallet

    // const {build} = usePactBuilder();

    // build(publicKey, createProject())

    // createProject();

    // const {createProject, fundProject} = usePact()

    const transaction = Pact.builder
      .execution(
        Pact.modules.crowdfund["create-project"](
          nanoid(),
          form.title,
          "coin",
          new PactNumber(form.hardCap).toPactDecimal(),
          new PactNumber(form.softCap).toPactDecimal(),
          new Date(form.startsAt),
          new Date(form.finishesAt),
          projectOwnerAccount,
          beneficiaryGuard
        )
      )
      .addKeyset("ks", "keys-all", publicKey)
      .setNetworkId("testnet04") //fast-development - https://github.com/kadena-community/crowdfund
      .setMeta({
        chainId: "0", // instruct everyone to use chain 0 on devnet
      })
      .addSigner(publicKey)
      .createTransaction();

    const signWithWalletConnect = createWalletConnectSign(
      client,
      session,
      "kadena:testnet04"
    );

    const signedPactCommand = await signWithWalletConnect(transaction);

    if (isSignedCommand(signedPactCommand)) {
      const url = ""; // this will be the local url for devnet and should pass in below
      const client = getClient();
      const [requestKey] = await client.submit(signedPactCommand);
      const result = await client.listen(requestKey);

      if (result.result.status === "success") {
        // data has been stored in the blockchain
        // we can connect it with the data in the database
      } else {
        // there was an error alert
      }
    }
  } catch (err) {
    // alert there was an error submitting to blockchain
  }

  const newForm = await create({
    ...form,
    hardCap: form.hardCap.toString(),
    softCap: form.softCap.toString(),
    excerpt: `${form.description.substring(0, 130)} ...`,
    image: form.image || "https://placehold.co/500x320",
  });
  useAlerts().success("Project created");
  navigateTo(`/projects/${newForm.uuid}`);
};
</script>

<template>
  <div class="w-full mx-auto mb-20 max-w-7xl">
    <div class="w-full py-12 h-44">
      <h3 class="text-3xl">Kickstart your own project</h3>
    </div>

    <div class="grid grid-cols-12">
      <form @submit.prevent="submitForm" class="w-full col-span-8">
        <div
          class="relative flex flex-col items-center justify-start w-full h-full px-8 space-y-4"
        >
          <div class="w-full max-w-full form-control">
            <label class="label">
              <span class="label-text">What is your projects name?</span>
            </label>
            <input
              v-model="form.title"
              type="text"
              placeholder="Your title here"
              class="w-full input input-bordered"
            />
            <label class="label">
              <span class="text-gray-400 label-text-alt"
                >Use a very handy title that people could identify your
                project</span
              >
            </label>
          </div>

          <div class="w-full max-w-full form-control">
            <label class="label">
              <span class="label-text">What is your project about?</span>
            </label>
            <textarea
              v-model="form.description"
              class="w-full h-56 textarea textarea-bordered"
              placeholder="Description"
            ></textarea>
            <label class="label">
              <span class="text-gray-400 label-text-alt"
                >Describe with full detail your project so that people
                understand exactly what it is about.</span
              >
            </label>
          </div>

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

          <div class="w-full max-w-full form-control">
            <label class="label">
              <span class="label-text"
                >Which category does your project fit in?</span
              >
            </label>
            <select v-model="form.categoryUuid" class="select select-bordered">
              <option disabled selected :value="null">Pick one</option>
              <option
                v-for="category in categories"
                :key="category.uuid"
                :value="category.uuid"
              >
                {{ category.name }}
              </option>
            </select>
            <label class="label">
              <span class="text-gray-400 label-text-alt"
                >Select the category that your project best fits in.</span
              >
            </label>
          </div>

          <div class="w-full max-w-full form-control">
            <label class="label">
              <span class="label-text"
                >What is the soft cap of your project?</span
              >
              <span class="label-text-alt"
                ><Money :amount="form.softCap"
              /></span>
            </label>
            <input
              type="range"
              min="0"
              max="100000"
              class="range"
              step="10000"
              v-model="form.softCap"
            />
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
            <label class="label">
              <span class="text-gray-400 label-text-alt">
                Soft cap is the minimum amount of money that you need to raise
                in order to start your project.
              </span>
            </label>
          </div>

          <div class="w-full max-w-full form-control">
            <label class="label">
              <span class="label-text"
                >What is the hard cap of your project?</span
              >
              <span class="label-text-alt"><Money :amount="hardCap" /></span>
            </label>
            <input
              type="range"
              min="0"
              max="100000"
              v-model="form.hardCap"
              class="range"
              step="10000"
            />
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
            <label class="label">
              <span class="text-gray-400 label-text-alt">
                Hard cap is the maximum amount of money that you need to raise
                in order to start your project.
              </span>
            </label>
          </div>

          <div class="w-full max-w-full form-control">
            <label class="label">
              <span class="label-text"
                >Which date do you want to set as a timeline?</span
              >
            </label>
            <input
              v-model="form.finishesAt"
              type="date"
              class="w-full input input-bordered"
            />
            <label class="label">
              <span class="text-gray-400 label-text-alt">
                Choose wisely the date that you want to set as a timeline for
                your project.
              </span>
            </label>
          </div>

          <div class="w-full max-w-full form-control">
            <button class="btn btn-primary">Publish your project</button>
          </div>
        </div>
      </form>
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
                finishesAt: finishesAt.toString(),
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
