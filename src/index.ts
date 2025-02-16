import { launchPuppeteer } from "./functions/puppeteerSetup";
import { saveToFile } from "./functions/saveToFile";
import { Scraper } from "./functions/crawlers/Scraper";
import { wantedScraper } from "./functions/crawlers/wantedScraper";
import { jumpitScraper } from "./functions/crawlers/jumpitScraper";
import { saraminScraper } from "./functions/crawlers/saraminScraper";
import { catchScraper } from "./functions/crawlers/catchScraper";
import {jobkoreaScraper} from "./functions/crawlers/jobkoreaScraper";
import { mergeJobListings } from "./functions/mergeJobs"; // ✅ 병합 함수 추가
import { starMergeCompany } from "./functions/starMergeCompany";


const scrapers: Scraper[] = [wantedScraper, jumpitScraper, saraminScraper, catchScraper,jobkoreaScraper];

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


    // 2) 크롤링 브라우저 종료
    await browser.close();

    // 3) 병합 실행
    console.log("\n🔄 크롤링 완료! 병합 프로세스 시작...");
    await mergeJobListings();
    console.log("\n🚀 병합 작업 완료!");

    // 4) 병합 후 자동으로 별점·리뷰 추가
    console.log("\n⭐ 팀블라인드 별점·리뷰 추가 시작...");
    await starMergeCompany();
    console.log("\n✅ 팀블라인드 별점·리뷰까지 모두 완료!");

})();
