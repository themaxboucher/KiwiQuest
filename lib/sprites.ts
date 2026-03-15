import type { Task } from "@/lib/db";

export const SPRITE_BY_TYPE: Record<Task["type"], string> = {
  assignment: "/sprites/orc.png",
  lab: "/sprites/slime_monster.png",
  quiz: "/sprites/troll.png",
  midterm: "/sprites/dark_knight.png",
  final: "/sprites/dragon.png",
};
