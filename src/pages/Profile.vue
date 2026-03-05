<script lang="ts" setup>
import { Dialogs } from '@nativescript/core';
import {
  computed,
  inject,
  onMounted,
  onUnmounted,
  ref,
  watch,
} from 'nativescript-vue';
import { getPlans } from '~/store';
import { showSetting, showSummary } from '~/utils/viewState';

const userName = ref('用户名');
const userStatus = ref('在线');
const userMotto = ref('每一天都是新的开始');
const avatarText = ref('U');

const plans = ref(getPlans());

function loadData() {
  plans.value = getPlans();
}

const totalPlans = computed(() => plans.value.length);
const completedPlans = computed(() => {
  return plans.value.filter((plan) => {
    const completedTasks = plan.tasks.filter(t => t.completed).length;
    return completedTasks === plan.tasks.length && plan.tasks.length > 0;
  }).length;
});
const totalTasks = computed(() => {
  return plans.value.reduce((sum, plan) => sum + plan.tasks.length, 0);
});
const completedTasks = computed(() => {
  return plans.value.reduce((sum, plan) => {
    return sum + plan.tasks.filter(t => t.completed).length;
  }, 0);
});

// 监听 tab 切换信号，刷新数据
const refreshCurrentPage = inject<any>('refreshCurrentPage');
if (refreshCurrentPage) {
  watch(refreshCurrentPage, () => {
    loadData();
  });
}

async function editUserName() {
  const result = await Dialogs.prompt({
    title: '修改用户名',
    message: '请输入新的用户名',
    defaultText: userName.value,
    okButtonText: '确定',
    cancelButtonText: '取消',
  });

  if (result.result && result.text) {
    userName.value = result.text;
    avatarText.value = result.text.charAt(0).toUpperCase();
  }
}

async function editMotto() {
  const result = await Dialogs.prompt({
    title: '修改心情语录',
    message: '请输入新的心情语录',
    defaultText: userMotto.value,
    okButtonText: '确定',
    cancelButtonText: '取消',
  });

  if (result.result && result.text) {
    userMotto.value = result.text;
  }
}

async function changeStatus() {
  const result = await Dialogs.action({
    title: '选择状态',
    cancelButtonText: '取消',
    actions: ['在线', '忙碌', '离开', '隐身'],
  });

  if (result && result !== '取消') {
    userStatus.value = result;
  }
}

function navigateToSummary() {
  showSummary(2);
}

function navigateToSetting() {
  showSetting(2);
}

onMounted(() => {
  console.log('mounted');
});

onUnmounted(() => {
  console.log('unmounted');
});
</script>

<template>
  <Page class="page-bg">
    <ActionBar class="action-bar">
      <Label text="我的" class="action-bar-title" />
    </ActionBar>
    <ScrollView>
      <StackLayout class="page-container">
        <!-- 用户信息卡片 -->
        <StackLayout class="profile-card">
          <!-- 头像 -->
          <StackLayout class="avatar-container">
            <Label :text="avatarText" class="avatar" />
          </StackLayout>

          <!-- 用户名 -->
          <Label :text="userName" class="user-name" @tap="editUserName" />

          <!-- 状态 -->
          <StackLayout orientation="horizontal" class="status-container" @tap="changeStatus">
            <Label text="●" :class="`status-dot status-${userStatus}`" />
            <Label :text="userStatus" class="status-text" />
          </StackLayout>

          <!-- 心情语录 -->
          <Label :text="userMotto" class="user-motto" @tap="editMotto" />
        </StackLayout>

        <!-- 统计信息 -->
        <GridLayout columns="*, *" rows="auto, auto" class="stats-container">
          <StackLayout col="0" row="0" class="stat-item">
            <Label :text="totalPlans" class="stat-value" />
            <Label text="计划总数" class="stat-label" />
          </StackLayout>
          <StackLayout col="1" row="0" class="stat-item">
            <Label :text="completedPlans" class="stat-value" />
            <Label text="已完成计划" class="stat-label" />
          </StackLayout>
          <StackLayout col="0" row="1" class="stat-item">
            <Label :text="totalTasks" class="stat-value" />
            <Label text="任务总数" class="stat-label" />
          </StackLayout>
          <StackLayout col="1" row="1" class="stat-item">
            <Label :text="completedTasks" class="stat-value" />
            <Label text="已完成任务" class="stat-label" />
          </StackLayout>
        </GridLayout>

        <!-- 功能列表 -->
        <StackLayout class="menu-section">
          <StackLayout class="menu-item" @tap="navigateToSummary">
            <GridLayout columns="auto, *, auto">
              <Label col="0" text="📊" class="menu-icon" />
              <Label col="1" text="我的统计" class="menu-text" />
              <Label col="2" text="›" class="menu-arrow" />
            </GridLayout>
          </StackLayout>

          <StackLayout class="menu-item" @tap="navigateToSetting">
            <GridLayout columns="auto, *, auto">
              <Label col="0" text="ℹ️" class="menu-icon" />
              <Label col="1" text="关于" class="menu-text" />
              <Label col="2" text="›" class="menu-arrow" />
            </GridLayout>
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

.action-bar-title {
  color: #667eea;
  font-size: 18;
  font-weight: bold;
}

.page-container {
  padding: 20 20 100 20;
}

.profile-card {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 16;
  padding: 40 20;
  margin-bottom: 20;
  horizontal-align: center;
}

.avatar-container {
  horizontal-align: center;
  margin-bottom: 20;
}

.avatar {
  width: 80;
  height: 80;
  border-radius: 40;
  background-color: rgba(255, 255, 255, 0.3);
  color: white;
  font-size: 36;
  font-weight: bold;
  text-align: center;
  vertical-align: middle;
  line-height: 80;
}

.user-name {
  font-size: 24;
  font-weight: bold;
  color: white;
  text-align: center;
  margin-bottom: 10;
}

.status-container {
  horizontal-align: center;
  margin-bottom: 15;
}

.status-dot {
  font-size: 12;
  margin-right: 5;
  vertical-align: middle;
}

.status-在线 {
  color: #4caf50;
}

.status-忙碌 {
  color: #ff5722;
}

.status-离开 {
  color: #ffc107;
}

.status-隐身 {
  color: #9e9e9e;
}

.status-text {
  font-size: 14;
  color: rgba(255, 255, 255, 0.9);
  vertical-align: middle;
}

.user-motto {
  font-size: 14;
  color: rgba(255, 255, 255, 0.8);
  text-align: center;
  font-style: italic;
}

.stats-container {
  background-color: white;
  border-radius: 16;
  padding: 20;
  margin-bottom: 20;
}

.stat-item {
  padding: 15;
  horizontal-align: center;
}

.stat-value {
  font-size: 28;
  font-weight: bold;
  color: #667eea;
  text-align: center;
  margin-bottom: 5;
}

.stat-label {
  font-size: 12;
  color: #999;
  text-align: center;
}

.menu-section {
  background-color: white;
  border-radius: 16;
  padding: 0;
}

.menu-item {
  padding: 20;
  border-bottom-width: 1;
  border-bottom-color: #f0f0f0;
}

.menu-item:last-child {
  border-bottom-width: 0;
}

.menu-icon {
  font-size: 24;
  margin-right: 15;
  vertical-align: middle;
}

.menu-text {
  font-size: 16;
  color: #333;
  vertical-align: middle;
}

.menu-arrow {
  font-size: 24;
  color: #ccc;
  vertical-align: middle;
}
</style>
