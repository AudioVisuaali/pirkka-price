import puppeteer from "puppeteer";

import { toFailure, toSuccess, Try } from "./response";

export const beerQueries = {
  getPirkkaPrice: async (): Promise<Try<string, Error>> => {
    try {
      const browser = await puppeteer.launch({
        headless: true,
        args: ["--no-sandbox"],
      });
      const page = await browser.newPage();

      await page.setUserAgent(
        // eslint-disable-next-line max-len
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/105.0.0.0 Safari/537.36",
      );

      await page.goto(
        "https://www.k-ruoka.fi/haku?q=pirkka%20olut&tuote=pirkka-iii-olut-033l-45-tlk-si-6410405091260",
      );
      await page.content();
      await page.click("#kc-acceptAndHide");

      // Wait for suggest overlay to appear and click "show all results".
      const priceSelector = ".price-container";
      const priceElem = await page.$(priceSelector);
      const a = await page.evaluate((el) => el?.textContent, priceElem);

      await browser.close();

      if (!a) {
        return toFailure(new Error("No price found"));
      }

      return toSuccess(a);
    } catch (error) {
      return toFailure(error as Error);
    }
  },
};
