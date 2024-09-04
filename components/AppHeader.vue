<template>
  <nav>
    <ConfirmDialog/>
    <Dialog style="width: 95vw" maximizable v-model:visible="global" header="共通スニペット" @hide="global = false">
      <SnippetCards storepath="Global"/>
    </Dialog>
    <Toolbar class="m-1">
      <template #start>
        <Button icon="pi pi-home" text @click="navigateTo('/')"/>
        <Button icon="pi pi-globe" text @click="global = !global"/>
      </template>
      <template #center>

      </template>
      <template #end>
        <Button icon="pi pi-bars" outlined/>
      </template>
    </Toolbar>
  </nav>
</template>

<script setup>
const global = ref(false)
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
