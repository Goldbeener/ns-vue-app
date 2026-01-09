<script lang="ts" setup>
import { ref } from 'nativescript-vue';

const items = ref(
  Array.from({ length: 1000 })
    .fill(0)
    .map((_, index) => `Item ${index + 1}`),
);
</script>

<template>
  <Page action-bar-hidden="true">
    <GridLayout rows="auto, *">
      <Label
        text="Go Back"
        class="text-center px-4 py-10 text-2xl text-gray-900 font-bold"
      />

      <ContentView row="1" class="bg-[#65adf1] rounded-t-3xl">
        <ListView
          :items="items"
          separator-color="transparent"
          class="bg-transparent"
        >
          <template #default="{ item }">
            <GridLayout columns="*, auto" class="px-4">
              <Label :text="item" class="text-3xl py-3 text-white" />
              <ContentView col="1" class="w-5 h-5 rounded-full bg-white" />
            </GridLayout>
          </template>
        </ListView>
      </ContentView>
    </GridLayout>
  </Page>
</template>
