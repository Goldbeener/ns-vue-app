<script lang="ts" setup>
import { computed } from 'nativescript-vue';
import { getPlans } from '~/store';
import { showTabs } from '~/utils/viewState';

function goBack() {
  showTabs();
}

const plans = computed(() => getPlans());

// 总体统计
const totalPlans = computed(() => plans.value.length);
const completedPlans = computed(() => {
  return plans.value.filter((plan) => {
    const completedTasks = plan.tasks.filter(t => t.completed).length;
    return completedTasks === plan.tasks.length && plan.tasks.length > 0;
  }).length;
});
const inProgressPlans = computed(() => totalPlans.value - completedPlans.value);

const totalTasks = computed(() => {
  return plans.value.reduce((sum, plan) => sum + plan.tasks.length, 0);
});
const completedTasks = computed(() => {
  return plans.value.reduce((sum, plan) => {
    return sum + plan.tasks.filter(t => t.completed).length;
  }, 0);
});
const inProgressTasks = computed(() => totalTasks.value - completedTasks.value);

// 完成率
const planCompletionRate = computed(() => {
  if (totalPlans.value === 0) {
    return 0;
  }
  return Math.round((completedPlans.value / totalPlans.value) * 100);
});
const taskCompletionRate = computed(() => {
  if (totalTasks.value === 0) {
    return 0;
  }
  return Math.round((completedTasks.value / totalTasks.value) * 100);
});

// 最近的计划列表
const recentPlans = computed(() => {
  return plans.value.slice(0, 5).map((plan) => {
    const completedCount = plan.tasks.filter(t => t.completed).length;
    const progress = plan.tasks.length > 0
      ? Math.round((completedCount / plan.tasks.length) * 100)
      : 0;
    return {
      ...plan,
      progress,
    };
  });
});
</script>

<template>
  <Page class="page-bg">
    <ActionBar class="action-bar">
      <GridLayout columns="60, *, 60" width="100%">
        <StackLayout col="0" @tap="goBack" class="back-button-container">
          <Label text="‹" class="back-button" />
        </StackLayout>
        <Label col="1" text="统计信息" class="action-bar-title" />
      </GridLayout>
    </ActionBar>
    <ScrollView>
      <StackLayout class="page-container">
        <!-- 总览卡片 -->
        <StackLayout class="overview-card">
          <Label text="总览" class="card-title" />
          <GridLayout columns="*, *" rows="auto, auto" class="overview-grid">
            <StackLayout col="0" row="0" class="overview-item">
              <Label :text="totalPlans" class="overview-value" />
              <Label text="总计划数" class="overview-label" />
            </StackLayout>
            <StackLayout col="1" row="0" class="overview-item">
              <Label :text="completedPlans" class="overview-value completed" />
              <Label text="已完成" class="overview-label" />
            </StackLayout>
            <StackLayout col="0" row="1" class="overview-item">
              <Label :text="totalTasks" class="overview-value" />
              <Label text="总任务数" class="overview-label" />
            </StackLayout>
            <StackLayout col="1" row="1" class="overview-item">
              <Label :text="completedTasks" class="overview-value completed" />
              <Label text="已完成" class="overview-label" />
            </StackLayout>
          </GridLayout>
        </StackLayout>

        <!-- 完成率卡片 -->
        <StackLayout class="rate-card">
          <Label text="完成率" class="card-title" />

          <!-- 计划完成率 -->
          <StackLayout class="rate-item">
            <GridLayout columns="auto, *, auto" class="rate-header">
              <Label col="0" text="计划完成率" class="rate-label" />
              <Label col="2" :text="`${planCompletionRate}%`" class="rate-value" />
            </GridLayout>
            <StackLayout class="progress-bar-container">
              <StackLayout
                class="progress-bar"
                :width="`${planCompletionRate}%`"
              />
            </StackLayout>
            <GridLayout columns="*, *" class="rate-stats">
              <Label col="0" :text="`已完成: ${completedPlans}`" class="stat-text" />
              <Label col="1" :text="`进行中: ${inProgressPlans}`" class="stat-text right" />
            </GridLayout>
          </StackLayout>

          <!-- 任务完成率 -->
          <StackLayout class="rate-item">
            <GridLayout columns="auto, *, auto" class="rate-header">
              <Label col="0" text="任务完成率" class="rate-label" />
              <Label col="2" :text="`${taskCompletionRate}%`" class="rate-value" />
            </GridLayout>
            <StackLayout class="progress-bar-container">
              <StackLayout
                class="progress-bar"
                :width="`${taskCompletionRate}%`"
              />
            </StackLayout>
            <GridLayout columns="*, *" class="rate-stats">
              <Label col="0" :text="`已完成: ${completedTasks}`" class="stat-text" />
              <Label col="1" :text="`进行中: ${inProgressTasks}`" class="stat-text right" />
            </GridLayout>
          </StackLayout>
        </StackLayout>

        <!-- 最近计划 -->
        <StackLayout class="recent-card">
          <Label text="最近计划" class="card-title" />
          <StackLayout
            v-for="plan in recentPlans"
            :key="plan.id"
            class="plan-item"
          >
            <Label :text="plan.name" class="plan-name" />
            <Label
              :text="`${plan.startDate} - ${plan.endDate}`"
              class="plan-date"
            />
            <GridLayout columns="*, auto" class="plan-progress">
              <StackLayout col="0" class="plan-progress-bar-container">
                <StackLayout
                  class="plan-progress-bar"
                  :width="`${plan.progress}%`"
                />
              </StackLayout>
              <Label
                col="1"
                :text="`${plan.progress}%`"
                class="plan-progress-text"
              />
            </GridLayout>
            <Label
              :text="`${plan.tasks.filter(t => t.completed).length}/${plan.tasks.length} 任务完成`"
              class="plan-task-count"
            />
          </StackLayout>
          <Label
            v-if="recentPlans.length === 0"
            text="暂无计划数据"
            class="empty-hint"
          />
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

