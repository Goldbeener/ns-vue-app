// 全局状态
import { ApplicationSettings } from '@nativescript/core';

export interface Task {
  id: number
  title: string
  completed: boolean
}

export interface Plan {
  id: number
  name: string
  startDate: string
  endDate: string
  tasks: Task[]
  createdAt: string
}

const PLANS_KEY = 'app_plans';

export function savePlan(plan: Omit<Plan, 'id' | 'createdAt'>): Plan {
  const plans = getPlans();
  const newPlan: Plan = {
    ...plan,
    id: Date.now(),
    createdAt: new Date().toISOString(),
  };
  plans.unshift(newPlan); // 添加到数组开头
  ApplicationSettings.setString(PLANS_KEY, JSON.stringify(plans));
  return newPlan;
}

export function getPlans(): Plan[] {
  const plansJson = ApplicationSettings.getString(PLANS_KEY, '[]');
  try {
    return JSON.parse(plansJson);
  }
  catch {
    return [];
  }
}

export function getFirstPlan(): Plan | null {
  const plans = getPlans();
  return plans.length > 0 ? plans[0] : null;
}

export function updatePlan(id: number, updates: Partial<Plan>): boolean {
  const plans = getPlans();
  const index = plans.findIndex(p => p.id === id);
  if (index !== -1) {
    plans[index] = { ...plans[index], ...updates };
    ApplicationSettings.setString(PLANS_KEY, JSON.stringify(plans));
    return true;
  }
  return false;
}

export function deletePlan(id: number): boolean {
  const plans = getPlans();
  const filtered = plans.filter(p => p.id !== id);
  if (filtered.length !== plans.length) {
    ApplicationSettings.setString(PLANS_KEY, JSON.stringify(filtered));
    return true;
  }
  return false;
}

export function clearAllPlans(): void {
  ApplicationSettings.remove(PLANS_KEY);
}

