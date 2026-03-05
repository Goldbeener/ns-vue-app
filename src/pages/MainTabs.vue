<script lang="ts" setup>
import { provide, ref, watch } from 'nativescript-vue';
import BottomNav from '~/components/BottomNav.vue';
import CurrentActives from '~/pages/Current.vue';
import ActivesGroup from '~/pages/Groups.vue';
import Profile from '~/pages/Profile.vue';
import { lastTabIndex } from '~/utils/viewState';

const selectedIndex = ref(lastTabIndex.value);
const refreshCurrentPage = ref(0);

// 监听 lastTabIndex 的变化，同步更新 selectedIndex
watch(lastTabIndex, (newIndex) => {
  selectedIndex.value = newIndex;
});

function onTabChange(index: number) {
  selectedIndex.value = index;
  lastTabIndex.value = index;

  // 每次切换 tab 都触发刷新信号
  refreshCurrentPage.value++;
}

// 提供刷新信号给子组件
provide('refreshCurrentPage', refreshCurrentPage);
</script>

<template>
  <GridLayout rows="*, auto">
    <!-- 内容区域 - 每个 tab 有独立的 Frame -->
    <GridLayout row="0">
      <Frame v-show="selectedIndex === 0">
        <CurrentActives />
      </Frame>
      <Frame v-show="selectedIndex === 1">
        <ActivesGroup />
      </Frame>
      <Frame v-show="selectedIndex === 2">
        <Profile />
      </Frame>
    </GridLayout>

    <!-- 底部导航栏 -->
    <BottomNav
      row="1"
      :selected-index="selectedIndex"
      @tab-change="onTabChange"
    />
  </GridLayout>
</template>

<style>
</style>
