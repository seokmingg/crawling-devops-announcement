import { Page } from "puppeteer";
import { JobListingDTO } from "../../dto/JobListing.dto";

export interface Scraper {
    siteName: string;  // 사이트 이름 (예: "wanted", "jumpit")
    url: string;       // 크롤링할 URL
    scrape: (page: Page) => Promise<JobListingDTO[]>; // 크롤링 함수
}
