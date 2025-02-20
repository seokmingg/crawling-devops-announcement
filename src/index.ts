import { launchPuppeteer } from "./utils/puppeteerSetup";
import { saveToFile } from "./utils/saveToFile";
import { mergeJobListings } from "./utils/mergeJobs";
import { starMergeCompany } from "./utils/starMergeCompany";
import { createExcel } from "./utils/convertJsonToExcel";
import {createAutoScrollScraper} from "./crawlers/createAutoScrollScraper";
import {createPaginationScraper} from "./crawlers/createPaginationScraper";

// ✅ 검색할 키워드 설정
const searchKeyword = "devops";

// ✅ createScraper 함수를 사용하여 스크래퍼 생성
const scrapers = [
    createAutoScrollScraper("wanted", searchKeyword),
    createAutoScrollScraper("jumpit", searchKeyword),
    createPaginationScraper("jobkorea", searchKeyword, 5),
    createPaginationScraper("saramin", searchKeyword, 2),
    createPaginationScraper("catch", searchKeyword, 2),

];

(async () => {
    const { browser, page } = await launchPuppeteer();
    const results: { site: string; status: string; count?: number; error?: any }[] = [];

    for (const scraper of scrapers) {
        try {
            console.log(`🔍 ${scraper.siteName} 크롤링 시작... 키워드: "${searchKeyword}"`);

            // ✅ scraper.scrape(page) 호출
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



    await browser.close();
    console.log("\n📊 크롤링 결과 요약:");
    results.forEach(({ site, status, count }) => {
        if (status === "✅ 성공") {
            console.log(`✅ ${site}: ${count}개 크롤링 완료`);
        } else if (status === "⚠️ 데이터 없음") {
            console.log(`⚠️ ${site}: 크롤링된 데이터가 없음`);
        } else {
            console.log(`❌ ${site}: 크롤링 실패`);
        }
    });

    await browser.close();

    console.log("\n🔄 크롤링 완료! 병합 프로세스 시작...");
    await mergeJobListings(searchKeyword);
    console.log("\n🚀 병합 작업 완료!");

    console.log("\n⭐ 팀블라인드 별점·리뷰 추가 시작...");
    await starMergeCompany();
    console.log("\n✅ 팀블라인드 별점·리뷰까지 모두 완료!");

    console.log("\n💿 엑셀 변환 시작...");
    createExcel();
    console.log("✅ 엑셀 변환 완료!");
})();
