<template>
  <Dialog style="width: 90vw; max-width: 1000px" v-model:visible="props.show" :header="props.header" @hide="hide()">
    <template #closeicon>
      <div>
        <Button rounded fluid icon="pi pi-times" class="text-white" text @click="hide()"/>
      </div>
    </template>
    <div class="flex items-center gap-4 mb-8">
      <InputText v-if="props.single" v-model="snippet" class="w-full" autocomplete="off" />
      <Textarea v-else autoResize v-model="snippet" class="w-full"/>
    </div>
    <template #footer>
      <div class="flex justify-end gap-4">
        <Button label="保存して終了" @click="addSnippet(true)"/>
        <Button label="保存" @click="addSnippet(false)"/>
      </div>
    </template>
  </Dialog>
</template>

<script setup>
const props = defineProps({
  'show': { type: Boolean },
  'header': { type: String },
  'single': { type: Boolean, default: false }
})
const emits = defineEmits(['close', 'add'])

const snippet = ref("")

function hide() {
  console.log('hide')
  emits('close')
}

function addSnippet(close) {
  if (!snippet.value) {
    return
  }
  emits('add', snippet.value)
  if (close) {
    hide()
  }
  snippet.value = ""
}
</script>
