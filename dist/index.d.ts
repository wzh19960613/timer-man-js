export declare type EventType = string | symbol
export declare type Handler<T = unknown> = (event: T) => void
export declare type WildcardHandler<T = Record<string, unknown>> = (type: keyof T, event: T[keyof T]) => void
export declare type EventHandlerList<T = unknown> = Array<Handler<T>>
export declare type WildCardEventHandlerList<T = Record<string, unknown>> = Array<WildcardHandler<T>>
export declare type EventHandlerMap<Events extends Record<EventType, unknown>> = Map<keyof Events | "*", EventHandlerList<Events[keyof Events]> | WildCardEventHandlerList<Events>>
export interface Emitter<Events extends Record<EventType, unknown>> {
	all: EventHandlerMap<Events>
	on<Key extends keyof Events>(type: Key, handler: Handler<Events[Key]>): void
	on(type: "*", handler: WildcardHandler<Events>): void
	off<Key extends keyof Events>(type: Key, handler?: Handler<Events[Key]>): void
	off(type: "*", handler: WildcardHandler<Events>): void
	emit<Key extends keyof Events>(type: Key, event: Events[Key]): void
	emit<Key extends keyof Events>(type: undefined extends Events[Key] ? Key : never): void
}
export declare function sleep(time: number): Promise<void>
export type CancelableCall = ReturnType<typeof setTimeout>
export declare function callSyncAfter(delay: number, fn: () => any): CancelableCall
export declare function cancelCallSync(handle: CancelableCall): void
export declare function callAfter<T>(delay: number, fn: () => T): Promise<T>
export type CancelableRepeat = ReturnType<typeof setInterval>
export interface RepeatOptions {
	callWhenStart: boolean
	maxTimes?: number
}
export declare function repeatEvery(delay: number, fn: () => any, opts?: Partial<RepeatOptions>): CancelableRepeat
export declare function cancelRepeat(handle: CancelableRepeat): void
export declare function loop(times: number, fn: () => any): void
export interface TimerOptions extends RepeatOptions {
	repeat: boolean
}
declare class Timer$1<T> implements TimerOptions {
	#private
	static defaultOptions: TimerOptions
	delay: number
	fn: (() => T) | undefined
	repeat: boolean
	callWhenStart: boolean
	maxTimes: number | undefined
	constructor(delay: number, fn?: () => T, options?: Partial<TimerOptions>)
	get running(): boolean
	set running(to: boolean)
	get events(): Emitter<{
		runningChanged: boolean
		triggered: T
	}>
	get callTimes(): number
	get remainTimes(): number
	get hasMoreTrigger(): boolean
	start(): this
	stop(): void
	reset(): this | undefined
	restart(): this
	waitTriggered(): Promise<T>
	waitStop(): Promise<void>
}

export {
	Timer$1 as Timer,
}

export { }
