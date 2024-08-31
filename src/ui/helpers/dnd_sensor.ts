import {
  MouseSensor as LibMouseSensor,
  TouchSensor as LibTouchSensor
} from "@dnd-kit/core"
import { type MouseEvent, type TouchEvent } from "react"

// Block DnD event propagation if element have "data-no-dnd" attribute
const handler = ({ nativeEvent: event }: MouseEvent | TouchEvent) => {
  let cur = event.target as HTMLElement

  while (cur) {
    if (cur.dataset && cur.dataset.noDnd === "false") {
      return true;
    }
    if (cur.dataset && cur.dataset.noDnd === "true") {
      return false
    }
    cur = cur.parentElement as HTMLElement
  }

  return true
}

export class DnDMouseSensor extends LibMouseSensor {
  static activators = [
    { eventName: "onMouseDown", handler }
  ] as (typeof LibMouseSensor)["activators"]
}

export class DnDTouchSensor extends LibTouchSensor {
  static activators = [
    { eventName: "onTouchStart", handler }
  ] as (typeof LibTouchSensor)["activators"]
}
