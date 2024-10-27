# timer-man

A collection of useful time-related functions and a powerful Timer class

## Installation

```bash
npm i timer-man
```

## Usage

### `sleep`: Asynchronous function that waits for a specified number of milliseconds

```javascript
import { sleep } from "timer-man"

console.log('Start Sleep...')
await sleep(5000)
console.log('Awake')
```

### `callSyncAfter`, `cancelCallSync`: `setTimeout` and `clearTimeout` with time parameter first

```javascript
import { callSyncAfter, cancelCallSync } from "timer-man"

const handle1 = callSyncAfter(100, () => { })
cancelCallSync(handle1)

callSyncAfter(100, () => console.log("callSyncAfter 100"))
```

### `callAfter`: Asynchronous function that calls a function after a specified delay and returns the result

```javascript
import { callAfter } from "timer-man"

const result = await callAfter(1000, () => 'Call After 1000')
console.log(result)
```

### `repeatEvery`, `cancelRepeat`: Call a function at regular intervals

```javascript
import { sleep, repeatEvery, cancelRepeat } from "timer-man"

const handle2 = repeatEvery(1000, () => 'Repeat Every 1000')
await sleep(3000)
cancelRepeat(handle2)

repeatEvery(200, () => { console.log('Repeat Every 200') }, { callWhenStart: true, maxTimes: 10 })
```

The third parameter is optional:

- `callWhenStart`: Whether to call the function immediately when starting, default is `false`. It will be called once even if `maxTimes` is set to 0
- `maxTimes`: Maximum total number of calls, default is `undefined` meaning no limit. If `callWhenStart` is `true`, the initial call is also counted

### `loop`: Call a function a specified number of times

```javascript
import { loop } from "timer-man"

loop(10, () => console.log('Loop once'))
```

### `Timer<T>`: Timer class

The Timer class provides more flexible timer functionality, supporting single and repeated triggers, as well as various control options.

## Examples

```javascript
import { Timer } from "timer-man"

const timer = new Timer(1000, () => 'Timer Trigger Result')

const result = await timer.start().waitTriggered()
console.log(result)

await timer.start().waitStop()
console.log('Timer was stopped')
```

```javascript
import { Timer } from "timer-man"

const timer = new Timer(
    1000,
    () => {
        const { callTimes, remainTimes, hasMoreTrigger } = timer
        return { at: new Date(), callTimes, remainTimes, hasMoreTrigger }
    },
    {
        repeat: true,
        callWhenStart: true,
        maxTimes: 5
    }
)

timer.events.on('runningChanged', running => console.log('Running state changed to ', running))
timer.events.on('triggered', result => console.log('Triggered result:', result))

timer.start()
```

Constructor:

```javascript
new Timer(delay: number, fn?: () => T, options?: Partial<TimerOptions>)
```

The third parameter is optional:

- `repeat`: Whether to trigger repeatedly, default is `false`
- `callWhenStart`: Whether to call the function immediately when starting, default is `false`. It will be called once even if `maxTimes` is set to 0
- `maxTimes`: Maximum total number of calls, default is `undefined` meaning no limit. If `callWhenStart` is `true`, the initial call is also counted

You can modify the default configuration through `Timer.defaultOptions`, and Timer instances created afterwards will use the new default configuration

Properties:

- `running`: Get the current running state or toggle the running state
- `callTimes`: Get the current number of calls
- `remainTimes`: Get the remaining number of calls, returns `Infinity` if `maxTimes` is set to `undefined`
- `hasMoreTrigger`: Get whether there are more triggers
- `events`: Get the event listener
- `delay`: Get or set the delay time
- `fn`: Get or set the callback function
- `repeat`: Get or set whether to trigger repeatedly
- `callWhenStart`: Get or set whether to call the function immediately when starting
- `maxTimes`: Get or set the maximum total number of calls

Methods:

- `start()`: Start the timer
- `stop()`: Stop the timer
- `reset()`: Reset the timer
- `restart()`: Restart the timer
- `waitTriggered()`: Asynchronous function, wait for trigger and return the function call result
- `waitStop()`: Asynchronous function, wait for stop

## Notes

- All time units are in milliseconds
- The Timer object can be reused, provides more control options and event listening functionality, and is more suitable for complex timing requirements
