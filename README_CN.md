# timer-man

一系列实用的时间相关函数和一个功能强大的Timer类

## 安装

```bash
npm i timer-man
```

## 使用方法

### `sleep`：异步函数，等待指定毫秒数

```javascript
import { sleep } from "timer-man"

console.log('Start Sleep...')
await sleep(5000)
console.log('Awake')
```

### `callSyncAfter`, `cancelCallSync`：时间参数前置的 `setTimeout` 和 `clearTimeout`

```javascript
import { callSyncAfter, cancelCallSync } from "timer-man"

const handle1 = callSyncAfter(100, () => { })
cancelCallSync(handle1)

callSyncAfter(100, () => console.log("callSyncAfter 100"))
```

### `callAfter`：异步函数，在指定延迟后调用函数并返回结果

```javascript
import { callAfter } from "timer-man"

const result = await callAfter(1000, () => 'Call After 1000')
console.log(result)
```

### `repeatEvery`, `cancelRepeat`：每间隔一定时间调用函数

```javascript
import { sleep, repeatEvery, cancelRepeat } from "timer-man"

const handle2 = repeatEvery(1000, () => 'Repeat Every 1000')
await sleep(3000)
cancelRepeat(handle2)

repeatEvery(200, () => { console.log('Repeat Every 200') }, { callWhenStart: true, maxTimes: 10 })
```

第三个参数是可选的：

- `callWhenStart`：是否在启动时立即调用一次函数，默认为`false`。即使`maxTimes`设置为 0，也会调用一次
- `maxTimes`：最大总计调用次数，默认为`undefined`代表不限制次数。如果`callWhenStart`为`true`，则启动时调用的那次也记作一次

### `loop`：循环调用函数指定次数

```javascript
import { loop } from "timer-man"

loop(10, () => console.log('Loop once'))
```

### `Timer<T>`：定时器类

Timer类提供了更灵活的定时器功能，支持单次和重复触发，以及各种控制选项。

## 示例

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

构造函数：

```javascript
new Timer(delay: number, fn?: () => T, options?: Partial<TimerOptions>)
```

第三个参数是可选的：

- `repeat`：是否重复触发，默认为`false`
- `callWhenStart`：是否在启动时立即调用一次函数，默认为`false`。即使`maxTimes`设置为 0，也会调用一次
- `maxTimes`：最大总计调用次数，默认为`undefined`代表不限制次数。如果`callWhenStart`为`true`，则启动时调用的那次也算一次

可以通过`Timer.defaultOptions`修改默认配置，在此之后创建的Timer实例会使用新的默认配置

属性：

- `running`：获取当前是否正在运行，或切换运行状态
- `callTimes`：获取当前已调用次数
- `remainTimes`：获取剩余调用次数，如果`maxTimes`设置为`undefined`，则返回`Infinity`
- `hasMoreTrigger`：获取是否还有更多次触发
- `events`：获取事件监听器
- `delay`：获取或设置延迟时间
- `fn`：获取或设置回调函数
- `repeat`：获取或设置是否重复触发
- `callWhenStart`：获取或设置是否在启动时立即调用一次函数
- `maxTimes`：获取或设置最大总计调用次数

方法：

- `start()`：启动定时器
- `stop()`：停止定时器
- `reset()`：重置定时器
- `restart()`：重启定时器
- `waitTriggered()`：异步函数，等待触发并返回函数调用结果
- `waitStop()`：异步函数，等待停止

## 注意事项

- 所有时间单位均为毫秒
- Timer对象可重复使用，提供了更多的控制选项和事件监听功能，更适合复杂的定时需求