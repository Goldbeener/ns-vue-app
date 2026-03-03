<script lang="ts" setup>
import { Dialogs, Utils } from '@nativescript/core';
import { DateTimePicker } from '@nativescript/datetimepicker';
import { ref } from 'nativescript-vue';
import { savePlan } from '~/store';

interface Task {
  id: number
  title: string
}

const planName = ref('');
const startDate = ref(new Date());
const endDate = ref(new Date(Date.now() + 21 * 24 * 60 * 60 * 1000));
const tasks = ref<Task[]>([]);
const newTaskTitle = ref('');

function formatDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

async function selectStartDate() {
  try {
    const selectedDate = await DateTimePicker.pickDate({
      context: 'start',
      title: '选择开始日期',
      date: startDate.value,
      minDate: new Date(2020, 0, 1),
      maxDate: new Date(2030, 11, 31),
      okButtonText: '确定',
      cancelButtonText: '取消',
    });

    if (selectedDate) {
      startDate.value = selectedDate;
    }
  }
  catch (error) {
    console.error('选择日期失败:', error);
  }
}

async function selectEndDate() {
  try {
    const selectedDate = await DateTimePicker.pickDate({
      context: 'end',
      title: '选择结束日期',
      date: endDate.value,
      minDate: startDate.value,
      maxDate: new Date(2030, 11, 31),
      okButtonText: '确定',
      cancelButtonText: '取消',
    });

    if (selectedDate) {
      endDate.value = selectedDate;
    }
  }
  catch (error) {
    console.error('选择日期失败:', error);
  }
}

function addTask() {
  if (newTaskTitle.value.trim()) {
    tasks.value.push({
      id: Date.now(),
      title: newTaskTitle.value.trim(),
    });
    newTaskTitle.value = '';
  }
}

function removeTask(taskId: number) {
  tasks.value = tasks.value.filter(t => t.id !== taskId);
}

function dismissKeyboard() {
  if (Utils.ios) {
    // iOS: 收起键盘
    const view = Utils.ios.getter(UIApplication, UIApplication.sharedApplication).keyWindow.rootViewController.view;
    view.endEditing(true);
  } else if (Utils.android) {
    // Android: 收起键盘
    const context = Utils.android.getApplicationContext();
    const inputManager = context.getSystemService(android.content.Context.INPUT_METHOD_SERVICE);
    const activity = Utils.android.getCurrentActivity();
    if (activity && activity.getCurrentFocus()) {
      inputManager.hideSoftInputFromWindow(activity.getCurrentFocus().getWindowToken(), 0);
    }
  }
}

function savePlanData() {
  if (!planName.value.trim()) {
    Dialogs.alert({
      title: '提示',
      message: '请输入计划名称',
      okButtonText: '确定',
    });
    return;
  }

  if (tasks.value.length === 0) {
    Dialogs.alert({
      title: '提示',
      message: '请至少添加一个任务',
      okButtonText: '确定',
    });
    return;
  }

  // 保存计划到本地存储
  const _plan = savePlan({
    name: planName.value,
    startDate: formatDate(startDate.value),
    endDate: formatDate(endDate.value),
    tasks: tasks.value.map(t => ({ ...t, completed: false })),
  });

  Dialogs.alert({
    title: '成功',
    message: '计划已保存',
    okButtonText: '确定',
  }).then(() => {
    // 清空表单
    planName.value = '';
    startDate.value = new Date();
    endDate.value = new Date(Date.now() + 21 * 24 * 60 * 60 * 1000);
    tasks.value = [];
  });
}
</script>

