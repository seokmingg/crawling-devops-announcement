import { Page } from "puppeteer";
import { JobListingDto } from "../types/JobListingDto";
import {autoScroll} from "../utils/autoScroll";
import {getScraperConfig} from "../config/getScraperConfig";
import { BaseScraper } from "./BaseScraper";


export class AutoScrollScraper extends BaseScraper {
    constructor(siteName: string, searchKeyword: string) {
        super(siteName, searchKeyword);
    }

    protected async fetchJobs(page: Page): Promise<JobListingDto[]> {
        await page.goto(this.config.searchUrl(this.searchKeyword), { waitUntil: "networkidle2" });

        await autoScroll(page, 150);
        await new Promise(resolve => setTimeout(resolve, 5000));

        const jobListings = await this.config.extractJobListings(page);

        console.log(`✅ ${this.siteName}에서 ${jobListings.length}개 공고 크롤링 완료!`);
        return jobListings;
    }
}








//기존 함수형
// export const createAutoScrollScraper = (siteName: string, searchKeyword: string) => {
//     const config = getScraperConfig(siteName);
//
//
//
//     if (!config) {
//         throw new Error(`❌ [오류] ${siteName} 크롤러 설정을 찾을 수 없습니다.`);
//     }
//
//     // ✅ 크롤링 함수 정의
//     const scrape = async (page: Page): Promise<JobListingDto[]> => {
//         console.log(`🔄 ${config.siteName} 크롤링 시작...`);
//
//         await page.goto(config.searchUrl(searchKeyword), { waitUntil: "networkidle2" });
//
//         // ✅ 무한 스크롤 실행
//         await autoScroll(page, 150);
//
//         // ✅ 모든 데이터가 로드되도록 5초 추가 대기
//         await new Promise(resolve => setTimeout(resolve, 5000));
//
//         // ✅ 사이트별 크롤링 로직 실행
//         const jobListings = await config.extractJobListings(page);
//
//         console.log(`✅ ${config.siteName}에서 ${jobListings.length}개 공고 크롤링 완료!`);
//         return jobListings;
//     };
//
//     // ✅ siteName과 scrape 함수를 포함한 객체 반환
//     return { siteName: config.siteName, scrape };
// };