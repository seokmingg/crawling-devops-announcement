import { Page } from "puppeteer";
import { JobListingDto } from "../types/JobListingDto";
import { getScraperConfig } from "../config/getScraperConfig";
import { ScraperConfigDto } from "../types/ScraperConfigDto";

export abstract class BaseScraper {
    public siteName: string;
    protected searchKeyword: string;
    protected config: ScraperConfigDto;

    constructor(siteName: string, searchKeyword: string) {
        this.siteName = siteName;
        this.searchKeyword = searchKeyword;
        const scraperConfig = getScraperConfig(siteName);

        if (!scraperConfig) {
            throw new Error(`❌ [오류] ${siteName} 크롤러 설정을 찾을 수 없습니다.`);
        }

        this.config = scraperConfig;
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