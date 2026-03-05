import { ref } from 'nativescript-vue';

export const currentView = ref<'tabs' | 'summary' | 'setting'>('tabs');
export const lastTabIndex = ref(0);

export function showSummary(fromTabIndex?: number) {
  if (fromTabIndex !== undefined) {
    lastTabIndex.value = fromTabIndex;
  }
  currentView.value = 'summary';
}

export function showSetting(fromTabIndex?: number) {
  if (fromTabIndex !== undefined) {
    lastTabIndex.value = fromTabIndex;
  }
  currentView.value = 'setting';
}

export function showTabs() {
  currentView.value = 'tabs';
}
