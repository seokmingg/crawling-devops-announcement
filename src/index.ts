import { launchPuppeteer } from "./functions/puppeteerSetup";
import { saveToFile } from "./functions/saveToFile";
import { Scraper } from "./functions/crawlers/Scraper";
import { wantedScraper } from "./functions/crawlers/wantedScraper";
import { jumpitScraper } from "./functions/crawlers/jumpitScraper";

const scrapers: Scraper[] = [wantedScraper, jumpitScraper];

(async () => {
    const { browser, page } = await launchPuppeteer();

    for (const scraper of scrapers) {
        console.log(`🔍 ${scraper.siteName} 크롤링 시작...`);
        const jobListings = await scraper.scrape(page);
        await saveToFile(jobListings, scraper.siteName);
    }

    console.log("✅ 모든 사이트 크롤링 완료!");
    await browser.close();
})();
