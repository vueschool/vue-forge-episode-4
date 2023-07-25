<script setup lang="ts">
const { appName } = useAppConfig();
const form = ref({
  email: "",
  password: "",
  confirmPassword: "",
});

const supabaseAuth = useSupabaseAuthClient();
async function signUp() {
  const { email, password, confirmPassword } = form.value;
  if (!email || !password || !confirmPassword) {
    return useAlerts().error("Please fill in all fields", {
      title: "Registration Error",
    });
  }
  if (password !== confirmPassword) {
    return useAlerts().error("Passwords do not match", {
      title: "Registration Error",
    });
  }
  const { error, data } = await supabaseAuth.auth.signUp({ email, password });
  if (error) {
    useAlerts().error(error.message, {
      title: "Registration Error",
      timeout: 5000,
    });
  } else {
    useAlerts().success("Registration successful");
    navigateTo({ name: "profile", query: { from: "register" } });
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
          <h2 class="card-title">Create your account</h2>

          <form @submit.prevent="signUp">
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

            <label class="block mb-5">
              <div>Confirm Password</div>
              <input
                class="w-full input"
                type="password"
                v-model="form.confirmPassword"
              />
            </label>

            <button class="w-full btn btn-primary">Sign Up</button>
          </form>

          <div class="card-actions">
            <p class="mt-5 text-sm">
              Already have an account?
              <NuxtLink class="text-primary" to="/login">Sign In</NuxtLink>
            </p>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
