import { Scraper } from "./Scraper";
import { autoScroll } from "../autoScroll";
import { JobListingDTO } from "../../dto/JobListing.dto";

export const wantedScraper: Scraper = {
    siteName: "wanted",
    url: "https://www.wanted.co.kr/search?query=devops&tab=position",
    scrape: async (page) => {
        console.log("🔄 원티드 크롤링 시작...");

        await page.goto(wantedScraper.url, { waitUntil: "networkidle2" });

        // ✅ 무한 스크롤 실행 (스크롤 횟수 증가)
        await autoScroll(page, 150);

        // ✅ 모든 데이터가 로드되도록 5초 추가 대기
        await new Promise(resolve => setTimeout(resolve, 5000));

        // ✅ 모든 공고 데이터 크롤링
        const jobListings: JobListingDTO[] = await page.evaluate(() => {
            return Array.from(document.querySelectorAll(".JobCard_container__REty8")).map(jobCard => {
                const titleElement = jobCard.querySelector(".JobCard_title__HBpZf");
                const companyElement = jobCard.querySelector(".JobCard_companyName__N1YrF");
                const linkElement = jobCard.querySelector("a");

                return {
                    title: titleElement ? titleElement.textContent?.trim() || "제목 없음" : "제목 없음",
                    company: companyElement ? companyElement.textContent?.trim() || "회사 정보 없음" : "회사 정보 없음",
                    link: linkElement ? `https://www.wanted.co.kr${linkElement.getAttribute("href")}` : "링크 없음",
                };
            });
        });

        console.log(`✅ 원티드에서 ${jobListings.length}개 공고 크롤링 완료!`);
        return jobListings;
    }
};
