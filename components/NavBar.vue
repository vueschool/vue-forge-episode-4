<script setup lang="ts">
import { Category, User } from '~/types'
const {data: categoriesData} = useFetch('/api/categories')
const categories = computed<Category[]>(() => categoriesData.value?.data || [])


const {data: userData} = useFetch('/api/auth/me')
const user = computed<User>(() => userData.value?.data)
</script>

<template>
	<div class="bg-primary text-primary-content w-full">
		<div class="navbar max-w-7xl mx-auto flex items-center justify-between">
			<div class="flex-1">
				<a class="btn btn-ghost normal-case text-xl">DecentralSpark</a>
			</div>
			<div class="flex-none">
				<ul class="menu menu-horizontal px-1">
					<li v-for="category in categories" :key="category.uuid">
						<a>{{ category.name }}</a>
					</li>
				</ul>
			</div>
			<div class="flex-none gap-2">
			<div class="form-control">
				<input type="text" placeholder="Search" class="input input-bordered w-24 md:w-auto" />
			</div>
			<div class="dropdown dropdown-end">
				<div tabindex="0" class="btn btn-ghost btn-circle avatar">
					<div class="w-10 rounded-full">
						<img :src="user.avatar"  alt=""/>
					</div>
				</div>
				<ul tabindex="0" class="mt-3 z-[1] p-2 shadow menu menu-sm dropdown-content bg-base-100 rounded-box w-52">
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
