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
        const [emitter, receiver] = useEvents()
        expect(emitter).to.be.an("object")
        expect(receiver).to.be.an("object")
    })
})

describe("IEmitter", () => {
    it("should have a method emit", () => {
        const [emitter] = useEvents()
        expect(emitter.emit).to.be.a("function")
    })

    it("should return itself when emit", () => {
        const [emitter] = useEvents()
        expect(emitter.emit("test", "test")).to.equal(emitter)
    })

    it("should accept void event type", () => {
        const [emitter] = useEvents<{
            test: void
        }>()
        expect(emitter.emit("test")).to.equal(emitter)
        expect(emitter.emit("test", undefined)).to.equal(emitter)
    })
})

describe("IReceiver", () => {
    describe("#on", () => {
        it("should return a function", () => {
            const [, receiver] = useEvents()
            expect(receiver.on("test", noop)).to.be.a("function")
        })

        it("should call the event callback with the event data", () => {
            const [emitter, receiver] = useEvents()
            const callback = fake()
            receiver.on("test", callback)
            emitter.emit("test", "test")
            expect(callback).to.have.been.calledWith("test")
        })

        it("should call the event callback each time the event is emitted", () => {
            const [emitter, receiver] = useEvents()
            const callback = fake()
            receiver.on("test", callback)
            emitter.emit("test", "test")
            emitter.emit("test", "test")
            expect(callback).to.have.been.calledTwice
        })

        it("shoud unsubscribe the event when the returned function is called", () => {
            const [emitter, receiver] = useEvents()
            const callback = fake()
            const unsubscribe = receiver.on("test", callback)
            unsubscribe()
            emitter.emit("test", "test")
            expect(callback).to.not.have.been.called
        })
    })

    describe("#once", () => {
        it("should return a function", () => {
            const [, receiver] = useEvents()
            expect(receiver.once("test", noop)).to.be.a("function")
        })

        it("should call the event callback with the event data", () => {
            const [emitter, receiver] = useEvents()
            const callback = fake()
            receiver.once("test", callback)
            emitter.emit("test", "test")
            expect(callback).to.have.been.calledWith("test")
        })

        it("should call the event callback only once", () => {
            const [emitter, receiver] = useEvents()
            const callback = fake()
            receiver.once("test", callback)
            emitter.emit("test", "test")
            emitter.emit("test", "test")
            expect(callback).to.have.been.calledOnce
        })

        it("shoud unsubscribe the event when the returned function is called", () => {
            const [emitter, receiver] = useEvents()
            const callback = fake()
            const unsubscribe = receiver.once("test", callback)
            unsubscribe()
            emitter.emit("test", "test")
            expect(callback).to.not.have.been.called
        })
    })

    describe("#off", () => {
        it("should unsubscribe a given listener to the event", () => {
            const [emitter, receiver] = useEvents()
            const callback1 = fake()
            const callback2 = fake()
            receiver.on("test", callback1)
            receiver.on("test", callback2)
            receiver.off("test", callback1)
            emitter.emit("test", "test")
            expect(callback1).to.not.have.been.called
            expect(callback2).to.have.been.called
        })

        it("should unsubscribe all listeners to the event if no listener is given", () => {
            const [emitter, receiver] = useEvents()
            const callback1 = fake()
            const callback2 = fake()
            receiver.on("test", callback1)
            receiver.on("test", callback2)
            receiver.off("test")
            emitter.emit("test", "test")
            expect(callback1).to.not.have.been.called
            expect(callback2).to.not.have.been.called
        })

        it("should unsubscribe all listeners to all events if no event is given", () => {
            const [emitter, receiver] = useEvents()
            const callback1 = fake()
            const callback2 = fake()
            receiver.on("test1", callback1)
            receiver.on("test2", callback2)
            receiver.off()
            emitter.emit("test1", "test")
            emitter.emit("test2", "test")
            expect(callback1).to.not.have.been.called
            expect(callback2).to.not.have.been.called
        })
    })
})