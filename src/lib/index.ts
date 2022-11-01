export type EventListenerCallback<EventType> = (event: EventType) => void

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type EventMap = Record<string, any>
export type EventKey<T extends EventMap> = string & keyof T

export interface IEmitter<T extends EventMap> {
    emit<K extends EventKey<T>>(eventName: K, eventData: T[K]): IEmitter<T>
}

export interface IReceiver<T extends EventMap> {
    on<K extends EventKey<T>>(eventName: K, callback: EventListenerCallback<T[K]>): IReceiver<T>
    once<K extends EventKey<T>>(eventName: K, callback: EventListenerCallback<T[K]>): IReceiver<T>

    off<K extends EventKey<T>>(eventName: K): IReceiver<T>
    off<K extends EventKey<T>>(eventName: K, callback: EventListenerCallback<T[K]>): IReceiver<T>

    clear(): IReceiver<T>
}

export function useEvents<T extends EventMap>()
    : [IEmitter<T>, IReceiver<T>] {
    let handlers: { [K in keyof T]?: Array<EventListenerCallback<T[K]>> } = {}
    let handlersOnce: { [K in keyof T]?: Array<EventListenerCallback<T[K]>> } = {}

    return [{
        emit<K extends EventKey<T>>(
            eventName: K,
            data: T[K]
        ): IEmitter<T> {
            const eventHandlers = handlers[eventName]
            if (eventHandlers != null) {
                eventHandlers.forEach(l => l(data))
            }

            const eventHandlersOnce = handlersOnce[eventName]
            if (eventHandlersOnce != null) {
                eventHandlersOnce.forEach(l => l(data))
            }
            delete handlersOnce[eventName]

            return this
        }
    }, {
        on<K extends EventKey<T>>(
            eventName: K,
            callback: EventListenerCallback<T[K]>,
        ): IReceiver<T> {
            type ListenerList = Array<EventListenerCallback<T[K]>>

            if (!(eventName in handlers)) {
                handlers[eventName] = []
            }
            (handlers[eventName] as ListenerList).push(callback)

            return this
        },
        once<K extends EventKey<T>>(
            eventName: K,
            callback: EventListenerCallback<T[K]>,
        ): IReceiver<T> {
            type ListenerList = Array<EventListenerCallback<T[K]>>

            if (!(eventName in handlersOnce)) {
                handlersOnce[eventName] = []
            }
            (handlersOnce[eventName] as ListenerList).push(callback)

            return this
        },
        off<K extends EventKey<T>>(
            eventName: K,
            callback?: EventListenerCallback<T[K]>,
        ): IReceiver<T> {
            if (callback != null) {
                const eventHandlers = handlers[eventName]
                if (eventHandlers != null) {
                    const index = eventHandlers.indexOf(callback)
                    if (index >= 0) {
                        eventHandlers.splice(index, 1)
                    }
                }
                const eventHandlersOnce = handlersOnce[eventName]
                if (eventHandlersOnce != null) {
                    const index = eventHandlersOnce.indexOf(callback)
                    if (index >= 0) {
                        eventHandlersOnce.splice(index, 1)
                    }
                }
            } else {
                delete handlers[eventName]
                delete handlersOnce[eventName]
            }
            return this
        },
        clear(): IReceiver<T> {
            handlersOnce = {}
            handlers = {}
            return this
        }
    }]
}
