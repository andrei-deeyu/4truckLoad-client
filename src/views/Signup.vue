<template>
  <div>
  </div>
</template>

<script>
export default {
  name: "signup",
  data: () => ({
  }),

  created() {
    this.$auth.loginWithRedirect({ action: 'signup', language: ['ro'] });
  },
}
</script>