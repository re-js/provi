import { factory } from "provi"

export const provide: ReturnType<typeof factory>["provide"]
export const destroy: ReturnType<typeof factory>["destroy"]
export const isolate: ReturnType<typeof factory>["isolate"]