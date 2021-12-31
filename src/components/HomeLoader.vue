<template>
  <component :is="optionComponent" />
</template>

<script>
import { isLoggedIn } from '../auth/authGuard';

export default {
  computed: {
    optionComponent() {
      if(isLoggedIn() == false) {
        return () => import(`../views/Home.vue`);
      } else {
        return () => import(`../views/Exchange.vue`);
      }
    }
  }
}
</script>

<style>

</style>