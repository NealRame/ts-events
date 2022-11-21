export type TEventListenerCallback<EventType> = (event: EventType) => void
export type TEventListenerUnsubscribeCallback = () => void

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type EventMap = Record<string, any>
export type EventKey<T extends EventMap> = string & keyof T

export interface IEmitter<T extends EventMap> {
    emit<K extends EventKey<T>>(eventName: K, ...[eventData]: void extends T[K] ? [void] : [T[K]]): IEmitter<T>
    emit<K extends EventKey<T>>(eventName: K, eventData: T[K]): IEmitter<T>
}

export interface IReceiver<T extends EventMap> {
    on<K extends EventKey<T>>(eventName: K, callback: TEventListenerCallback<T[K]>): TEventListenerUnsubscribeCallback
    once<K extends EventKey<T>>(eventName: K, callback: TEventListenerCallback<T[K]>): TEventListenerUnsubscribeCallback

    off(): void
    off<K extends EventKey<T>>(eventName: K): void
    off<K extends EventKey<T>>(eventName: K, callback: TEventListenerCallback<T[K]>): void
}

export function useEvents<T extends EventMap>()
    : [IEmitter<T>, IReceiver<T>] {
    let handlers: { [K in keyof T]?: Array<TEventListenerCallback<T[K]>> } = {}
    let handlersOnce: { [K in keyof T]?: Array<TEventListenerCallback<T[K]>> } = {}

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
            callback: TEventListenerCallback<T[K]>,
        ): TEventListenerUnsubscribeCallback {
            type ListenerList = Array<TEventListenerCallback<T[K]>>

            if (!(eventName in handlers)) {
                handlers[eventName] = []
            }
            (handlers[eventName] as ListenerList).push(callback)

            return () => this.off(eventName, callback)
        },
        once<K extends EventKey<T>>(
            eventName: K,
            callback: TEventListenerCallback<T[K]>,
        ): TEventListenerUnsubscribeCallback {
            type ListenerList = Array<TEventListenerCallback<T[K]>>

            if (!(eventName in handlersOnce)) {
                handlersOnce[eventName] = []
            }
            (handlersOnce[eventName] as ListenerList).push(callback)

            return () => this.off(eventName, callback)
        },
        off<K extends EventKey<T>>(
            eventName?: K,
            callback?: TEventListenerCallback<T[K]>,
        ) {
            if (eventName == null) {
                handlers = {}
                handlersOnce = {}
            } else if (callback == null) {
                delete handlers[eventName]
                delete handlersOnce[eventName]
            } else {
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
            }
        }
    }]
}
