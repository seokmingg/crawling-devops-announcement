import { launchPuppeteer } from "./functions/puppeteerSetup";
import { saveToFile } from "./functions/saveToFile";
import { Scraper } from "./functions/crawlers/Scraper";
import { wantedScraper } from "./functions/crawlers/wantedScraper";
import { jumpitScraper } from "./functions/crawlers/jumpitScraper";
import { saraminScraper } from "./functions/crawlers/saraminScraper";
import { catchScraper } from "./functions/crawlers/catchScraper";
import { mergeJobListings } from "./functions/mergeJobs"; // ✅ 병합 함수 추가

const scrapers: Scraper[] = [wantedScraper, jumpitScraper, saraminScraper, catchScraper];

(async () => {
    const { browser, page } = await launchPuppeteer();
    const results: { site: string; status: string; count?: number; error?: any }[] = [];

    for (const scraper of scrapers) {
        try {
            console.log(`🔍 ${scraper.siteName} 크롤링 시작...`);
            const jobListings = await scraper.scrape(page);

            if (jobListings.length > 0) {
                await saveToFile(jobListings, scraper.siteName);
                console.log(`✅ ${scraper.siteName}: ${jobListings.length}개 크롤링 완료!`);
                results.push({ site: scraper.siteName, status: "✅ 성공", count: jobListings.length });
            } else {
                console.warn(`⚠️ ${scraper.siteName}: 크롤링된 데이터가 없습니다.`);
                results.push({ site: scraper.siteName, status: "⚠️ 데이터 없음", count: 0 });
            }
        } catch (error) {
            console.error(`❌ ${scraper.siteName}: 크롤링 실패! 오류:`, error);
            results.push({ site: scraper.siteName, status: "❌ 실패", error });
        }
    }

    console.log("\n📊 크롤링 결과 요약:");
    results.forEach((result) => {
        if (result.status === "✅ 성공") {
            console.log(`✅ ${result.site}: ${result.count}개 크롤링 완료`);
        } else if (result.status === "⚠️ 데이터 없음") {
            console.log(`⚠️ ${result.site}: 크롤링된 데이터가 없음`);
        } else {
            console.log(`❌ ${result.site}: 크롤링 실패`);
        }
    });

    console.log("\n🔄 크롤링 완료! 병합 프로세스 시작...");

    // ✅ 크롤링 완료 후 자동으로 병합 실행
    await mergeJobListings();

    console.log("\n🚀 모든 크롤링 및 병합 작업 완료!");
    await browser.close();
})();
