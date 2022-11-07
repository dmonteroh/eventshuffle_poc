"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vitest_1 = require("vitest");
const controllers_1 = require("../../src/eventshuffle/controllers");
(0, vitest_1.describe)("Testing Get Event", () => {
    (0, vitest_1.test)("ID -1 should result in error", () => {
        (0, vitest_1.expect)((0, controllers_1.GetEventID)("-1")).rejects.toThrowError();
    });
    (0, vitest_1.test)("Empty ID should result in error", () => {
        (0, vitest_1.expect)((0, controllers_1.GetEventID)("")).rejects.toThrowError();
    });
    (0, vitest_1.test)("Object ID should result in error", () => {
        (0, vitest_1.expect)((0, controllers_1.GetEventID)("507f1f77bcf86cd799439011")).rejects.toThrowError();
    });
});
(0, vitest_1.describe)("Testing Event List", () => {
    (0, vitest_1.test)("Event List should be an array", () => {
        (0, vitest_1.expect)((0, controllers_1.eventList)()).resolves;
    });
});
(0, vitest_1.describe)("Testing Vote creation", () => {
    (0, vitest_1.test)("Can't create vote with empty name", () => {
        (0, vitest_1.expect)((0, controllers_1.NewVote)([new Date("2014-01-01"), new Date("2014-01-02")], "")).rejects.toThrowError();
    });
    (0, vitest_1.test)("Can't create vote with empty date list", () => {
        (0, vitest_1.expect)((0, controllers_1.NewVote)([], "Test")).rejects.toThrowError();
    });
});
(0, vitest_1.describe)("Testing Vote to EventVotes transformation", () => {
    (0, vitest_1.test)("Expect result to match object", () => {
        const vote = { name: "Test", votes: [new Date("2014-01-01"), new Date("2014-01-02")] };
        const eventVotes = [{ date: new Date("2014-01-01"), people: ["Test"] }, { date: new Date("2014-01-02"), people: ["Test"] }];
        (0, vitest_1.expect)((0, controllers_1.VoteToEventVote)(vote)).toMatchObject(eventVotes);
    });
});
