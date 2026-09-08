import { useCallback, useEffect, useRef, useState } from "react";
import { cn } from "@/lib/cn";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { useOsStore } from "@/store/osStore";

const COLS = 16;
const ROWS = 14;
const TICK_MS = 130;

type Point = { x: number; y: number };
type Dir = Point;
type Status = "ready" | "play" | "pause" | "dead";

const RIGHT: Dir = { x: 1, y: 0 };
const LEFT: Dir = { x: -1, y: 0 };
const UP: Dir = { x: 0, y: -1 };
const DOWN: Dir = { x: 0, y: 1 };

function keyDir(key: string): Dir | null {
  if (key === "ArrowRight" || key === "d" || key === "D") return RIGHT;
  if (key === "ArrowLeft" || key === "a" || key === "A") return LEFT;
  if (key === "ArrowUp" || key === "w" || key === "W") return UP;
  if (key === "ArrowDown" || key === "s" || key === "S") return DOWN;
  return null;
}

function opposite(a: Dir, b: Dir) {
  return a.x + b.x === 0 && a.y + b.y === 0 && (a.x !== 0 || a.y !== 0);
}

function same(a: Point, b: Point) {
  return a.x === b.x && a.y === b.y;
}

function spawnFood(snake: Point[]): Point {
  const taken = new Set(snake.map((part) => `${part.x}:${part.y}`));
  const free: Point[] = [];
  for (let y = 0; y < ROWS; y += 1) {
    for (let x = 0; x < COLS; x += 1) {
      if (!taken.has(`${x}:${y}`)) free.push({ x, y });
    }
  }
  return free[Math.floor(Math.random() * free.length)] ?? { x: 0, y: 0 };
}

function initialSnake(): Point[] {
  return [
    { x: 4, y: 7 },
    { x: 3, y: 7 },
    { x: 2, y: 7 },
  ];
}

