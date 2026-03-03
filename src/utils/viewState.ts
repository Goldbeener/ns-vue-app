import { ref } from 'nativescript-vue';

export const currentView = ref<'tabs' | 'summary'>('tabs');
export const lastTabIndex = ref(0);

export function showSummary(fromTabIndex?: number) {
  if (fromTabIndex !== undefined) {
    lastTabIndex.value = fromTabIndex;
  }
  currentView.value = 'summary';
}

export function showTabs() {
  currentView.value = 'tabs';
}