<template>
  <Page class="page-bg">
    <ActionBar class="action-bar">
      <Label text="创建计划" class="action-bar-title" />
    </ActionBar>
    <ScrollView @tap="dismissKeyboard">
      <StackLayout class="page-container">
        <!-- 计划名称 -->
        <StackLayout class="form-section">
          <Label text="计划名称" class="form-label" />
          <TextField
            v-model="planName"
            hint="请输入计划名称"
            class="form-input"
          />
        </StackLayout>

        <!-- 时间设置 -->
        <StackLayout class="form-section">
          <Label text="计划时间" class="form-label" />
          <GridLayout columns="*, 40, *" class="date-container">
            <StackLayout col="0" class="date-input-wrapper" @tap="selectStartDate">
              <Label text="开始日期" class="date-label" />
              <Label
                :text="formatDate(startDate)"
                class="date-display"
              />
            </StackLayout>
            <Label col="1" text="至" class="date-separator" />
            <StackLayout col="2" class="date-input-wrapper" @tap="selectEndDate">
              <Label text="结束日期" class="date-label" />
              <Label
                :text="formatDate(endDate)"
                class="date-display"
              />
            </StackLayout>
          </GridLayout>
        </StackLayout>

        <!-- 任务列表 -->
        <StackLayout class="form-section">
          <Label text="任务清单" class="form-label" />

          <!-- 添加任务 -->
          <GridLayout columns="*, auto" class="add-task-container">
            <TextField
              v-model="newTaskTitle"
              col="0"
              hint="输入新任务"
              class="task-input"
              @return-press="addTask"
            />
            <Button
              col="1"
              text="添加"
              class="add-button"
              @tap="addTask"
            />
          </GridLayout>

          <!-- 任务列表 -->
          <StackLayout class="task-list">
            <StackLayout
              v-for="task in tasks"
              :key="task.id"
              class="task-item-edit"
            >
              <GridLayout columns="*, auto">
                <Label
                  col="0"
                  :text="task.title"
                  class="task-text"
                  textWrap="true"
                />
                <Label
                  col="1"
                  text="✕"
                  class="delete-button"
                  @tap="removeTask(task.id)"
                />
              </GridLayout>
            </StackLayout>
            <Label
              v-if="tasks.length === 0"
              text="暂无任务，请添加任务"
              class="empty-hint"
            />
          </StackLayout>
        </StackLayout>

        <!-- 保存按钮 -->
        <Button
          text="保存计划"
          class="save-button"
          @tap="savePlanData"
        />
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

.form-section {
  margin-bottom: 25;
}

.form-label {
  font-size: 16;
  font-weight: bold;
  color: #333;
  margin-bottom: 10;
}

.form-input {
  background-color: white;
  border-radius: 12;
  padding: 16 20;
  font-size: 16;
  color: #333;
  border-width: 1;
  border-color: #e0e0e0;
}

.date-container {
  margin-top: 5;
}

.date-input-wrapper {
  background-color: white;
  border-radius: 12;
  padding: 12 16;
  border-width: 1;
  border-color: #e0e0e0;
}

.date-label {
  font-size: 12;
  color: #999;
  margin-bottom: 5;
}

.date-display {
  font-size: 16;
  color: #333;
  font-weight: 500;
}

.date-separator {
  font-size: 16;
  color: #999;
  text-align: center;
  vertical-align: middle;
}

.add-task-container {
  margin-bottom: 15;
}

.task-input {
  background-color: white;
  border-radius: 12;
  padding: 14 16;
  font-size: 16;
  color: #333;
  margin-right: 10;
  border-width: 1;
  border-color: #e0e0e0;
}

.add-button {
  background-color: #667eea;
  color: white;
  font-size: 16;
  font-weight: bold;
  border-radius: 12;
  width: 80;
  height: 50;
}

.task-list {
  margin-top: 10;
}

.task-item-edit {
  background-color: white;
  border-radius: 12;
  padding: 16 20;
  margin-bottom: 10;
  border-width: 1;
  border-color: #e0e0e0;
}

.task-text {
  font-size: 16;
  color: #333;
  vertical-align: center;
  padding-right: 10;
}

.delete-button {
  font-size: 20;
  color: #ff5252;
  width: 30;
  height: 30;
  text-align: center;
  vertical-align: center;
}

.empty-hint {
  font-size: 14;
  color: #999;
  text-align: center;
  padding: 30 0;
}

.save-button {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  font-size: 18;
  font-weight: bold;
  border-radius: 12;
  height: 56;
  margin-top: 20;
}
</style>
