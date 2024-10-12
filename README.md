# timer-man

A reusable Timer class and some utils.

## Installation

```bash
npm i timer-man
```

## Usage

### `sleep`

```javascript
import { sleep } from "timer-man"

console.log('Start Sleep...')
await sleep(5000)
console.log('Awake')
```

### `callSyncAfter`, `cancelCallSync`
```javascript
import { callSyncAfter, cancelCallSync } from "timer-man"

const handle1 = callSyncAfter(100, () => { })
cancelCallSync(handle1)

callSyncAfter(100, () => console.log("callSyncAfter 100"))
```

### `callAfter`

```javascript
import { callAfter } from "timer-man"

const result = await callAfter(1000, () => 'Call After 1000')
console.log(result)
```

### `repeatEvery`, `cancelRepeat`

```javascript
import { sleep, repeatEvery, cancelRepeat } from "timer-man"

const handle2 = repeatEvery(1000, () => 'Repeat Every 1000')
await sleep(3000)
cancelRepeat(handle2)

repeatEvery(200, () => { console.log('Repeat Every 200') }, { callWhenStart: true, maxTimes: 10 })
```

### `loop`

```javascript
import { loop } from "timer-man"

loop(10, () => console.log('Loop once'))
```

### `Timer<T>`

```javascript
import { Timer } from "timer-man"

const timer = new Timer(1000)
await timer.start().waitStop()
console.log('Stopped')
```

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
        console.log({ at: new Date(), callTimes, remainTimes, hasMoreTrigger })
    },
    {
        repeat: true,
        callWhenStart: true,
        maxTimes: 5
    }
)

timer.start()
timer.events.on('running-changed', value => console.log('Running state changed to ', value))
timer.events.on('triggered', result => console.log('Triggered, result:', result))
```

```javascript
// Other methods you can call:
//
// timer.stop()
// timer.reset()
// timer.restart()
// Timer.defaultOptions = {
//     repeat: true,
//     callWhenStart: true,
//     maxTimes: 10,
// }
```
