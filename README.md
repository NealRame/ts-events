# ts-events

A simple Emitter/Receiver library for Typescript.

## Setup

```sh
> npm install @nealrame/ts-events
```

## API

#### useEvents
Get a pair of emitter and receiver.

##### Synopsys
```ts
function useEvents<T extends TEventMap>(): [TEmitter<T>, IReceiver<T>]
```

##### Example
```ts
interface MyEvents {
    "event1": number
    "event2": string
}
const [emit, receiver] = useEvent<MyEvents>()

receiver.on("event1", data => { /* ... */ })   // called every time event1 is emitted
receiver.once("event2", data => { /* ... */ }) // called once

emit("event1", 42)
emit("event2", "foo")
```

### TEventMap
An `EventMap` type is used to type subscriptions to events as well as their
emissions.

```ts
type MyEvents = {
    event1: string
    event2: {
        x: number
        y: number
    }
}
const [emit, receiver] = useEvent<MyEvents>()

receiver.on("event1", data => {
    console.log(data.toUpperCase())
}) // Ok

receiver.once("event2", data => {
    console.log(data.z)
}) // Error: Property 'z' does not exist on type '{ x: number; y: number; }'.

emit(event1, "test") // Ok

emit(event2, {
    x: 1,
    z: 2,
}) // Error: Argument of type '{ w: number; y: number; }' is not assignable to parameter of type '{ x: number; y: number; }'
```

If no `EventMap` type is specified, there will be no type checking.
```ts
const [emit, receiver] = useEvent()

receiver.on("event1", data => { ... })   // data type is any
receiver.once("event2", data => { ... }) // data type is any

emit(event1, { r: 0xb4, g: 0xd4, b: 0x55 })
emit(event2, 3.14)
```

### TEmitter

##### Synopsis
```ts
function emit(event, data)
```

##### Example
```ts
const [emit, receiver] = useEvent<{
    event1: number
}>()

emit("event1", 3.14)
```

### IReceiver

#### on
Subscribe to a given event.

##### Synopsis
```ts
function on(event, callback): EventListenerUnsubscribeCallback
```
##### Parameters
* `event`: an event name
* `callback`: a callback function

##### Return
A function to end subscription to the event.

##### Example
```ts
const [emitter, receiver] = useEvent<{
    event1: number
}>()

const callback = (value: number) => console.log(value)

const unsubscribe = receiver.on("event1", callback)

unsubscribe() // end event1 subscription
```

#### once
Subscribe to a given event once.

##### Synopsis
```ts
function once(event, callback): EventListenerUnsubscribeCallback
```
##### Parameters
* `event`: an event name
* `callback`: a callback function

##### Return
A function to end subscription to the event.

##### Example
```ts
const [emitter, receiver] = useEvent<{
    event1: number
}>()

const callback = (value: number) => console.log(value)

const unsubscribe = receiver.once("event1", callback)

unsubscribe() // end event1 subscription
```

#### off

##### Synopsis
```ts
function off(): void
function off(event): void
function off(event, callback): void
```

##### Parameters
* `event`: an event name
* `callback`: a callback function

##### Example
```ts
const [emitter, receiver] = useEvent<{
    event1: number
    event2: number
}>()

const callback10 = (value: number) => console.log(value)
const callback11 = (value: number) => console.log(value)
const callback12 = (value: number) => console.log(value)
const callback20 = (value: number) => console.log(value)

receiver.on("event1", callback10)
receiver.on("event1", callback11)
receiver.on("event1", callback12)

receiver.on("event2", callback20)

receiver.off("event1", callback10) // after this callback11 and callback12 still being called
receiver.off("event1") // after this no more callbacks will be called for event1
receiver.off() //after this no more callbacks will be called for any events
```

