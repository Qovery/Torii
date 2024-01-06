import {type ClassValue, clsx} from "clsx"
import {twMerge} from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function classNames(...classes: any[]): string {
  return classes.filter(Boolean).join(' ')
}

export function millisToHumanTime(duration: number): string {
  let milliseconds = Math.floor((duration % 1000) / 100)
  let seconds = Math.floor((duration / 1000) % 60)
  let minutes = Math.floor((duration / (1000 * 60)) % 60)
  let hours = Math.floor((duration / (1000 * 60 * 60)) % 24)

  let s_hours = (hours < 10) ? "0" + hours : hours;
  let s_minutes = (minutes < 10) ? "0" + minutes : minutes;
  let s_seconds = (seconds < 10) ? "0" + seconds : seconds;

  return s_hours + ":" + s_minutes + ":" + s_seconds + "." + milliseconds;
}
