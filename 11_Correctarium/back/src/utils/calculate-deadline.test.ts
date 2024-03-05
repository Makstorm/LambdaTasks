import { calculateDeadline } from "./calculate-deadline";

describe("calculateDeadline", () => {
  it("should calculate the correct deadline for a given task duration", () => {
    const taskDurationInMinutes = 240;

    const now = new Date("2024-03-05T01:09:55.070Z");
    const expectedDeadline = new Date(now);
    expectedDeadline.setHours(14, 0, 0, 0);

    const deadline = calculateDeadline(taskDurationInMinutes, now);

    expect(deadline.getFullYear()).toBe(expectedDeadline.getFullYear());
    expect(deadline.getMonth()).toBe(expectedDeadline.getMonth());
    expect(deadline.getDate()).toBe(expectedDeadline.getDate());
    expect(deadline.getHours()).toBe(expectedDeadline.getHours());
    expect(deadline.getMinutes()).toBe(expectedDeadline.getMinutes());
    expect(deadline.getSeconds()).toBe(expectedDeadline.getSeconds());
  });
});

describe("calculateDeadline", () => {
  it("should calculate the correct deadline for a given task duration", () => {
    const taskDurationInMinutes = 240;

    const now = new Date("2024-03-05T01:09:55.070Z");
    const expectedDeadline = new Date(now);
    expectedDeadline.setHours(14, 0, 0, 0);

    const deadline = calculateDeadline(taskDurationInMinutes, now);

    expect(deadline.getFullYear()).toBe(expectedDeadline.getFullYear());
    expect(deadline.getMonth()).toBe(expectedDeadline.getMonth());
    expect(deadline.getDate()).toBe(expectedDeadline.getDate());
    expect(deadline.getHours()).toBe(expectedDeadline.getHours());
    expect(deadline.getMinutes()).toBe(expectedDeadline.getMinutes());
    expect(deadline.getSeconds()).toBe(expectedDeadline.getSeconds());
  });
});
