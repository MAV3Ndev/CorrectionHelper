<template>
  <nav>
    <ConfirmDialog/>
    <Dialog style="width: 95vw" maximizable v-model:visible="global" header="共通スニペット" @hide="global = false">
      <AddDialog :show="addSnippet" header="共通スニペットの追加" @close="addSnippet = false" @add="(add) => addFunc(add)"/>
      <div class="items-center gap-4 mb-8">
        <div v-if="!data.length" class="text-center text-2xl text-white">スニペットなし</div>
        <card v-for="snippet in data" class="w-full my-1">
          <template #content>
            <Textarea autoResize :modelValue="snippet" class="w-full"/>
          </template>
          <template #footer>
            <div class="flex justify-end gap-4">
              <Button :icon="copied[snippet] ? 'pi pi-check' : 'pi pi-copy'"
                      :class="copied[snippet] ? 'reverse-shrink-grow' : 'shrink-grow'" @click="onCopy(snippet)"/>
              <Button icon="pi pi-trash" @click="removeSnippet(snippet)"/>
            </div>
          </template>
        </card>
      </div>
      <!-- add snippet button -->
      <div class="flex justify-center gap-4 mb-8">
        <Button label="追加" icon="pi pi-plus" @click="addSnippet = true"/>
      </div>
    </Dialog>
    <Toolbar class="m-1">
      <template #start>
        <Button icon="pi pi-home" text @click="navigateTo('/')" />
        <Button icon="pi pi-globe" text @click="global = !global" />
      </template>
      <template #center>

      </template>
      <template #end>
        <Button icon="pi pi-bars" outlined />
      </template>
    </Toolbar>
  </nav>
</template>

<script setup>
const confirm = useConfirm()
const route = useRoute()
const {univ, year, q} = route.params

const global = ref(false)

const loading = ref(true)
const data = ref([])
const copied = ref({})

const addSnippet = ref(false)

onMounted(async () => {
  data.value = await window.api.storeGet(`Global`)
  console.log(data.value)
  if (data.value === undefined) {
    await window.api.storeSet(`Global`, [])
    data.value = []
  }
  loading.value = false
});

async function addFunc(add) {
  if (!(add in data.value)) {
    data.value.push(add)
    console.log(data.value)
    await window.api.storeSet(`Global`, JSON.parse(JSON.stringify(data.value)))
  }
}

async function removeSnippet(snippet) {
  confirm.require({
    message: 'Are you sure you want to delete?',
    header: 'Confirmation',
    icon: 'pi pi-exclamation-triangle',
    rejectProps: {
      label: 'Cancel',
      severity: 'secondary',
      outlined: true
    },
    acceptProps: {
      label: 'Delete',
      severity: 'danger'
    },
    accept: async () => {
      data.value = data.value.filter((s) => s !== snippet)
      await window.api.storeSet(`Global`, JSON.parse(JSON.stringify(data.value)))
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
