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

##### Example
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

### IEmitter


### IReceiver