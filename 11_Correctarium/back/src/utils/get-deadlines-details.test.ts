import { Languages, MimeTypes } from "../models";
import * as deadlineCalculator from "./calculate-deadline";
import { getDeadlineDetails } from "./get-deadlines-details";

jest.mock("./calculate-deadline", () => ({
  calculateDeadline: jest.fn(),
}));

describe("getDeadlineDetails", () => {
  beforeEach(() => {
    (deadlineCalculator.calculateDeadline as jest.Mock).mockReset();
    (deadlineCalculator.calculateDeadline as jest.Mock).mockImplementation(
      () => new Date("2024-03-07T10:00:00Z")
    );
  });

  test("should calculate deadline correctly with mocked calculateDeadline", () => {
    const req = {
      language: Languages.ENGLISH,
      mimetype: MimeTypes.OTHER,
      count: 10000,
    };

    const result = getDeadlineDetails(req);

    expect(deadlineCalculator.calculateDeadline).toHaveBeenCalledWith(
      expect.any(Number)
    );

    expect(result.deadline).toBeGreaterThan(Date.now() / 1000);
  });
});
