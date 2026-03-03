<script lang="ts" setup>
import { onMounted, onUnmounted, provide, ref } from 'nativescript-vue';

import CurrentActives from '~/pages/Current.vue';
import ActivesGroup from '~/pages/Groups.vue';
import Profile from '~/pages/Profile.vue';

const selectedIndex = ref(0);
const refreshCurrentPage = ref(0);

function onSelectedIndexChanged(args: any) {
  const newIndex = args.value;
  selectedIndex.value = newIndex;

  // 当切换到"当前"tab时，触发刷新
  if (newIndex === 0) {
    refreshCurrentPage.value++;
  }
}

// 提供刷新信号给子组件
provide('refreshCurrentPage', refreshCurrentPage);

onMounted(() => {
  console.log('MainView mounted');
});

onUnmounted(() => {
  console.log('MainView unmounted');
});
</script>

<template>
  <TabView
    v-model:selectedIndex="selectedIndex"
    androidTabsPosition="bottom"
    tabBackgroundColor="#f8f9fe"
    tabTextColor="rgba(102, 126, 234, 0.5)"
    selectedTabTextColor="#667eea"
    androidSelectedTabHighlightColor="#4CAF50"
    @selected-index-change="onSelectedIndexChanged"
  >
    <TabViewItem :title="selectedIndex === 0 ? '● 当前' : '○ 当前'" textTransform="none">
      <Frame>
        <CurrentActives />
      </Frame>
    </TabViewItem>
    <TabViewItem :title="selectedIndex === 1 ? '● 规划' : '○ 规划'" textTransform="none">
      <Frame>
        <ActivesGroup />
      </Frame>
    </TabViewItem>
    <TabViewItem :title="selectedIndex === 2 ? '● 我的' : '○ 我的'" textTransform="none">
      <Frame>
        <Profile />
      </Frame>
    </TabViewItem>
  </TabView>
</template>

<style>
TabView {
  tab-text-font-size: 16;
  selected-tab-text-font-size: 18;
  android-selected-tab-highlight-color: #4caf50;
}

TabViewItem {
  background-color: #f5f5f5;
}
</style>
