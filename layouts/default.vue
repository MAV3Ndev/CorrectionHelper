<script setup>
const route = useRoute()
const {univ, year, q} = route.params
</script>

<template>
  <div>
      <AppHeader />
      <div class="m-1 mt-4">
        <slot />
      </div>
  </div>
</template>

<style>

</style>
