import { Scraper } from "./Scraper";
import { JobListingDTO } from "../../dto/JobListing.dto";

export const saraminScraper: Scraper = {
    siteName: "saramin",
    url: "https://www.saramin.co.kr/zf_user/search/recruit?search_area=main&search_done=y&search_optional_item=n&searchType=search&searchword=devops&recruitPage=1&recruitSort=relation&recruitPageCount=100",
// url:'naver.com',
    scrape: async (page) => {
        console.log("🔄 사람인 크롤링 시작...");

        let jobListings: JobListingDTO[] = [];

        // ✅ 최대 2페이지 크롤링
        for (let pageNum = 1; pageNum <= 2; pageNum++) {
            console.log(`🔄 사람인 - ${pageNum} 페이지 크롤링 중...`);

            // ✅ 페이지 이동
            const pageUrl = `https://www.saramin.co.kr/zf_user/search/recruit?search_area=main&search_done=y&search_optional_item=n&searchType=search&searchword=devops&recruitPage=${pageNum}&recruitSort=relation&recruitPageCount=100`;
            // const pageUrl =`naver.com`;
            await page.goto(pageUrl, { waitUntil: "networkidle2" });

            // ✅ 특정 요소가 로드될 때까지 대기
            await page.waitForSelector(".item_recruit", { timeout: 10000 });

            // ✅ 현재 페이지의 공고 데이터 가져오기
            const newJobs = await page.evaluate(() => {
                return Array.from(document.querySelectorAll(".item_recruit")).map(jobCard => {
                    const titleElement = jobCard.querySelector("h2.job_tit a");
                    const companyElement = jobCard.querySelector("strong.corp_name a");
                    const linkElement = jobCard.querySelector("h2.job_tit a");

                    return {
                        title: titleElement ? titleElement.textContent?.trim().replace(/<[^>]*>/g, "") || "제목 없음" : "제목 없음",
                        company: companyElement ? companyElement.textContent?.trim() || "회사 정보 없음" : "회사 정보 없음",
                        link: linkElement ? `https://www.saramin.co.kr${linkElement.getAttribute("href")}` : "링크 없음",
                    };
                });
            });

            // ✅ 새로운 데이터를 기존 배열에 추가
            jobListings = jobListings.concat(newJobs);

            // ✅ 2초 대기 후 다음 페이지 이동 (서버 부담 방지)
            await new Promise(resolve => setTimeout(resolve, 2000));
        }

        console.log(`✅ 사람인에서 ${jobListings.length}개 공고 크롤링 완료!`);
        return jobListings;
    }
};
