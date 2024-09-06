<template>
  <nav>
    <ConfirmDialog/>
    <Dialog style="width: 95vw" maximizable v-model:visible="global" header="共通スニペット" @hide="global = false">
      <SnippetCards storepath="Global"/>
    </Dialog>
    <Dialog style="min-width: 30vw" v-model:visible="updateDialog" :header="`更新 : ${releaseInfo.tag_name}`" @hide="updateDialog = false">
      <div class="p-1" v-html="marked.parse(releaseInfo.body)"/>
      <template #footer>
        <div v-if="stage == 1" class="flex justify-end gap-4">
          <Button label="閉じる" @click="updateDialog = false"/>
          <Button label="ダウンロード" icon="pi pi-download" @click="downloadUpdate"/>
        </div>
        <div v-else-if="stage == 2" class="flex justify-end gap-4">
          <ProgressBar :value="progress.percent" class="w-full"/>
          <p class="text-sm">{{ progress.bytesPerSecond }}</p>
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

const progress = ref({})

const {data: releaseInfo} = await useFetch('https://api.github.com/repos/MAV3Ndev/CorrectionHelper/releases/latest')

onMounted(async () => {
  version.value = await window.api.version()
})

async function downloadUpdate() {
  await window.api.updateDownload()
  stage.value = 2
  watch(async () => await window.api.updateProgress(), (value) => {
    progress.value = value
    if (value.percent === 100) {
      stage.value = 3
    }
  })
}

async function installUpdate() {
  await window.api.updateInstall()
}
</script>
