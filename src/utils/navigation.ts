import { Frame } from '@nativescript/core';

export function navigateToPage(component: any) {
  const frame = Frame.topmost();
  if (!frame) {
    console.error('No frame found');
    return;
  }

  // 使用字符串路径导航
  const componentPath = getComponentPath(component);
  if (componentPath) {
    frame.navigate(componentPath);
  }
}

function getComponentPath(component: any): string | null {
  // 根据组件名称返回路径
  if (component.__name === 'Summary' || component.name === 'Summary') {
    return '~/pages/Summary';
  }
  return null;
}

export function goBack() {
  const frame = Frame.topmost();
  if (frame && frame.canGoBack()) {
    frame.goBack();
  }
}