.card-title {
  font-size: 18;
  font-weight: bold;
  color: #333;
  margin-bottom: 15;
}

/* 总览卡片 */
.overview-card {
  background-color: white;
  border-radius: 16;
  padding: 20;
  margin-bottom: 20;
}

.overview-grid {
  margin-top: 10;
}

.overview-item {
  padding: 15;
  horizontal-align: center;
}

.overview-value {
  font-size: 32;
  font-weight: bold;
  color: #667eea;
  text-align: center;
  margin-bottom: 8;
}

.overview-value.completed {
  color: #4caf50;
}

.overview-label {
  font-size: 14;
  color: #999;
  text-align: center;
}

/* 完成率卡片 */
.rate-card {
  background-color: white;
  border-radius: 16;
  padding: 20;
  margin-bottom: 20;
}

.rate-item {
  margin-bottom: 25;
}

.rate-item:last-child {
  margin-bottom: 0;
}

.rate-header {
  margin-bottom: 10;
}

.rate-label {
  font-size: 16;
  font-weight: 500;
  color: #333;
}

.rate-value {
  font-size: 18;
  font-weight: bold;
  color: #667eea;
}

.progress-bar-container {
  height: 12;
  background-color: #f0f0f0;
  border-radius: 6;
  margin-bottom: 8;
}

.progress-bar {
  height: 12;
  background: linear-gradient(90deg, #667eea 0%, #4caf50 100%);
  border-radius: 6;
}

.rate-stats {
  margin-top: 5;
}

.stat-text {
  font-size: 12;
  color: #999;
}

.stat-text.right {
  text-align: right;
}

/* 最近计划 */
.recent-card {
  background-color: white;
  border-radius: 16;
  padding: 20;
  margin-bottom: 20;
}

.plan-item {
  background-color: #f8f9fe;
  border-radius: 12;
  padding: 16;
  margin-bottom: 12;
}

.plan-name {
  font-size: 16;
  font-weight: bold;
  color: #333;
  margin-bottom: 5;
}

.plan-date {
  font-size: 12;
  color: #999;
  margin-bottom: 10;
}

.plan-progress {
  margin-bottom: 8;
}

.plan-progress-bar-container {
  height: 8;
  background-color: #e0e0e0;
  border-radius: 4;
  margin-right: 10;
  vertical-align: middle;
}

.plan-progress-bar {
  height: 8;
  background: linear-gradient(90deg, #667eea 0%, #4caf50 100%);
  border-radius: 4;
}

.plan-progress-text {
  font-size: 14;
  font-weight: bold;
  color: #667eea;
  vertical-align: middle;
}

.plan-task-count {
  font-size: 12;
  color: #666;
}

.empty-hint {
  font-size: 14;
  color: #999;
  text-align: center;
  padding: 30 0;
}
</style>