export default function SnakeApp() {
  const focused = useOsStore((s) => s.windows.find((win) => win.id === s.activeId)?.appId === "snake");
  const reduced = usePrefersReducedMotion();
  const [snake, setSnake] = useState<Point[]>(initialSnake);
  const [food, setFood] = useState<Point>(() => spawnFood(initialSnake()));
  const [dir, setDir] = useState<Dir>(RIGHT);
  const [pending, setPending] = useState<Dir>(RIGHT);
  const [status, setStatus] = useState<Status>("ready");
  const [score, setScore] = useState(0);
  const [best, setBest] = useState(0);
  const touch = useRef<Point | null>(null);
  const pendingRef = useRef(pending);
  const dirRef = useRef(dir);
  const snakeRef = useRef(snake);
  const foodRef = useRef(food);
  const statusRef = useRef(status);
  const scoreRef = useRef(0);

  pendingRef.current = pending;
  dirRef.current = dir;
  snakeRef.current = snake;
  foodRef.current = food;
  statusRef.current = status;
  scoreRef.current = score;

  const reset = useCallback(() => {
    const next = initialSnake();
    setSnake(next);
    setFood(spawnFood(next));
    setDir(RIGHT);
    setPending(RIGHT);
    setScore(0);
    scoreRef.current = 0;
    setStatus("ready");
  }, []);

  const step = useCallback(() => {
    if (statusRef.current !== "play") return;
    const current = snakeRef.current;
    let nextDir = pendingRef.current;
    if (opposite(dirRef.current, nextDir)) nextDir = dirRef.current;
    const head = current[0];
    if (!head) return;
    const nextHead = { x: head.x + nextDir.x, y: head.y + nextDir.y };
    const hitWall = nextHead.x < 0 || nextHead.y < 0 || nextHead.x >= COLS || nextHead.y >= ROWS;
    const hitSelf = current.some((part) => same(part, nextHead));
    if (hitWall || hitSelf) {
      setStatus("dead");
      setBest((value) => Math.max(value, scoreRef.current));
      return;
    }
    const ate = same(nextHead, foodRef.current);
    const nextSnake = ate ? [nextHead, ...current] : [nextHead, ...current.slice(0, -1)];
    setDir(nextDir);
    setSnake(nextSnake);
    if (ate) {
      const nextScore = scoreRef.current + 1;
      scoreRef.current = nextScore;
      setScore(nextScore);
      setFood(spawnFood(nextSnake));
    }
  }, []);

  useEffect(() => {
    if (!focused || status !== "play" || reduced) return;
    const id = window.setInterval(step, TICK_MS);
    return () => window.clearInterval(id);
  }, [focused, status, reduced, step]);

  useEffect(() => {
    if (status === "play" && !focused) setStatus("pause");
  }, [focused, status]);

  useEffect(() => {
    if (!focused) return;

    const onKey = (event: KeyboardEvent) => {
      if (event.key === " " || event.key === "Enter") {
        event.preventDefault();
        if (statusRef.current === "dead") {
          reset();
          return;
        }
        if (statusRef.current === "play") {
          setStatus("pause");
          return;
        }
        setStatus("play");
        return;
      }

      const next = keyDir(event.key);
      if (!next) return;
      event.preventDefault();
      if (statusRef.current === "dead") return;
      if (statusRef.current !== "play") setStatus("play");
      if (!opposite(dirRef.current, next)) setPending(next);
      if (reduced) window.setTimeout(step, 0);
    };

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [focused, reduced, reset, step]);

  const occupied = new Map(snake.map((part, index) => [`${part.x}:${part.y}`, index === 0 ? "head" : "body"]));

  return (
    <div className="flex h-full flex-col bg-[#070b10] p-4 text-sm">
      <div className="mb-3 flex items-baseline justify-between font-mono text-[11px] text-os-muted">
        <span>score {score}</span>
        <span>best {best}</span>
      </div>

      <div
        className="relative mx-auto aspect-[16/14] w-full max-w-[360px] rounded-xl border border-white/10 p-1.5"
        onTouchStart={(event) => {
          const point = event.changedTouches[0];
          if (point) touch.current = { x: point.clientX, y: point.clientY };
        }}
        onTouchEnd={(event) => {
          const start = touch.current;
          const point = event.changedTouches[0];
          touch.current = null;
          if (!start || !point) return;
          const dx = point.clientX - start.x;
          const dy = point.clientY - start.y;
          if (Math.abs(dx) < 18 && Math.abs(dy) < 18) {
            if (status === "dead") reset();
            else setStatus(status === "play" ? "pause" : "play");
            return;
          }
          const next = Math.abs(dx) > Math.abs(dy) ? (dx > 0 ? RIGHT : LEFT) : dy > 0 ? DOWN : UP;
          if (status !== "play") setStatus("play");
          if (!opposite(dir, next)) setPending(next);
        }}
      >
        <div
          className="grid h-full w-full gap-[2px]"
          style={{ gridTemplateColumns: `repeat(${COLS}, minmax(0, 1fr))` }}
        >
          {Array.from({ length: COLS * ROWS }, (_, index) => {
            const x = index % COLS;
            const y = Math.floor(index / COLS);
            const cell = occupied.get(`${x}:${y}`);
            const isFood = food.x === x && food.y === y;
            return (
              <span
                key={index}
                className={cn(
                  "aspect-square rounded-[2px] bg-white/[0.04]",
                  cell === "body" && "bg-os-text/70",
                  cell === "head" && "bg-os-accent",
                  isFood && !cell && "bg-os-text/90",
                )}
              />
            );
          })}
        </div>

        {status !== "play" && (
          <div className="absolute inset-0 flex items-center justify-center rounded-xl bg-black/45">
            <p className="font-mono text-xs text-os-text">
              {status === "dead" ? "game over · enter" : status === "pause" ? "paused" : "press arrow / wasd"}
            </p>
          </div>
        )}
      </div>

      <p className="mt-auto pt-3 text-center font-mono text-[10px] text-os-muted">
        arrows or wasd · space pause
      </p>
    </div>
  );
}
