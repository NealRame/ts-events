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

const receiver.on("event1", data => { /* ... */ })   // called every time event1 is emitted
const receiver.once("event2", data => { /* ... */ }) // called once

emitter.emit("event1", 42)
emitter.emit("event2", "foo")
```

### EventMap

### IEmitter

### IReceiver