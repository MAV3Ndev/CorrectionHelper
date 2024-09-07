<template>
  <nav>
    <ConfirmDialog/>
    <Dialog style="width: 95vw" maximizable v-model:visible="global" header="共通スニペット" @hide="global = false">
      <SnippetCards storepath="Global"/>
    </Dialog>
    <Dialog style="min-width: 30vw" v-model:visible="updateDialog" :header="`更新 : ${releaseInfo.name}`" @hide="updateDialog = false">
      <div class="p-1" v-html="marked.parse(releaseInfo.notes)"/>
      <template #footer>
        <div v-if="stage == 1" class="flex justify-end gap-4">
          <Button label="閉じる" @click="updateDialog = false"/>
          <Button label="ダウンロード" icon="pi pi-download" @click="downloadUpdate"/>
        </div>
        <div v-else-if="stage == 2" class="text-center w-full">
          <ProgressBar :value="Math.trunc(progress.percent)" class="w-full"/>
          <span class="text-sm text-right w-full">{{ humanFileSize(progress.bytesPerSecond) }} / s</span>
          <p class="w-full">
            {{ humanFileSize(progress.transferred) }} / {{ humanFileSize(progress.total) }}
          </p>
        </div>
        <div v-else class="flex justify-end gap-4">
          <Button label="再起動して完了" icon="pi pi-cog" @click="installUpdate"/>
        </div>
      </template>
    </Dialog>
    <Drawer v-model:visible="drawer" header="メニュー">
      <Panel header="履歴" toggleable>
        <div v-if="!history.length">
            履歴はありません
        </div>
        <div v-else v-for="(page,i) in history">
          <Button :label="page.name" text class="w-full" @click="navigateTo(page.path)">
          </Button>
          <Divider v-if="i != history.length - 1"/>
        </div>
      </Panel>
      <template #footer>
        <div class="m-3 flex">
          <ToggleSwitch class="ml-1 mr-3" v-model="alwaysOnTop" @update:modelValue="switchAOT" />
          <div>常に最前面に表示</div>
        </div>
        <div class="m-3 text-center">
          <Button v-if="version != releaseInfo.name" class="w-full" label="更新が利用可能" outlined icon="pi pi-info-circle"
                  @click="updateDialog = !updateDialog"/>
          <p>CorrectionHelper v{{ version }}</p>
        </div>
      </template>
    </Drawer>
    <Toolbar class="m-1">
      <template #start>
        <Button icon="pi pi-home" text @click="navigateTo('/')"/>
        <Button icon="pi pi-globe" text @click="global = !global"/>
      </template>
      <template #center>

      </template>
      <template #end>
        <Button icon="pi pi-bars" text @click="drawer = !drawer"/>
      </template>
    </Toolbar>
  </nav>
</template>

<script setup>
import { marked } from "marked";
const route = useRoute()

const global = ref(false)
const drawer = ref(false)

const alwaysOnTop = ref(false)

const updateDialog = ref(false)
const stage = ref(1)

const version = ref()

let releaseInfo = {}

const progress = ref({})

const history = ref([])

onMounted(async () => {
  history.value = await window.api.storeGet('History')
  if (history.value === undefined) {
    await window.api.storeSet('History', [])
    history.value = []
  }
  version.value = await window.api.version()
  releaseInfo = await window.api.updateCheck()
})

watch(
    () => route.path,
    () => {
      if (history.value && route.path !== '/') {
        if (!history.value.find((e) => e.path === route.path)) {
          history.value.push({name: String(route.path).slice(1).replaceAll("/"," - "), path: route.path})
          if (history.value.length > 10) {
            history.value.shift()
          }
          window.api.storeSet('History', JSON.parse(JSON.stringify(history.value)))
        }
      }
    },
);


async function downloadUpdate() {
  await window.api.updateDownload()
  stage.value = 2
  function I() {setTimeout(async () => {
    progress.value = await window.api.updateProgress()
    if (await window.api.updateReady()) {
      stage.value = 3
    } else {
      I()
    }
  }, 10)}
  I()
}

async function installUpdate() {
  await window.api.updateInstall()
}

async function switchAOT(value) {
  await window.api.setAlwaysOnTop(value)
}

function humanFileSize(bytes, si=false, dp=1) {
  const thresh = si ? 1000 : 1024;

  if (Math.abs(bytes) < thresh) {
    return bytes + ' B';
  }

  const units = si
      ? ['kB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
      : ['KiB', 'MiB', 'GiB', 'TiB', 'PiB', 'EiB', 'ZiB', 'YiB'];
  let u = -1;
  const r = 10**dp;

  do {
    bytes /= thresh;
    ++u;
  } while (Math.round(Math.abs(bytes) * r) / r >= thresh && u < units.length - 1);


  return bytes.toFixed(dp) + ' ' + units[u];
}
</script>
