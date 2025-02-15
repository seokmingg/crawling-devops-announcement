import { Scraper } from "./Scraper";
import { JobListingDTO } from "../../dto/JobListing.dto";

export const catchScraper: Scraper = {
    siteName: "catch",
    url: "https://www.catch.co.kr/Search/SearchDetail?CurrentPage=1&Keyword=devops&Menu=2",
    scrape: async (page) => {
        console.log("🔄 캐치(Catch) 크롤링 시작...");

        let jobListings: JobListingDTO[] = [];

        // ✅ 최대 2페이지 크롤링
        for (let pageNum = 1; pageNum <= 2; pageNum++) {
            console.log(`🔄 캐치 - ${pageNum} 페이지 크롤링 중...`);

            // ✅ 페이지 이동
            const pageUrl = `https://www.catch.co.kr/Search/SearchDetail?CurrentPage=${pageNum}&Keyword=devops&Menu=2`;
            await page.goto(pageUrl, { waitUntil: "networkidle2" });

            // ✅ 특정 요소가 로드될 때까지 대기
            await page.waitForSelector("li .txt", { timeout: 10000 });

            // ✅ 현재 페이지의 공고 데이터 가져오기
            const newJobs = await page.evaluate(() => {
                return Array.from(document.querySelectorAll("li")).map(jobCard => {
                    const companyElement = jobCard.querySelector("p.name a");
                    const categoryElement = jobCard.querySelector("p.biz");
                    const linkElement = jobCard.querySelector("p.name a");

                    return {
                        title: categoryElement ? categoryElement.textContent?.trim() || "직무 정보 없음" : "직무 정보 없음",
                        company: companyElement ? companyElement.textContent?.trim() || "회사 정보 없음" : "회사 정보 없음",
                        link: linkElement ? `https://www.catch.co.kr${linkElement.getAttribute("href")}` : "링크 없음",
                    };
                });
            });

            // ✅ 새로운 데이터를 기존 배열에 추가
            jobListings = jobListings.concat(newJobs);

            // ✅ 2초 대기 후 다음 페이지 이동 (서버 부담 방지)
            await new Promise(resolve => setTimeout(resolve, 2000));
        }

        console.log(`✅ 캐치에서 ${jobListings.length}개 공고 크롤링 완료!`);
        return jobListings;
    }
};
