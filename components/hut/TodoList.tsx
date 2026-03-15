"use client";

import { useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useTodosForTask, addTodo, updateTodo, deleteTodo } from "@/lib/hooks";
import { Plus } from "lucide-react";

interface TodoListProps {
  taskId: number;
}

export function TodoList({ taskId }: TodoListProps) {
  const todos = useTodosForTask(taskId);
  const [newTodoText, setNewTodoText] = useState("");

  const handleAdd = async () => {
    if (!newTodoText.trim()) return;
    await addTodo({
      taskId,
      text: newTodoText.trim(),
      completed: false,
      order: todos.length,
    });
    setNewTodoText("");
  };

  return (
    <div className="space-y-2">
      {todos.map((todo) => (
        <div key={todo.id} className="flex items-center gap-2 group">
          <Checkbox
            checked={todo.completed}
            onCheckedChange={(checked) =>
              todo.id && updateTodo(todo.id, { completed: !!checked })
            }
            className="border-border"
          />
          <span
            className={`font-pixel text-[8px] flex-1 ${
              todo.completed
                ? "line-through text-muted-foreground"
                : "text-foreground"
            }`}
          >
            {todo.text}
          </span>
          <button
            onClick={() => todo.id && deleteTodo(todo.id)}
            className="font-pixel opacity-0 group-hover:opacity-100 text-destructive hover:text-destructive/80 transition-opacity cursor-pointer"
          >
            x
          </button>
        </div>
      ))}

      <div className="flex gap-1 pt-1">
        <Input
          value={newTodoText}
          onChange={(e) => setNewTodoText(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleAdd()}
          placeholder="Add a todo..."
          className="flex-1 h-7 pixel-borders bg-muted font-pixel text-[8px]"
        />
        <Button
          size="sm"
          variant="secondary"
          onClick={handleAdd}
          disabled={!newTodoText.trim()}
          className="h-7 px-2 pixel-borders cursor-pointer"
        >
          <Plus size={12} />
        </Button>
      </div>
    </div>
  );
}
