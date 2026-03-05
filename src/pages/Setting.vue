<script lang="ts" setup>
import { Dialogs } from '@nativescript/core';
import { ref } from 'nativescript-vue';
import { clearAllPlans, getPlans } from '~/store';
import { showTabs } from '~/utils/viewState';

function goBack() {
  showTabs();
}

const planCount = ref(getPlans().length);

function refreshCount() {
  planCount.value = getPlans().length;
}

async function confirmClearPlans() {
  const result = await Dialogs.confirm({
    title: '清除数据',
    message: `确定要清除全部 ${planCount.value} 条计划数据吗？此操作不可恢复。`,
    okButtonText: '确定清除',
    cancelButtonText: '取消',
  });

  if (result) {
    clearAllPlans();
    refreshCount();
    Dialogs.alert({
      title: '完成',
      message: '计划数据已清除',
      okButtonText: '确定',
    });
  }
}
</script>

<template>
  <Page class="page-bg">
    <ActionBar class="action-bar">
      <GridLayout columns="60, *, 60" width="100%">
        <StackLayout col="0" class="back-button-container" @tap="goBack">
          <Label text="‹" class="back-button" />
        </StackLayout>
        <Label col="1" text="设置" class="action-bar-title" />
      </GridLayout>
    </ActionBar>
    <ScrollView>
      <StackLayout class="page-container">
        <!-- 数据管理 -->
        <StackLayout class="section">
          <Label text="数据管理" class="section-title" />

          <StackLayout class="menu-section">
            <StackLayout class="menu-item" @tap="confirmClearPlans">
              <GridLayout columns="auto, *, auto">
                <Label col="0" text="🗑️" class="menu-icon" />
                <StackLayout col="1">
                  <Label text="清除计划数据" class="menu-text" />
                  <Label :text="`当前共 ${planCount} 条计划`" class="menu-sub-text" />
                </StackLayout>
                <Label col="2" text="›" class="menu-arrow" />
              </GridLayout>
            </StackLayout>
          </StackLayout>
        </StackLayout>
      </StackLayout>
    </ScrollView>
  </Page>
</template>

<style>
.page-bg {
  background-color: #f0f2f5;
}

.action-bar {
  background-color: #f8f9fe;
}

.back-button-container {
  horizontal-align: left;
  vertical-align: middle;
  padding: 0 10;
}

.back-button {
  color: #667eea;
  font-size: 32;
  font-weight: bold;
  vertical-align: middle;
}

.action-bar-title {
  color: #667eea;
  font-size: 18;
  font-weight: bold;
  text-align: center;
  vertical-align: middle;
}

.page-container {
  padding: 20 20 100 20;
}

.section {
  margin-bottom: 25;
}

.section-title {
  font-size: 14;
  color: #999;
  margin-bottom: 10;
  padding-left: 5;
}

.menu-section {
  background-color: white;
  border-radius: 16;
}

.menu-item {
  padding: 18 20;
  border-bottom-width: 1;
  border-bottom-color: #f0f0f0;
}

.menu-item:last-child {
  border-bottom-width: 0;
}

.menu-icon {
  font-size: 22;
  margin-right: 15;
  vertical-align: middle;
}

.menu-text {
  font-size: 16;
  color: #333;
  vertical-align: middle;
}

.menu-sub-text {
  font-size: 12;
  color: #999;
  margin-top: 3;
}

.menu-arrow {
  font-size: 24;
  color: #ccc;
  vertical-align: middle;
}
</style>
