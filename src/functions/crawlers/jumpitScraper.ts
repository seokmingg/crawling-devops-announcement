import { Scraper } from "./Scraper";
import { autoScroll } from "../autoScroll";
import { JobListingDTO } from "../../dto/JobListing.dto";

export const jumpitScraper: Scraper = {
    siteName: "jumpit",
    url: "https://www.jumpit.co.kr/search?keyword=devops",
    scrape: async (page) => {
        console.log("🔄 점핏 크롤링 시작...");

        await page.goto(jumpitScraper.url, { waitUntil: "networkidle2" });

        // ✅ 무한 스크롤 실행 (스크롤 횟수 증가)
        await autoScroll(page, 150);

        // ✅ 모든 데이터가 로드되도록 5초 추가 대기
        await new Promise(resolve => setTimeout(resolve, 5000));

        // ✅ 채용 공고 데이터 크롤링
        const jobListings: JobListingDTO[] = await page.evaluate(() => {
            return Array.from(document.querySelectorAll(".sc-d609d44f-0")).map(jobCard => {
                const titleElement = jobCard.querySelector("h2.position_card_info_title");
                const companyElement = jobCard.querySelector(".sc-15ba67b8-0 div div");
                const linkElement = jobCard.querySelector("a");

                return {
                    title: titleElement ? titleElement.textContent?.trim() || "제목 없음" : "제목 없음",
                    company: companyElement ? companyElement.textContent?.trim() || "회사 정보 없음" : "회사 정보 없음",
                    link: linkElement ? `https://www.jumpit.co.kr${linkElement.getAttribute("href")}` : "링크 없음",
                };
            });
        });

        console.log(`✅ 점핏에서 ${jobListings.length}개 공고 크롤링 완료!`);
        return jobListings;
    }
};
