"use client";

import { useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useTodosForTask, addTodo, updateTodo, deleteTodo } from "@/lib/hooks";
import { Plus, Trash2, Sparkles, Loader2 } from "lucide-react";

interface TodoListProps {
  taskId: number;
  taskTitle: string;
  taskDescription: string;
  taskType: string;
}

export function TodoList({
  taskId,
  taskTitle,
  taskDescription,
  taskType,
}: TodoListProps) {
  const todos = useTodosForTask(taskId);
  const [newTodoText, setNewTodoText] = useState("");
  const [generating, setGenerating] = useState(false);

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

  const handleGenerate = async () => {
    setGenerating(true);
    try {
      const res = await fetch("/api/generate-todos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          taskTitle,
          taskDescription,
          taskType,
        }),
      });
      if (!res.ok) throw new Error("Failed to generate");
      const { todos: generated } = await res.json();
      for (let i = 0; i < generated.length; i++) {
        await addTodo({
          taskId,
          text: generated[i],
          completed: false,
          order: todos.length + i,
        });
      }
    } catch (err) {
      console.error("Failed to generate todos:", err);
    } finally {
      setGenerating(false);
    }
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
            className="opacity-0 group-hover:opacity-100 text-destructive hover:text-destructive/80 transition-opacity cursor-pointer"
          >
            <Trash2 size={10} />
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

      <Button
        size="sm"
        variant="outline"
        onClick={handleGenerate}
        disabled={generating}
        className="w-full h-7 text-[7px]"
      >
        {generating ? (
          <>
            <Loader2 size={10} className="mr-1 animate-spin" />
            Generating...
          </>
        ) : (
          <>
            <Sparkles size={10} className="mr-1" />
            Generate
          </>
        )}
      </Button>
    </div>
  );
}
