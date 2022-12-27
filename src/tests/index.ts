import chai from "chai"
import simonChai from "sinon-chai"

import {
    expect,
} from "chai"

import {
    fake,
} from "sinon"

import {
    useEvents,
} from "../lib"

chai.use(simonChai)

function noop() {
    // noop
}

describe("useEvents", () => {
    it("should be a function", () => {
        expect(useEvents).to.be.a("function")
    })

    it("should return a pair of emitter and receiver", () => {
        const [emit, receiver] = useEvents()
        expect(emit).to.be.a("function")
        expect(receiver).to.be.an("object")
    })
})

describe("IEmitter", () => {
    it("should have a method emit", () => {
        const [emit] = useEvents()
        expect(emit).to.be.a("function")
    })

    it("should accept void event type", () => {
        const [emit] = useEvents<{
            test: void
        }>()
        expect(emit("test")).to.be.undefined
        expect(emit("test", undefined)).to.be.undefined
    })
})

describe("IReceiver", () => {
    describe("#on", () => {
        it("should return a function", () => {
            const [, receiver] = useEvents()
            expect(receiver.on("test", noop)).to.be.a("function")
        })

        it("should call the event callback with the event data", () => {
            const [emit, receiver] = useEvents()
            const callback = fake()
            receiver.on("test", callback)
            emit("test", "test")
            expect(callback).to.have.been.calledWith("test")
        })

        it("should call the event callback each time the event is emitted", () => {
            const [emit, receiver] = useEvents()
            const callback = fake()
            receiver.on("test", callback)
            emit("test", "test")
            emit("test", "test")
            expect(callback).to.have.been.calledTwice
        })

        it("shoud unsubscribe the event when the returned function is called", () => {
            const [emit, receiver] = useEvents()
            const callback = fake()
            const unsubscribe = receiver.on("test", callback)
            unsubscribe()
            emit("test", "test")
            expect(callback).to.not.have.been.called
        })
    })

    describe("#once", () => {
        it("should return a function", () => {
            const [, receiver] = useEvents()
            expect(receiver.once("test", noop)).to.be.a("function")
        })

        it("should call the event callback with the event data", () => {
            const [emit, receiver] = useEvents()
            const callback = fake()
            receiver.once("test", callback)
            emit("test", "test")
            expect(callback).to.have.been.calledWith("test")
        })

        it("should call the event callback only once", () => {
            const [emit, receiver] = useEvents()
            const callback = fake()
            receiver.once("test", callback)
            emit("test", "test")
            emit("test", "test")
            expect(callback).to.have.been.calledOnce
        })

        it("shoud unsubscribe the event when the returned function is called", () => {
            const [emit, receiver] = useEvents()
            const callback = fake()
            const unsubscribe = receiver.once("test", callback)
            unsubscribe()
            emit("test", "test")
            expect(callback).to.not.have.been.called
        })
    })

    describe("#off", () => {
        it("should unsubscribe a given listener to the event", () => {
            const [emit, receiver] = useEvents()
            const callback1 = fake()
            const callback2 = fake()
            receiver.on("test", callback1)
            receiver.on("test", callback2)
            receiver.off("test", callback1)
            emit("test", "test")
            expect(callback1).to.not.have.been.called
            expect(callback2).to.have.been.called
        })

        it("should unsubscribe all listeners to the event if no listener is given", () => {
            const [emit, receiver] = useEvents()
            const callback1 = fake()
            const callback2 = fake()
            receiver.on("test", callback1)
            receiver.on("test", callback2)
            receiver.off("test")
            emit("test", "test")
            expect(callback1).to.not.have.been.called
            expect(callback2).to.not.have.been.called
        })

        it("should unsubscribe all listeners to all events if no event is given", () => {
            const [emit, receiver] = useEvents()
            const callback1 = fake()
            const callback2 = fake()
            receiver.on("test1", callback1)
            receiver.on("test2", callback2)
            receiver.off()
            emit("test1", "test")
            emit("test2", "test")
            expect(callback1).to.not.have.been.called
            expect(callback2).to.not.have.been.called
        })
    })

    describe("#connect", () => {
        it("should connect a mapping of events to handlers", () => {
            const [emit, receiver] = useEvents()
            const callback1 = fake()
            const callback2 = fake()
            receiver.connect({
                test1: callback1,
                test2: callback2,
            })
            emit("test1", "test1")
            emit("test2", "test2")
            expect(callback1).to.have.been.calledWith("test1")
            expect(callback2).to.have.been.calledWith("test2")
        })
    })

    describe("#disconnect", () => {
        it("should disconnect a mapping of events to handlers", () => {
            const [emit, receiver] = useEvents()
            const callback1 = fake()
            const callback2 = fake()
            receiver.connect({
                test1: callback1,
                test2: callback2,
            })
            receiver.disconnect({
                test1: callback1,
                test2: callback2,
            })
            emit("test1", "test1")
            emit("test2", "test2")
            expect(callback1).to.not.have.been.called
            expect(callback2).to.not.have.been.called
        })
    })
})
