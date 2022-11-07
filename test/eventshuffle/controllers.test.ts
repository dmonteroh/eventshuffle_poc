import { describe, expect, test } from 'vitest'
import { IVote, IEventVotes } from '../../src/eventshuffle/models'
import { GetEventID, eventList, NewVote, VoteToEventVote } from "../../src/eventshuffle/controllers"

describe("Testing Get Event", () => {
    test("ID -1 should result in error", () => {
        expect(GetEventID("-1")).rejects.toThrowError()
    })
    test("Empty ID should result in error", () => {
        expect(GetEventID("")).rejects.toThrowError()
    })
    test("Object ID should result in error", () => {
        expect(GetEventID("507f1f77bcf86cd799439011")).rejects.toThrowError()
    })
})

describe("Testing Event List", () => {
    test("Event List should be an array", () => {
        expect(eventList()).resolves
    })
})

describe("Testing Vote creation", () => {
    test("Can't create vote with empty name", () => {
        expect(NewVote([new Date("2014-01-01"), new Date("2014-01-02")], "")).rejects.toThrowError()
    })
    test("Can't create vote with empty date list", () => {
        expect(NewVote([], "Test")).rejects.toThrowError()
    })
})

describe("Testing Vote to EventVotes transformation", () => {
    test("Expect result to match object", () => {
        const vote: IVote = {name: "Test", votes: [new Date("2014-01-01"), new Date("2014-01-02")]}
        const eventVotes: IEventVotes[] = [{date: new Date("2014-01-01"), people: ["Test"]}, {date: new Date("2014-01-02"), people: ["Test"]}]
        expect(VoteToEventVote(vote)).toMatchObject(eventVotes);
    })
})

