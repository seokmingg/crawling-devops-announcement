import {JobListingDto} from "./JobListingDto";
import {Page} from "puppeteer";


export interface ScraperConfigDto {
    siteName: string;
    url: string;
    searchUrl: (searchKeyword: string, pageNum?: number) => string;
    listSelector: string; // ✅ 추가
    extractJobListings: (page: Page) => Promise<JobListingDto[]>;
}
