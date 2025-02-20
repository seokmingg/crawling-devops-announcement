import { Page } from "puppeteer";
import { JobListingDto } from "../../dto/JobListingDto";
import { getScraperConfig } from "./getScraperConfig";

export const createPaginationScraper = (siteName: string, searchKeyword: string, maxPages: number) => {
    const config = getScraperConfig(siteName);

    if (!config) {
        throw new Error(`❌ [오류] ${siteName} 크롤러 설정을 찾을 수 없습니다.`);
    }

    // ✅ 크롤링 함수 정의
    const scrape = async (page: Page): Promise<JobListingDto[]> => {
        console.log(`🔄 ${config.siteName} 크롤링 시작...`);

        let jobListings: JobListingDto[] = [];

        for (let pageNum = 1; pageNum <= maxPages; pageNum++) {
            console.log(`🔄 ${config.siteName} - ${pageNum} 페이지 크롤링 중...`);

            const pageUrl = config.searchUrl(searchKeyword, pageNum);
            await page.goto(pageUrl, { waitUntil: "networkidle2" });

            // ✅ 특정 요소가 로드될 때까지 대기
            await page.waitForSelector(config.listSelector, { timeout: 10000 });

            // ✅ 현재 페이지의 공고 데이터 가져오기
            const newJobs = await config.extractJobListings(page);

            // ✅ 새로운 데이터를 기존 배열에 추가
            jobListings = jobListings.concat(newJobs);

            // ✅ 2초 대기 후 다음 페이지 이동 (서버 부담 방지)
            await new Promise(resolve => setTimeout(resolve, 2000));
        }

        console.log(`✅ ${config.siteName}에서 ${jobListings.length}개 공고 크롤링 완료!`);
        return jobListings;
    };

    // ✅ siteName과 scrape 함수를 포함한 객체 반환
    return { siteName: config.siteName, scrape };
};
