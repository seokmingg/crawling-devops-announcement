import * as puppeteer from "puppeteer";
import { JobListingDTO } from "../dto/JobListing.dto";


export async function getJobListings(page: puppeteer.Page): Promise<JobListingDTO[]> {
    return await page.evaluate(() => {
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
}
