import Dexie, { type EntityTable } from "dexie";

export interface User {
  id: number;
  name: string;
  onboardingComplete: boolean;
}

export interface Course {
  id?: number;
  code: string;
  description: string;
  slotIndex: number;
}

export interface Task {
  id?: number;
  courseId: number;
  title: string;
  type: "assignment" | "lab" | "quiz" | "midterm" | "final";
  dueDate?: string;
  description: string;
  weight?: number;
  completed: boolean;
}

export interface Todo {
  id?: number;
  taskId: number;
  text: string;
  completed: boolean;
  order: number;
}

class ZooTechDB extends Dexie {
  user!: EntityTable<User, "id">;
  courses!: EntityTable<Course, "id">;
  tasks!: EntityTable<Task, "id">;
  todos!: EntityTable<Todo, "id">;

  constructor() {
    super("zootech");
    this.version(1).stores({
      user: "id, name",
      courses: "++id, code, slotIndex",
      tasks: "++id, courseId, type, completed",
      todos: "++id, taskId, order",
    });

    this.version(2)
      .stores({
        user: "id, name",
        courses: "++id, code, slotIndex",
        tasks: "++id, courseId, type, completed",
        todos: "++id, taskId, order",
      })
      .upgrade((tx) => {
        const typeMap: Record<string, string> = {
          test: "midterm",
          exam: "final",
          other: "assignment",
        };
        return tx
          .table("tasks")
          .toCollection()
          .modify((task) => {
            if (task.type in typeMap) {
              task.type = typeMap[task.type];
            }
          });
      });
  }
}

export const db = new ZooTechDB();
