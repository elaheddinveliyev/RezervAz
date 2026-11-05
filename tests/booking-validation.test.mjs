import test from "node:test";
import assert from "node:assert/strict";
import { isAllowedPublicDuration, isValidDate, isValidStartTime } from "../src/lib/booking-validation.ts";

test("dates reject invalid calendar values and malformed input", () => {
  for (const day of ["2026-02-28", "2028-02-29"]) assert.equal(isValidDate(day), true);
  for (const day of ["2026-02-29", "2026-13-01", "tomorrow", ""]) assert.equal(isValidDate(day), false);
});

test("times must be strict HH:mm within the day", () => {
  for (const time of ["00:00", "09:30", "23:59"]) assert.equal(isValidStartTime(time), true);
  for (const time of ["24:00", "9:00", "12:60", "01:00:00", ""]) assert.equal(isValidStartTime(time), false);
});

test("public reservation duration is 1-8 full hours", () => {
  for (const value of [60, 120, 480]) assert.equal(isAllowedPublicDuration(value), true);
  for (const value of [0, -60, 30, 90, 481, 540, NaN, Infinity]) assert.equal(isAllowedPublicDuration(value), false);
});
