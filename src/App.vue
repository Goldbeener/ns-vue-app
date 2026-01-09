<script lang="ts" setup>
import { onMounted, onUnmounted } from 'nativescript-vue';

import CurrentActives from '~/pages/Current.vue';
import ActivesGroup from '~/pages/Groups.vue';
import Profile from '~/pages/Profile.vue';

onMounted(() => {
  console.log('mounted');
});

onUnmounted(() => {
  console.log('unmounted');
});
</script>

<template>
  <TabView>
    <TabViewItem title="当前">
      <Frame>
        <CurrentActives />
      </Frame>
    </TabViewItem>
    <TabViewItem title="规划">
      <Frame>
        <ActivesGroup />
      </Frame>
    </TabViewItem>
    <TabViewItem title="我的">
      <Frame>
        <Profile />
      </Frame>
    </TabViewItem>
  </TabView>
</template>
