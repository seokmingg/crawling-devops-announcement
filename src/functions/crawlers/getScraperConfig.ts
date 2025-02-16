import { Page } from "puppeteer";
import { JobListingDTO } from "../../dto/JobListing.dto";
import { ScraperConfigDto } from "../../dto/ScraperConfigDto";

export const getScraperConfig = (siteName: string): ScraperConfigDto | undefined => {
    const configs: Record<string, ScraperConfigDto> = {
        wanted: {
            siteName: "wanted",
            url: "https://www.wanted.co.kr/search",
            searchUrl: (searchKeyword: string) =>
                `https://www.wanted.co.kr/search?query=${encodeURIComponent(searchKeyword)}&tab=position`,
            listSelector: ".JobCard_container__REty8", // ✅ 추가 (선택자 정의)
            extractJobListings: async (page: Page): Promise<JobListingDTO[]> => {
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
        },

        jumpit: {
            siteName: "jumpit",
            url: "https://www.jumpit.co.kr/search",
            searchUrl: (searchKeyword: string) =>
                `https://www.jumpit.co.kr/search?keyword=${encodeURIComponent(searchKeyword)}`,
            listSelector: ".sc-d609d44f-0", // ✅ 추가
            extractJobListings: async (page: Page): Promise<JobListingDTO[]> => {
                return await page.evaluate(() => {
                    return Array.from(document.querySelectorAll(".sc-d609d44f-0")).map(jobCard => {
                        const titleElement = jobCard.querySelector("h2.position_card_info_title");
                        const companyElement = jobCard.querySelector(".sc-15ba67b8-0 div div");
                        const linkElement = jobCard.querySelector("a");

                        return {
                            title: titleElement ? titleElement.textContent?.trim() || "제목 없음" : "제목 없음",
                            company: companyElement ? companyElement.textContent?.trim() || "회사 정보 없음" : "회사 정보 없음",
                            link: linkElement ? `https://www.jumpit.co.kr${linkElement.getAttribute("href")}` : "링크 없음",
                        };
                    });
                });
            }
        },

        jobkorea: {
            siteName: "jobkorea",
            url: "https://www.jobkorea.co.kr/Search/",
            searchUrl: (searchKeyword: string, pageNum: number = 1) =>
                `https://www.jobkorea.co.kr/Search/?stext=${encodeURIComponent(searchKeyword)}&FeatureCode=TOT&tabType=recruit&Page_No=${pageNum}`,
            listSelector: ".list-item", // ✅ 추가
            extractJobListings: async (page: Page): Promise<JobListingDTO[]> => {
                return await page.evaluate(() => {
                    return Array.from(document.querySelectorAll(".list-item")).map(jobCard => {
                        const titleElement = jobCard.querySelector(".information-title-link");
                        const companyElement = jobCard.querySelector(".corp-name-link");
                        const linkElement = jobCard.querySelector(".information-title-link");

                        return {
                            title: titleElement ? titleElement.textContent?.trim() || "제목 없음" : "제목 없음",
                            company: companyElement ? companyElement.textContent?.trim() || "회사 정보 없음" : "회사 정보 없음",
                            link: linkElement ? `https://www.jobkorea.co.kr${linkElement.getAttribute("href")}` : "링크 없음",
                        };
                    });
                });
            }
        },


        saramin: {
            siteName: "saramin",
            url: "https://www.saramin.co.kr/zf_user/search/recruit",
            searchUrl: (searchKeyword: string, pageNum: number = 1) =>
                `https://www.saramin.co.kr/zf_user/search/recruit?search_area=main&search_done=y&search_optional_item=n&searchType=search&searchword=${encodeURIComponent(searchKeyword)}&recruitPage=${pageNum}&recruitSort=relation&recruitPageCount=100`,
            listSelector: ".item_recruit",
            extractJobListings: async (page: Page): Promise<JobListingDTO[]> => {
                return await page.evaluate(() => {
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
            }
        },



        catch: {
            siteName: "catch",
            url: "https://www.catch.co.kr/Search/SearchDetail",
            searchUrl: (searchKeyword: string, pageNum: number = 1) =>
                `https://www.catch.co.kr/Search/SearchDetail?CurrentPage=${pageNum}&Keyword=${encodeURIComponent(searchKeyword)}&Menu=2`,
            listSelector: "li .txt",
            extractJobListings: async (page: Page): Promise<JobListingDTO[]> => {
                return await page.evaluate(() => {
                    return Array.from(document.querySelectorAll("li")).map(jobCard => {
                        const companyElement = jobCard.querySelector("p.name a");
                        const categoryElement = jobCard.querySelector("p.biz");
                        const linkElement = jobCard.querySelector("p.name a");

                        return {
                            title: categoryElement ? categoryElement.textContent?.trim() || "직무 정보 없음" : "직무 정보 없음",
                            company: companyElement ? companyElement.textContent?.trim() || "회사 정보 없음" : "회사 정보 없음",
                            link: linkElement ? `https://www.catch.co.kr${linkElement.getAttribute("href")}` : "링크 없음",
                        };
                    });
                });
            }
        }









    };

    return configs[siteName] ?? undefined; // ✅ 존재하지 않으면 undefined 반환
};
