import { getPrice } from "./get-price";
import { CorrectariumRequestBody, Languages, MimeTypes } from "../models";

describe("getPrice", () => {
  it("calculates the correct price for English language and non-other mimeType", () => {
    const request: CorrectariumRequestBody = {
      language: Languages.ENGLISH,
      mimetype: MimeTypes.DOC,
      count: 1000,
    };
    const price = getPrice(request);
    expect(price).toBeCloseTo(120);
  });

  it('applies price modifier for "other" mimeType', () => {
    const request: CorrectariumRequestBody = {
      language: Languages.ENGLISH,
      mimetype: MimeTypes.OTHER,
      count: 1000,
    };
    const price = getPrice(request);
    expect(price).toBeCloseTo(144);
  });

  it("ensures minimum cost is applied if calculated cost is below minimum", () => {
    const request: CorrectariumRequestBody = {
      language: Languages.ENGLISH,
      mimetype: MimeTypes.DOC,
      count: 100,
    };
    const price = getPrice(request);
    expect(price).toBe(50);
  });
});
