<script lang="ts" setup>
import { onMounted } from 'nativescript-vue';
import MainTabs from '~/pages/MainTabs.vue';
import Summary from '~/pages/Summary.vue';
import { currentView } from '~/utils/viewState';

onMounted(() => {
  console.log('App mounted');
});
</script>

<template>
  <MainTabs v-if="currentView === 'tabs'" />
  <Frame v-else-if="currentView === 'summary'">
    <Summary />
  </Frame>
</template>
