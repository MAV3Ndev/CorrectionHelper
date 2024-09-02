<template>
  <div class="card flex justify-center">
    <AddDialog single :show="addUniv" header="大学を追加" @close="addUniv = false" @add="(add) => addUnivFunc(add)"/>
    <AddDialog single :show="addQ" header="大問を追加" @close="addQ = false" @add="(add) => addQFunc(add)"/>
    <AddDialog single :show="addYear" header="年度/回を追加" @close="addYear = false" @add="(add) => addYearFunc(add)"/>
    <Stepper value="1" linear class="basis-[50rem]">
      <StepList>
        <Step value="1">大学を選択</Step>
        <Step value="2">年度/回を選択</Step>
        <Step value="3">大問を選択</Step>
      </StepList>
      <StepPanels>
        <StepPanel v-slot="{ activateCallback }" value="1">
          <div class="flex flex-col h-48">
            <div
                class="flex-auto flex justify-center font-medium">
              <Listbox @update:modelValue="(value) => {if (value) activateCallback('2')}" v-model="selectedUniv" :options="Object.keys(data)" class="w-full" filter>
                <template v-slot:footer>
                  <div class="flex justify-center">
                    <Button class="m-1" label="追加" icon="pi pi-plus" @click="addUniv = true"/>
                  </div>
                </template>
              </Listbox>
            </div>
          </div>
          <div class="flex pt-6 justify-end">
            <Button label="Next" icon="pi pi-arrow-right" @click="activateCallback('2')" :disabled="!selectedUniv"/>
          </div>
        </StepPanel>
        <StepPanel v-slot="{ activateCallback }" value="2">
          <div class="flex flex-col h-48">
            <div
                class="flex-auto flex justify-center font-medium">
              <Listbox @update:modelValue="(value) => {if (value) activateCallback('3')}" v-model="selectedYear" :options="selectedUniv ? Object.keys(data[selectedUniv]) : []" class="w-full" filter>
                <template v-slot:footer>
                  <div class="flex justify-center">
                    <Button class="m-1" label="追加" icon="pi pi-plus" @click="addYear = true"/>
                  </div>
                </template>
              </Listbox>
            </div>
          </div>
          <div class="flex pt-6 justify-between">
            <Button label="Back" severity="secondary" icon="pi pi-arrow-left" @click="activateCallback('1')"/>
            <Button label="Next" icon="pi pi-arrow-right" iconPos="right" @click="activateCallback('3')" :disabled="!selectedYear"/>
          </div>
        </StepPanel>
        <StepPanel v-slot="{ activateCallback }" value="3">
          <div class="flex flex-col h-48">
            <div
                class="flex-auto flex justify-center font-medium">
              <Listbox @update:modelValue="(value) => {if (value) navigateTo(`/${selectedUniv}/${selectedYear}/${value}`)}" v-model="selectedQ" :options="selectedYear ? Object.keys(data[selectedUniv][selectedYear]) : []" class="w-full" filter>
                <template v-slot:footer>
                  <div class="flex justify-center">
                    <Button class="m-1" label="追加" icon="pi pi-plus" @click="addQ = true"/>
                  </div>
                </template>
              </Listbox>
            </div>
          </div>
          <div class="pt-6">
            <Button label="Back" severity="secondary" icon="pi pi-arrow-left" @click="activateCallback('2')"/>
          </div>
        </StepPanel>
      </StepPanels>
    </Stepper>
  </div>
</template>

<script setup>
const data = ref({})
const loading = ref(true)

const addUniv = ref(false)
const addYear = ref(false)
const addQ = ref(false)

const selectedUniv = ref()
const selectedYear = ref()
const selectedQ = ref()

onMounted(async () => {
  data.value = await window.api.storeGet('University')
  if (data.value === undefined) {
    await window.api.storeSet('University', {})
    data.value = {}
  }
  loading.value = false
});

async function addUnivFunc(add) {
  if (!data.value[add]) {
    data.value[add] = {}
    await window.api.storeSet(`University.${add}`, {})
  }
}

async function addYearFunc(add) {
  if (!data.value[selectedUniv.value][add]) {
    data.value[selectedUniv.value][add] = {}
    await window.api.storeSet(`University.${selectedUniv.value}.${add}`, {})
  }
}

async function addQFunc(add) {
  if (!data.value[selectedUniv.value][selectedYear.value][add]) {
    data.value[selectedUniv.value][selectedYear.value][add] = []
    await window.api.storeSet(`University.${selectedUniv.value}.${selectedYear.value}.${add}`, [])
  }
}
</script>
