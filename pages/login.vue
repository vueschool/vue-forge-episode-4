<script setup lang="ts">
const { appName } = useAppConfig();
const user = useSupabaseUser();

const form = ref({
  email: "",
  password: "",
});

watch(user, () => {
  if (user.value) navigateTo((useRoute().query.redirect as string) || "/");
});

async function signIn() {
  const { email, password } = form.value;
  const { auth } = useSupabaseAuthClient();
  const { error } = await auth.signInWithPassword({
    email,
    password,
  });
  if (error) {
    useAlerts().error(error.message, {
      title: "Sign In Error",
    });
  }
}
</script>
<template>
  <section class="flex items-center justify-center h-screen">
    <div class="mt-[-50px]">
      <div class="flex items-center justify-center mb-5">
        <NuxtLink to="/">
          <h2 class="text-2xl">
            {{ appName }}
          </h2>
        </NuxtLink>
      </div>

      <div class="overflow-hidden shadow-xl card w-96 bg-neutral-content">
        <div class="h-2 rounded bg-primary"></div>
        <div class="card-body">
          <h2 class="card-title">Sign into your account</h2>
          <form @submit.prevent="signIn">
            <label class="block mb-5">
              <div>Email</div>

              <input class="w-full input" type="email" v-model="form.email" />
            </label>

            <label class="block mb-5">
              <div>Password</div>
              <input
                class="w-full input"
                type="password"
                v-model="form.password"
              />
            </label>

            <button class="w-full btn btn-primary">Login</button>
          </form>

          <!-- Register Link -->
          <p class="flex items-center justify-center mt-2 text-sm">
            Don’t have an account yet?
            <NuxtLink class="ml-2 text-primary" to="/register"
              >Sign up!</NuxtLink
            >
          </p>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
:deep(button.formkit-input) {
  @apply w-full mt-2;
}
</style>
