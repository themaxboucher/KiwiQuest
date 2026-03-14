"use client";

import { useLiveQuery } from "dexie-react-hooks";
import { db, type Course, type Task, type Todo } from "./db";

export function useUser() {
  const user = useLiveQuery(() => db.user.get(1));
  return user;
}

export function useCourses() {
  return useLiveQuery(() => db.courses.orderBy("slotIndex").toArray()) ?? [];
}

export function useTasksForCourse(courseId: number | undefined) {
  return (
    useLiveQuery(
      () =>
        courseId !== undefined
          ? db.tasks.where("courseId").equals(courseId).toArray()
          : [],
      [courseId]
    ) ?? []
  );
}

export function useAllTasks() {
  return useLiveQuery(() => db.tasks.toArray()) ?? [];
}

export function useTodosForTask(taskId: number | undefined) {
  return (
    useLiveQuery(
      () =>
        taskId !== undefined
          ? db.todos.where("taskId").equals(taskId).sortBy("order")
          : [],
      [taskId]
    ) ?? []
  );
}

export async function saveUser(name: string) {
  await db.user.put({ id: 1, name, onboardingComplete: false });
}

export async function completeOnboarding() {
  await db.user.update(1, { onboardingComplete: true });
}

export async function addCourse(course: Omit<Course, "id">) {
  return db.courses.add(course);
}

export async function deleteCourse(id: number) {
  await db.tasks.where("courseId").equals(id).delete();
  await db.courses.delete(id);
}

export async function addTask(task: Omit<Task, "id">) {
  return db.tasks.add(task);
}

export async function updateTask(id: number, changes: Partial<Task>) {
  await db.tasks.update(id, changes);
}

export async function deleteTask(id: number) {
  await db.todos.where("taskId").equals(id).delete();
  await db.tasks.delete(id);
}

export async function addTodo(todo: Omit<Todo, "id">) {
  return db.todos.add(todo);
}

export async function updateTodo(id: number, changes: Partial<Todo>) {
  await db.todos.update(id, changes);
}

export async function deleteTodo(id: number) {
  await db.todos.delete(id);
}

export async function bulkAddTasks(tasks: Omit<Task, "id">[]) {
  return db.tasks.bulkAdd(tasks);
}

export async function bulkAddTodos(todos: Omit<Todo, "id">[]) {
  return db.todos.bulkAdd(todos);
}
