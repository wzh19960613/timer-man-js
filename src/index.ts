import mitt, { type Emitter } from 'mitt'

export function sleep(time: number) {
    return new Promise<void>(finish => { setTimeout(finish, time) })
}

export type CancelableCall = ReturnType<typeof setTimeout>

export function callSyncAfter(delay: number, fn: () => any): CancelableCall {
    return setTimeout(fn, delay)
}

export function cancelCallSync(handle: CancelableCall) { clearTimeout(handle) }

export function callAfter<T>(delay: number, fn: () => T) {
    return new Promise<T>(resolve => { setTimeout(() => resolve(fn()), delay) })
}

export type CancelableRepeat = ReturnType<typeof setInterval>

export interface RepeatOptions {
    callWhenStart: boolean
    maxTimes?: number
}

export function repeatEvery(
    delay: number, fn: () => any, opts?: Partial<RepeatOptions>
): CancelableRepeat {
    let times = opts?.maxTimes
    if (opts?.callWhenStart) {
        setTimeout(fn, 0)
        if (times) times -= 1
    }
    if (times === undefined) return setInterval(fn, delay)
    if (times < 1) return undefined as any
    const handle = setInterval(() => {
        if (--times! < 0) clearInterval(handle)
        else fn()
    }, delay)
    return handle
}

export function cancelRepeat(handle: CancelableRepeat) { clearInterval(handle) }

export function loop(times: number, fn: () => any) { for (let i = times; i > 0; --i) fn() }

export interface TimerOptions extends RepeatOptions {
    repeat: boolean
}

export class Timer<T> implements TimerOptions {
    static defaultOptions: TimerOptions = {
        repeat: false,
        callWhenStart: false,
    }

    delay
    fn
    repeat
    callWhenStart
    maxTimes

    constructor(delay: number, fn?: () => T, options?: Partial<TimerOptions>) {
        this.delay = delay
        this.fn = fn
        const opt = { ...Timer.defaultOptions, ...options }
        this.repeat = opt.repeat
        this.callWhenStart = opt.callWhenStart
        this.maxTimes = opt.maxTimes
    }

    get running() { return Boolean(this.#handle) }
    set running(to) { to ? this.start() : this.stop() }
    get events() { return this.#emitter }
    get callTimes() { return this.#callTimes }
    get remainTimes() { return this.maxTimes ? this.maxTimes - this.#callTimes : 0 }
    get hasMoreTrigger() {
        return this.repeat && (this.maxTimes === undefined || this.#callTimes < this.maxTimes - 1)
    }

    start() {
        if (this.#handle) return this
        this.#callTimes = 0
        this.#emitter.emit('running-changed', true)
        return this.#start()
    }

    stop() {
        if (!this.#handle) return
        clearTimeout(this.#handle)
        this.#emitter.emit('running-changed', false)
        this.#stop()
    }

    reset() {
        this.#callTimes = 0
        if (!this.#handle) return
        clearTimeout(this.#handle)
        return this.#start()
    }

    restart() {
        this.stop()
        return this.start()
    }

    waitTriggered() {
        return new Promise<T>((resolve, reject) => {
            this.#triggerResolvers.push(resolve)
            this.#triggerRejectors.push(reject)
        })
    }

    waitStop() { return new Promise<void>(resolve => this.#stopResolvers.push(resolve)) }

    #callTimes = 0
    #handle?: ReturnType<typeof setTimeout>
    #triggerResolvers: ((result: T) => void)[] = []
    #triggerRejectors: ((reason: any) => void)[] = []
    #stopResolvers: (() => void)[] = []
    #emitter: Emitter<{ 'running-changed': boolean, 'triggered': T }> = mitt()

    #call() {
        this.#callTimes += 1
        try {
            const value = this.fn?.() as T
            for (const resolve of this.#triggerResolvers) resolve(value)
            this.#emitter.emit('triggered', value)
        } catch (e) {
            for (const reject of this.#triggerRejectors) reject(e)
        } finally {
            this.#triggerResolvers.length = this.#triggerRejectors.length = 0
            if (!this.hasMoreTrigger) this.#stop()
        }
    }

    #tigger() {
        if (this.hasMoreTrigger) this.#createHandle()
        this.#call()
    }

    #createHandle() { this.#handle = setTimeout(this.#tigger.bind(this), this.delay) }

    #start() {
        if (this.callWhenStart) setTimeout(() => this.#call(), 0)
        if (!this.callWhenStart || (this.maxTimes ?? 3) >= 2) this.#createHandle()
        return this
    }

    #stop() {
        this.#handle = undefined
        for (const reject of this.#triggerRejectors) reject(new Error('Timer stopped'))
        this.#triggerResolvers.length = this.#triggerRejectors.length = 0
        for (const resolve of this.#stopResolvers) resolve()
        this.#stopResolvers.length = 0
    }
}