import { Scraper } from "./Scraper";
import { JobListingDTO } from "../../dto/JobListing.dto";

export const jobkoreaScraper: Scraper = {
    siteName: "jobkorea",
    url: "https://www.jobkorea.co.kr/Search/?stext=devops&FeatureCode=TOT&tabType=recruit&Page_No=1",

    scrape: async (page) => {
        console.log("🔄 JobKorea 크롤링 시작...");

        let jobListings: JobListingDTO[] = [];

        // ✅ 최대 5페이지 크롤링
        for (let pageNum = 1; pageNum <= 5; pageNum++) {
            console.log(`🔄 JobKorea - ${pageNum} 페이지 크롤링 중...`);

            // ✅ 페이지 이동
            const pageUrl = `https://www.jobkorea.co.kr/Search/?stext=devops&FeatureCode=TOT&tabType=recruit&Page_No=${pageNum}`;
            await page.goto(pageUrl, { waitUntil: "networkidle2" });

            // ✅ 특정 요소가 로드될 때까지 대기
            await page.waitForSelector(".list-item", { timeout: 10000 });

            // ✅ 현재 페이지의 공고 데이터 가져오기
            const newJobs = await page.evaluate(() => {
                return Array.from(document.querySelectorAll(".list-item")).map(jobCard => {
                    const titleElement = jobCard.querySelector(".information-title-link");
                    const companyElement = jobCard.querySelector(".corp-name-link");
                    const linkElement = jobCard.querySelector(".information-title-link");
                    // const locationElement = jobCard.querySelector(".chip-information-group li:last-child");
                    // const jobTypeElement = Array.from(jobCard.querySelectorAll(".chip-information-group li"))
                    //     .map(li => li.textContent?.trim())
                    //     .filter(text => text && (text.includes("정규직") || text.includes("계약직") || text.includes("인턴")))[0];

                    return {
                        title: titleElement ? titleElement.textContent?.trim() || "제목 없음" : "제목 없음",
                        company: companyElement ? companyElement.textContent?.trim() || "회사 정보 없음" : "회사 정보 없음",
                        link: linkElement ? `https://www.jobkorea.co.kr${linkElement.getAttribute("href")}` : "링크 없음",
                        // location: locationElement ? locationElement.textContent?.trim() || "위치 정보 없음" : "위치 정보 없음",
                        // jobType: jobTypeElement || "채용 형태 없음"
                    };
                });
            });

            // ✅ 새로운 데이터를 기존 배열에 추가
            jobListings = jobListings.concat(newJobs);

            // ✅ 2초 대기 후 다음 페이지 이동 (서버 부담 방지)
            await new Promise(resolve => setTimeout(resolve, 2000));
        }

        console.log(`✅ JobKorea에서 ${jobListings.length}개 공고 크롤링 완료!`);
        return jobListings;
    }
};
