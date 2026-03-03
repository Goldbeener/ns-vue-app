<script lang="ts" setup>
import type { Plan } from '~/store';
import {
  computed,
  inject,
  onMounted,
  onUnmounted,
  ref,
  watch,
} from 'nativescript-vue';
import { getFirstPlan, updatePlan } from '~/store';

const currentPlan = ref<Plan | null>(null);

interface Task {
  id: number
  title: string
  completed: boolean
}

const tasks = ref<Task[]>([]);

const progress = computed(() => {
  if (tasks.value.length === 0) {
    return 0;
  }
  const completedCount = tasks.value.filter(t => t.completed).length;
  return Math.round((completedCount / tasks.value.length) * 100);
});

const _completedCount = computed(() => {
  return tasks.value.filter(t => t.completed).length;
});

const remainingDays = computed(() => {
  if (!currentPlan.value) {
    return 0;
  }
  const endDate = new Date(currentPlan.value.endDate);
  const today = new Date();
  const diffTime = endDate.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return Math.max(0, diffDays);
});

function loadPlan() {
  const plan = getFirstPlan();
  if (plan) {
    currentPlan.value = plan;
    tasks.value = plan.tasks;
  }
}

function toggleTask(taskId: number) {
  const task = tasks.value.find(t => t.id === taskId);
  if (task) {
    task.completed = !task.completed;
    // 更新到本地存储
    if (currentPlan.value) {
      updatePlan(currentPlan.value.id, { tasks: tasks.value });
    }
  }
}

function onNavigatedTo() {
  console.log('navigated to Current.vue');
  loadPlan();
}

// 监听来自父组件的刷新信号
const refreshCurrentPage = inject<any>('refreshCurrentPage');
if (refreshCurrentPage) {
  watch(refreshCurrentPage, () => {
    console.log('Refresh triggered from tab change');
    loadPlan();
  });
}

onMounted(() => {
  console.log('mounted');
  loadPlan();
});

onUnmounted(() => {
  console.log('unmounted');
});
</script>

<template>
  <Page class="page-bg" @navigated-to="onNavigatedTo">
    <ActionBar class="action-bar">
      <Label text="当前挑战" class="action-bar-title" />
    </ActionBar>
    <ScrollView>
      <StackLayout class="page-container">
        <StackLayout class="card-bg">
          <!-- 标题 -->
          <Label :text="currentPlan?.name || '暂无计划'" class="title" />

          <!-- 日期 -->
          <Label :text="currentPlan ? `${currentPlan.startDate} - ${currentPlan.endDate}` : '-'" class="date" />

          <!-- 进度圆环 -->
          <StackLayout class="circle-container">
            <AnimatedCircle
              backgroundColor="transparent"
              width="220"
              height="220"
              animated="true"
              animateFrom="0"
              rimColor="rgba(255, 255, 255, 0.2)"
              barColor="#4CAF50"
              fillColor="transparent"
              clockwise="true"
              rimWidth="12"
              :progress="progress"
              :text="`${progress}%`"
              textSize="36"
              textColor="#ffffff"
            />
          </StackLayout>

          <!-- 进度信息 -->
          <StackLayout class="info-container">
            <StackLayout orientation="horizontal" class="info-row">
              <StackLayout class="info-item">
                <Label text="完成率" class="info-label" />
                <Label :text="`${progress}%`" class="info-value" />
              </StackLayout>
              <StackLayout class="info-item">
                <Label text="剩余" class="info-label" />
                <Label :text="`${remainingDays}天`" class="info-value" />
              </StackLayout>
            </StackLayout>
          </StackLayout>
        </StackLayout>

        <!-- 任务列表 -->
        <StackLayout class="task-section">
          <Label text="任务清单" class="section-title" />
          <StackLayout
            v-for="task in tasks"
            :key="task.id"
            class="task-item"
            :class="{ 'task-completed': task.completed }"
            @tap="toggleTask(task.id)"
          >
            <GridLayout columns="auto, *, auto" class="task-content">
              <Label
                col="0"
                :text="task.completed ? '✓' : '○'"
                class="task-icon"
                :class="{ 'task-icon-completed': task.completed }"
              />
              <Label
                col="1"
                :text="task.title"
                class="task-title"
                :class="{ 'task-title-completed': task.completed }"
                textWrap="true"
              />
              <Label
                col="2"
                :text="task.completed ? '已完成' : '未完成'"
                class="task-status"
                :class="{ 'task-status-completed': task.completed }"
              />
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

.card-bg {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 30 20;
  border-radius: 16;
  margin-bottom: 20;
}

.title {
  font-size: 32;
  font-weight: bold;
  color: white;
  text-align: center;
  margin-bottom: 20;
}

.date {
  font-size: 16;
  color: rgba(255, 255, 255, 0.9);
  text-align: center;
  margin-bottom: 30;
}

.circle-container {
  horizontal-align: center;
  margin-bottom: 30;
}

.info-container {
  horizontal-align: center;
}

.info-row {
  horizontal-align: center;
}

.info-item {
  width: 120;
  padding: 16;
  margin: 0 10;
  background-color: rgba(255, 255, 255, 0.2);
  border-radius: 12;
}

.info-label {
  font-size: 14;
  color: rgba(255, 255, 255, 0.8);
  text-align: center;
  margin-bottom: 8;
}

.info-value {
  font-size: 24;
  font-weight: bold;
  color: white;
  text-align: center;
}

.task-section {
  margin-top: 10;
}

.section-title {
  font-size: 20;
  font-weight: bold;
  color: #333;
  margin-bottom: 15;
  padding-left: 5;
}

.task-item {
  background-color: white;
  border-radius: 12;
  margin-bottom: 12;
  padding: 16 20;
}

.task-item.task-completed {
  background-color: #f5f5f5;
  opacity: 0.8;
}

.task-content {
  vertical-align: center;
}

.task-icon {
  font-size: 24;
  color: #667eea;
  margin-right: 15;
  width: 30;
  text-align: center;
}

.task-icon.task-icon-completed {
  color: #4caf50;
  font-weight: bold;
}

.task-title {
  font-size: 16;
  color: #333;
  vertical-align: center;
  padding: 0 10;
}

.task-title.task-title-completed {
  color: #999;
  text-decoration: line-through;
}

.task-status {
  font-size: 12;
  color: #999;
  padding: 4 12;
  border-radius: 12;
  background-color: #f0f0f0;
}

.task-status.task-status-completed {
  color: #4caf50;
  background-color: #e8f5e9;
}
</style>
