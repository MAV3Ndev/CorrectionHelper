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
        <Button label="キャンセル" @click="hide()"/>
        <Button label="保存" @click="editSnippet()"/>
      </div>
    </template>
  </Dialog>
</template>

<script setup>
const props = defineProps({
  'show': { type: Boolean },
  'value': { type: String },
  'header': { type: String },
  'single': { type: Boolean, default: false }
})
const emits = defineEmits(['close', 'edit'])

const snippet = ref("")

watch(() => props.show, () => {
  if (props.value) snippet.value = props.value
})

function hide() {
  emits('close')
}

function editSnippet() {
  if (!snippet.value) {
    return
  }
  emits('edit', snippet.value)
  hide()
}
</script>
