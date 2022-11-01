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

describe("useEvents", () => {
    it("should be a function", () => {
        expect(useEvents).to.be.a("function")
    })

    it("should return a pair of emitter and receiver", () => {
        const [emitter, receiver] = useEvents()
        expect(emitter).to.be.an("object")
        expect(receiver).to.be.an("object")
        expect(emitter.emit).to.be.a("function")
        expect(receiver.on).to.be.a("function")
        expect(receiver.once).to.be.a("function")
        expect(receiver.off).to.be.a("function")
        expect(receiver.clear).to.be.a("function")
    })

    it("should call listeners each time event events are emitted", () => {
        const [emitter, receiver] = useEvents()
        const callback = fake()
        receiver.on("event", callback)
        emitter.emit("event", "data")
        emitter.emit("event", "data")
        expect(callback).to.have.been.calledTwice
    })
    it("should call listeners with correct data", () => {
        const [emitter, receiver] = useEvents()
        const callback = fake()
        receiver.on("event", callback)
        emitter.emit("event", "data")
        expect(callback).to.have.been.calledWith("data")
    })

    it("should call one shot listeners once", () => {
        const [emitter, receiver] = useEvents()
        const callback = fake()
        receiver.once("event", callback)
        emitter.emit("event", "data")
        emitter.emit("event", "data")
        expect(callback).to.have.been.calledOnce
    })
    it("should call one shot listeners with correct data", () => {
        const [emitter, receiver] = useEvents()
        const callback = fake()
        receiver.on("event", callback)
        emitter.emit("event", "data")
        expect(callback).to.have.been.calledWith("data")
    })

    it("should remove listeners", () => {
        const [emitter, receiver] = useEvents()
        const callback = fake()
        receiver.on("event", callback)
        receiver.off("event", callback)
        emitter.emit("event", "data")
        expect(callback).to.not.have.been.called
    })

    it("should remove all listeners", () => {
        const [emitter, receiver] = useEvents()
        const callback1 = fake()
        const callback2 = fake()

        receiver
            .on("event1", callback1)
            .on("event2", callback2)
            .clear()
        emitter.emit("event", "data")

        expect(callback1).to.not.have.been.called
        expect(callback2).to.not.have.been.called
    })
})