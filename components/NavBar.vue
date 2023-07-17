<script setup lang="ts">
import { User } from "~/types";
const { fetchAll: fetchCategories, list: categories } = useCategories();
await fetchCategories();

const { data: userData } = await useFetch("/api/auth/me");
const user = computed<User>(() => userData.value?.data);
</script>

<template>
  <div class="fixed z-20 w-full bg-primary text-primary-content">
    <div class="flex items-center justify-between mx-auto navbar max-w-7xl">
      <div class="flex-1">
        <nuxt-link to="/" class="text-xl normal-case btn btn-ghost"
          >DecentralSpark</nuxt-link
        >
      </div>
      <div class="flex-none">
        <ul class="px-1 menu menu-horizontal">
          <li v-for="category in categories" :key="category.uuid">
            <NuxtLink
              :title="category.uuid"
              :to="`/categories/${category.uuid}`"
              >{{ category.name }}</NuxtLink
            >
          </li>
        </ul>
      </div>
      <div class="flex-none gap-2">
        <div class="form-control">
          <nuxt-link
            :to="{ name: 'projects-create' }"
            class="btn btn-accent btn-sm"
          >
            Create Your Project
          </nuxt-link>
        </div>
        <div class="dropdown dropdown-end">
          <div tabindex="0" class="btn btn-ghost btn-circle avatar">
            <div class="w-10 rounded-full">
              <img :src="user.avatar" alt="" />
            </div>
          </div>
          <ul
            tabindex="0"
            class="mt-3 z-[1] p-2 shadow menu menu-sm dropdown-content bg-base-100 rounded-box w-52"
          >
            <li>
              <a class="justify-between">
                Profile
                <span class="badge">New</span>
              </a>
            </li>
            <li><a>Settings</a></li>
            <li><a>Logout</a></li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>
