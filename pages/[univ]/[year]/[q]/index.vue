<template>
  <div class="card justify-center">
    <div class="text-center text-2xl text-white">
      {{ univ }} - {{ year }}年 - 第{{ q }}問 スニペット
    </div>
    <SnippetCards :storepath="`University.${univ}.${year}.${q}`"/>
  </div>
</template>

<script setup>
const route = useRoute()
const {univ, year, q} = route.params
</script>

<style>
@keyframes shrink-grow {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(0.7);
  }
  100% {
    transform: scale(1);
  }
}

.shrink-grow {
  animation: shrink-grow 0.2s;
}

@keyframes reverse-shrink-grow {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.2);
  }
  100% {
    transform: scale(1);
  }
}

.reverse-shrink-grow {
  animation: reverse-shrink-grow 0.2s;
}
</style>
