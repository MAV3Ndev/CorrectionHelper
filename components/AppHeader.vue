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
      <template #footer>
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

const global = ref(false)
const drawer = ref(false)

const updateDialog = ref(false)
const stage = ref(1)

const version = ref()
const updateAvailable = ref(false)

const progress = ref({})

let releaseInfo = {}

onMounted(async () => {
  version.value = await window.api.version()
  releaseInfo = useFetch(`https:///update.electronjs.org/MAV3Ndev/CorrectionHelper/win32/${version.value}`).data
})

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
