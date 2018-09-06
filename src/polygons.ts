import { Point } from "pixi.js"

import { VerticeGroup } from "./utils"

function createConnectedPolygon(point: Point, thickness: number, lastPoints: number[], point2: Point): number[] {
  const angle = Math.atan2(point2.y - point.y, point2.x - point.x)
  const anglePerp = angle + Math.PI / 2
  return [point.x + Math.cos(anglePerp) * thickness, point.y + Math.sin(anglePerp) * thickness]
    .concat(lastPoints)
    .concat([point.x - Math.cos(anglePerp) * thickness, point.y - Math.sin(anglePerp) * thickness])
}

function createPolygon(point1: Point, point2: Point, thickness1: number, thickness2: number): VerticeGroup {
  const angle = Math.atan2(point2.y - point1.y, point2.x - point1.x)
  const anglePerp = angle + Math.PI / 2

  return [
    point1.x + Math.cos(anglePerp) * thickness1,
    point1.y + Math.sin(anglePerp) * thickness1,

    point2.x + Math.cos(anglePerp) * thickness2,
    point2.y + Math.sin(anglePerp) * thickness2,

    point2.x - Math.cos(anglePerp) * thickness2,
    point2.y - Math.sin(anglePerp) * thickness2,

    point1.x - Math.cos(anglePerp) * thickness1,
    point1.y - Math.sin(anglePerp) * thickness1,
  ]
}
