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
function useEvents<T extends EventMap>(): [IEmitter<T>, IReceiver<T>]
```

##### Example
```ts
interface MyEvents {
    "event1": number
    "event2": string
}
const [emitter, receiver] = useEvent<MyEvents>()

receiver.on("event1", data => { /* ... */ })   // called every time event1 is emitted
receiver.once("event2", data => { /* ... */ }) // called once

emitter.emit("event1", 42)
emitter.emit("event2", "foo")
```

### EventMap
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
const [emitter, receiver] = useEvent<MyEvents>()

receiver.on("event1", data => {
    console.log(data.toUpperCase())
}) // Ok

receiver.once("event2", data => {
    console.log(data.z)
}) // Error: Property 'z' does not exist on type '{ x: number; y: number; }'.

emitter.emit(event1, "test") // Ok

emitter.emit(event2, {
    x: 1,
    z: 2,
}) // Error: Argument of type '{ w: number; y: number; }' is not assignable to parameter of type '{ x: number; y: number; }'
```

If no `EventMap` type is specified, there will be no type checking.
```ts
const [emitter, receiver] = useEvent()

receiver.on("event1", data => { ... })   // data type is any
receiver.once("event2", data => { ... }) // data type is any

emitter.emit(event1, { r: 0xb4, g: 0xd4, b: 0x55 })
emitter.emit(event2, 3.14)
```

### IEmitter

#### emit

##### Synopsis
```ts
function emit(event, data)
```

##### Example
```ts
const [emitter, receiver] = useEvent<{
    event1: number
}>()

emitter.emit("event1", 3.14)
```

### IReceiver