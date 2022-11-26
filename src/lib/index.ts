export type TEventListenerCallback<EventType> = (event: EventType) => void
export type TEventListenerUnsubscribeCallback = () => void

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type TEventMap = Record<string, any>
export type TEventKey<T extends TEventMap> = string & keyof T

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type TDefaultEventMap = Record<string, any>

export type TEmitter<T extends TEventMap = TDefaultEventMap> =
    (<K extends TEventKey<T>>(eventName: K, ...[eventData]: void extends T[K] ? [void] : [T[K]]) => void) &
    (<K extends TEventKey<T>>(eventName: K, eventData: T[K]) => void)

export interface IReceiver<T extends TEventMap = TDefaultEventMap> {
    on<K extends TEventKey<T>>(
        eventName: K,
        callback: TEventListenerCallback<T[K]>,
    ): TEventListenerUnsubscribeCallback

    once<K extends TEventKey<T>>(
        eventName: K,
        callback: TEventListenerCallback<T[K]>,
    ): TEventListenerUnsubscribeCallback

    off(): void
    off<K extends TEventKey<T>>(eventName: K): void
    off<K extends TEventKey<T>>(
        eventName: K,
        callback: TEventListenerCallback<T[K]>,
    ): void
}

export function useEvents<T extends TEventMap = TDefaultEventMap>()
    : [TEmitter<T>, IReceiver<T>] {
    let handlers: { [K in keyof T]?: Array<TEventListenerCallback<T[K]>> } = {}
    let handlersOnce: { [K in keyof T]?: Array<TEventListenerCallback<T[K]>> } = {}

    const emit = <K extends TEventKey<T>>(eventName: K, eventData: T[K]) => {
        const eventHandlers = handlers[eventName]
        if (eventHandlers != null) {
            eventHandlers.forEach(l => l(eventData))
        }

        const eventHandlersOnce = handlersOnce[eventName]
        if (eventHandlersOnce != null) {
            eventHandlersOnce.forEach(l => l(eventData))
        }

        delete handlersOnce[eventName]
    }

    const off = <K extends TEventKey<T>>(
        eventName?: K,
        callback?: TEventListenerCallback<T[K]>,
    ) => {
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

    const on = <K extends TEventKey<T>>(
        eventName: K,
        callback: TEventListenerCallback<T[K]>,
    ): TEventListenerUnsubscribeCallback => {
        type ListenerList = Array<TEventListenerCallback<T[K]>>

        if (!(eventName in handlers)) {
            handlers[eventName] = []
        }
        (handlers[eventName] as ListenerList).push(callback)

        return () => off(eventName, callback)
    }

    const once = <K extends TEventKey<T>>(
        eventName: K,
        callback: TEventListenerCallback<T[K]>,
    ): TEventListenerUnsubscribeCallback => {
        type ListenerList = Array<TEventListenerCallback<T[K]>>

        if (!(eventName in handlersOnce)) {
            handlersOnce[eventName] = []
        }
        (handlersOnce[eventName] as ListenerList).push(callback)

        return () => off(eventName, callback)
    }

    return [emit, { off, on, once }]
}
