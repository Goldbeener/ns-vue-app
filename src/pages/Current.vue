<script lang="ts" setup>
import {
  $navigateTo,
  computed,
  onMounted,
  onUnmounted,
  ref,
} from 'nativescript-vue';
import Details from './Profile.vue';

const counter = ref(0);
const message = computed(() => {
  return `Blank {N}-Vue app: ${counter.value}`;
});

function logMessage() {
  console.log('You have tapped the message!');
}

onMounted(() => {
  console.log('mounted');
});

onUnmounted(() => {
  console.log('unmounted');
});
</script>

<template>
  <Page>
    <ActionBar>
      <Label text="当前挑战" class="font-bold text-lg" />
    </ActionBar>

    <GridLayout rows="*, auto, auto, *" class="px-4">
      <Label
        row="1"
        class="text-xl align-middle text-center text-gray-500"
        :text="message"
        @tap="logMessage"
      />

      <Button
        row="2"
        class="mt-4 px-4 py-2 bg-white border-2 border-blue-400 rounded-lg"
        horizontal-alignment="center"
        @tap="$navigateTo(Details)"
      >
        View Details
      </Button>
    </GridLayout>
  </Page>
</template>

<style>
.info {
  font-size: 20;
}
</style>
