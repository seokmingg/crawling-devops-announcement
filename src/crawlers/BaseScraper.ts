import { Page } from "puppeteer";
import { JobListingDto } from "../types/JobListingDto";
import { getScraperConfig } from "./getScraperConfig";

export abstract class BaseScraper {
    protected siteName: string;
    protected searchKeyword: string;
    protected config: any;

    constructor(siteName: string, searchKeyword: string) {
        this.siteName = siteName;
        this.searchKeyword = searchKeyword;
        this.config = getScraperConfig(siteName);

        if (!this.config) {
            throw new Error(`❌ [오류] ${siteName} 크롤러 설정을 찾을 수 없습니다.`);
        }
    }

    public async scrape(page: Page): Promise<JobListingDto[]> {
        console.log(`🔄 ${this.siteName} 크롤링 시작...`);
        try {
            return await this.fetchJobs(page);
        } catch (error) {
            console.error(`❌ ${this.siteName}: 크롤링 실패! 오류:`, error);
            return [];
        }
    }

    protected abstract fetchJobs(page: Page): Promise<JobListingDto[]>;
}