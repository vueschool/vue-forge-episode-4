<script setup lang="ts">
import Balance from '~/components/Balance.vue'
import { useGetBalance } from '~/composables/useGetBalance'

const { fetchAll: fetchCategories, list: categories } = useCategories();
await fetchCategories();
const { appName } = useAppConfig();

const user = useSupabaseUser();

const { data: userData } = await useFetch("/api/auth/me");

</script>

<template>
  <div class="fixed z-20 w-full bg-primary text-primary-content">
    <div class="flex items-center justify-between mx-auto navbar max-w-7xl">
      <div class="flex-1">
        <nuxt-link to="/" class="text-xl normal-case btn btn-ghost">
	        {{appName }}
        </nuxt-link>
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
        <NuxtLink
          class="btn btn-white btn-sm"
          v-if="!user"
          :to="{ name: 'login' }"
        >
          Login
        </NuxtLink>
        <div class="dropdown dropdown-end" v-if="user">
          <div tabindex="0" class="btn btn-ghost btn-circle avatar">
            <div
              class="w-10 text-lg leading-10 text-white rounded-full bg-secondary"
            >
              <span>{{ user?.email?.substring(0, 1) }}</span>
            </div>
          </div>
          <ul
            tabindex="0"
            class="mt-3 z-[1] p-2 shadow menu menu-sm dropdown-content bg-base-100 rounded-box w-52"
          >
            <li>
              <NuxtLink class="justify-between" :to="{ name: 'profile' }">
                Profile
                <span class="text-white badge badge-primary">New</span>
              </NuxtLink>
            </li>
            <li><NuxtLink :to="{ name: 'logout' }">Logout</NuxtLink></li>
          </ul>
        </div>
	      <ClientOnly fallback-tag="span" fallback="Loading comments...">
		      <Balance />
	      </ClientOnly>
      </div>
    </div>
  </div>
</template>
