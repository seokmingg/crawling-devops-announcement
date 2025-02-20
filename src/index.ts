import { launchPuppeteer } from "./config/puppeteerSetup";
import { saveToFile } from "./utils/saveToFile";
import { mergeJobListings } from "./utils/mergeJobs";
import { starMergeCompany } from "./utils/starMergeCompany";
import { createExcel } from "./utils/convertJsonToExcel";
import { AutoScrollScraper } from "./crawlers/AutoScrollScraper";
import { PaginationScraper } from "./crawlers/PaginationScraper";

// ✅ 검색할 키워드 설정
const searchKeyword = "devops";

// ✅ 스크래퍼 객체 생성
const scrapers = [
    new AutoScrollScraper("wanted", searchKeyword),
    new AutoScrollScraper("jumpit", searchKeyword),
    new PaginationScraper("jobkorea", searchKeyword, 5),
    new PaginationScraper("saramin", searchKeyword, 2),
    new PaginationScraper("catch", searchKeyword, 2),
];

(async () => {
    const { browser, page } = await launchPuppeteer();
    const results: { site: string; status: string; count?: number; error?: any }[] = [];







    try {
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


    }


    /*
    * Promise.allSettled를 사용하여 병렬 크롤링
    * 안됨 무한스크롤 방식 사이트끼리 겹쳐서 스크롤오류때문에 크롤링이안됨
    * */
    // try {
    //     console.log("🚀 병렬 크롤링 시작...");
    //
    //     // ✅ 병렬 실행 (Promise.all 사용)
    //     const scrapeResults = await Promise.allSettled(
    //         scrapers.map(async (scraper) => {
    //             const page = await browser.newPage(); // ✅ 개별 페이지 생성
    //             try {
    //                 console.log(`🔍 ${scraper.siteName} 크롤링 시작... 키워드: "${searchKeyword}"`);
    //                 const jobListings = await scraper.scrape(page);
    //                 await page.close(); // ✅ 크롤링 끝나면 개별 페이지 닫기
    //
    //                 if (jobListings.length > 0) {
    //                     await saveToFile(jobListings, scraper.siteName);
    //                     console.log(`✅ ${scraper.siteName}: ${jobListings.length}개 크롤링 완료!`);
    //                     return { site: scraper.siteName, status: "✅ 성공", count: jobListings.length };
    //                 } else {
    //                     console.warn(`⚠️ ${scraper.siteName}: 크롤링된 데이터가 없습니다.`);
    //                     return { site: scraper.siteName, status: "⚠️ 데이터 없음", count: 0 };
    //                 }
    //             } catch (error) {
    //                 console.error(`❌ ${scraper.siteName}: 크롤링 실패! 오류:`, error);
    //                 return { site: scraper.siteName, status: "❌ 실패", error };
    //             }
    //         })
    //     );
    //
    //     // ✅ 결과 처리
    //     scrapeResults.forEach((result) => {
    //         if (result.status === "fulfilled") {
    //             results.push(result.value);
    //         } else {
    //             console.error(`❌ 오류 발생: ${result.reason}`);
    //         }
    //     });
    // }




    finally {
        // ✅ browser.close()는 한 번만 호출
        await browser.close();
    }

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