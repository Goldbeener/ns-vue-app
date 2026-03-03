<script lang="ts" setup>
import { ref } from 'nativescript-vue';

const props = defineProps<{
  selectedIndex: number
}>();

const emit = defineEmits<{
  (e: 'tabChange', index: number): void
}>();

function selectTab(index: number) {
  emit('tabChange', index);
}
</script>

<template>
  <GridLayout columns="*, *, *" class="bottom-nav">
    <StackLayout col="0" class="nav-item" @tap="selectTab(0)">
      <Label
        :text="selectedIndex === 0 ? '●' : '○'"
        class="nav-icon"
        :class="{ active: selectedIndex === 0 }"
      />
      <Label
        text="当前"
        class="nav-label"
        :class="{ active: selectedIndex === 0 }"
      />
    </StackLayout>

    <StackLayout col="1" class="nav-item" @tap="selectTab(1)">
      <Label
        :text="selectedIndex === 1 ? '●' : '○'"
        class="nav-icon"
        :class="{ active: selectedIndex === 1 }"
      />
      <Label
        text="规划"
        class="nav-label"
        :class="{ active: selectedIndex === 1 }"
      />
    </StackLayout>

    <StackLayout col="2" class="nav-item" @tap="selectTab(2)">
      <Label
        :text="selectedIndex === 2 ? '●' : '○'"
        class="nav-icon"
        :class="{ active: selectedIndex === 2 }"
      />
      <Label
        text="我的"
        class="nav-label"
        :class="{ active: selectedIndex === 2 }"
      />
    </StackLayout>
  </GridLayout>
</template>

<style scoped>
.bottom-nav {
  background-color: #f8f9fe;
  height: 60;
  border-top-width: 1;
  border-top-color: #e0e0e0;
}

.nav-item {
  horizontal-align: center;
  vertical-align: middle;
  padding: 5;
}

.nav-icon {
  font-size: 20;
  color: rgba(102, 126, 234, 0.5);
  text-align: center;
  margin-bottom: 2;
}

.nav-icon.active {
  color: #667eea;
  font-size: 22;
}

.nav-label {
  font-size: 12;
  color: rgba(102, 126, 234, 0.5);
  text-align: center;
}

.nav-label.active {
  color: #667eea;
  font-weight: bold;
  font-size: 13;
}
</style>
