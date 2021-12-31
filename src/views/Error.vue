<template>
  <div>
    <h1>Error</h1>
    something happened
    <p>{{ timeout }}</p>
  </div>
</template>

<script>
const brandName = '4truckLoad';

export default {
  name: "error",

  metaInfo: {
    title: 'Freight Exchange',
    titleTemplate: `${ brandName } | %s `,
    meta: [
      { 'http-equiv': 'Content-Type', content: 'text/html; charset=utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
    ]
  },

  data: () => ({
    timeout: 3
  }),

  watch: {
    timeout() {
      console.log(this.timeout)
      if(this.timeout <= 0) this.$router.push('/');
    }
  },

  mounted() {
    setInterval(() => {
      this.timeout--;
    }, 1000);
  }
}
</script>


<style scoped>
p {
  color: #42b983;
  font-size: 4rem;
}
</style>
