import { describe, expect, it } from "vitest";
import { offersFor } from "./PartnerBlock";
import { PARTNER_OFFERS, ADS, LEADS_ENABLED } from "./config";
import type { PartnerOffer } from "./types";

const offer = (o: Partial<PartnerOffer>): PartnerOffer => ({
  id: "x",
  title: "t",
  advertiser: "a",
  url: "https://example.org",
  erid: "abc",
  categories: ["kvartiry.steny"],
  ...o,
});

describe("monetization", () => {
  it("ships with no partner offers, ads or lead forms enabled", () => {
    expect(PARTNER_OFFERS).toEqual([]);
    expect(Object.values(ADS).some(Boolean)).toBe(false);
    expect(LEADS_ENABLED).toBe(false);
  });
  it("never shows an offer without an erid marking", () => {
    expect(offersFor({ categories: ["kvartiry.steny"] }, [offer({ erid: "" })])).toHaveLength(0);
    expect(offersFor({ categories: ["kvartiry.steny"] }, [offer({})])).toHaveLength(1);
  });
  it("hides expired offers", () => {
    expect(
      offersFor({ categories: ["kvartiry.steny"] }, [offer({ until: "2026-01-01" })], "2026-11-03"),
    ).toHaveLength(0);
  });
});
