<template>
  <div class="items-center gap-4 mb-8">
    <AddDialog :show="addSnippet" header="共通スニペットの追加" @close="addSnippet = false"
               @add="(add) => addFunc(add)"/>
    <EditDialog :show="editSnippet" :value="editText" header="共通スニペットの編集" @close="editSnippet = false"
                @edit="(edit) => editFunc(edit)"/>
    <div v-if="!data.length" class="text-center text-2xl text-white">スニペットなし</div>
    <card v-else class="w-full my-3" v-for="snippet in data">
      <template #content>
        <Textarea autoResize :modelValue="snippet" class="w-full"/>
      </template>
      <template #footer>
        <div class="flex justify-end gap-4">
          <Button :icon="copied[snippet] ? 'pi pi-check' : 'pi pi-copy'"
                  :class="copied[snippet] ? 'reverse-shrink-grow' : 'shrink-grow'" @click="onCopy(snippet)"/>
          <Button icon="pi pi-pencil" @click="() => { editText = snippet; editSnippet = true }"/>
          <Button icon="pi pi-trash" @click="removeSnippet(snippet)"/>
        </div>
      </template>
    </card>
    <div class="flex justify-center gap-4 mb-8">
      <Button label="追加" icon="pi pi-plus" @click="addSnippet = true"/>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  'storepath': { type: String }
})

const loading = ref(true)

const data = ref([])

onMounted(async () => {
  data.value = await window.api.storeGet(props.storepath)
  console.log(data.value)
  if (data.value === undefined) {
    await window.api.storeSet(props.storepath, [])
    data.value = []
  }
  loading.value = false
})

const confirm = useConfirm()

const copied = ref({})

const addSnippet = ref(false)

const editSnippet = ref(false)
const editText = ref("")

async function addFunc(add) {
  if (!(add in data.value)) {
    data.value.push(add)
    console.log(data.value)
    await window.api.storeSet(props.storepath, JSON.parse(JSON.stringify(data.value)))
  }
}

async function editFunc(edit) {
  data.value = data.value.map((s) => s === editText.value ? edit : s)
  console.log(data.value)
  await window.api.storeSet(props.storepath, JSON.parse(JSON.stringify(data.value)))
}

async function removeSnippet(snippet) {
  confirm.require({
    message: '本当に削除しますか?',
    header: '確認',
    icon: 'pi pi-exclamation-triangle',
    rejectProps: {
      label: 'キャンセル',
      severity: 'secondary',
      outlined: true
    },
    acceptProps: {
      label: '削除',
      severity: 'danger'
    },
    accept: async () => {
      data.value = data.value.filter((s) => s !== snippet)
      await window.api.storeSet(props.storepath, JSON.parse(JSON.stringify(data.value)))
    },
  });
}

async function onCopy(text) {
  copied.value[text] = true
  await navigator.clipboard.writeText(text)
  await new Promise((resolve) => setTimeout(resolve, 1000));
  copied.value[text] = false
}
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
