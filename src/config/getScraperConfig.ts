import { Page } from "puppeteer";
import { JobListingDto } from "../types/JobListingDto";
import { ScraperConfigDto } from "../types/ScraperConfigDto";


/**
 * 사이트별 크롤링 설정 정의
 */
const siteConfigs: Record<string, ScraperConfigDto> = {
    wanted: {
        siteName: "wanted",
        url: "https://www.wanted.co.kr/search",
        searchUrl: (searchKeyword: string) =>
            `https://www.wanted.co.kr/search?query=${encodeURIComponent(searchKeyword)}&tab=position`,
        listSelector: ".JobCard_container__REty8",
        extractJobListings: async (page: Page): Promise<JobListingDto[]> => {
            return await page.evaluate(() => {
                const getText = (element: Element | null): string => {
                    return element ? element.textContent?.trim() || "정보 없음" : "정보 없음";
                };

                const getLink = (element: Element | null, baseUrl: string): string => {
                    return element ? `${baseUrl}${element.getAttribute("href")}` : "링크 없음";
                };

                return Array.from(document.querySelectorAll(".JobCard_container__REty8")).map(jobCard => ({
                    title: getText(jobCard.querySelector(".JobCard_title__HBpZf")),
                    company: getText(jobCard.querySelector(".JobCard_companyName__N1YrF")),
                    link: getLink(jobCard.querySelector("a"), "https://www.wanted.co.kr"),
                }));
            });
        }
    },

    jumpit: {
        siteName: "jumpit",
        url: "https://www.jumpit.co.kr/search",
        searchUrl: (searchKeyword: string) =>
            `https://www.jumpit.co.kr/search?keyword=${encodeURIComponent(searchKeyword)}`,
        listSelector: ".sc-d609d44f-0",
        extractJobListings: async (page: Page): Promise<JobListingDto[]> => {
            return await page.evaluate(() => {
                const getText = (element: Element | null): string => {
                    return element ? element.textContent?.trim() || "정보 없음" : "정보 없음";
                };

                const getLink = (element: Element | null, baseUrl: string): string => {
                    return element ? `${baseUrl}${element.getAttribute("href")}` : "링크 없음";
                };

                return Array.from(document.querySelectorAll(".sc-d609d44f-0")).map(jobCard => ({
                    title: getText(jobCard.querySelector("h2.position_card_info_title")),
                    company: getText(jobCard.querySelector(".sc-15ba67b8-0 div div")),
                    link: getLink(jobCard.querySelector("a"), "https://www.jumpit.co.kr"),
                }));
            });
        }
    },

    jobkorea: {
        siteName: "jobkorea",
        url: "https://www.jobkorea.co.kr/Search/",
        searchUrl: (searchKeyword: string, pageNum: number = 1) =>
            `https://www.jobkorea.co.kr/Search/?stext=${encodeURIComponent(searchKeyword)}&FeatureCode=TOT&tabType=recruit&Page_No=${pageNum}`,
        listSelector: ".list-item",
        extractJobListings: async (page: Page): Promise<JobListingDto[]> => {
            return await page.evaluate(() => {
                const getText = (element: Element | null): string => {
                    return element ? element.textContent?.trim() || "정보 없음" : "정보 없음";
                };

                const getLink = (element: Element | null, baseUrl: string): string => {
                    return element ? `${baseUrl}${element.getAttribute("href")}` : "링크 없음";
                };

                return Array.from(document.querySelectorAll(".list-item")).map(jobCard => ({
                    title: getText(jobCard.querySelector(".information-title-link")),
                    company: getText(jobCard.querySelector(".corp-name-link")),
                    link: getLink(jobCard.querySelector(".information-title-link"), "https://www.jobkorea.co.kr"),
                }));
            });
        }
    },

    saramin: {
        siteName: "saramin",
        url: "https://www.saramin.co.kr/zf_user/search/recruit",
        searchUrl: (searchKeyword: string, pageNum: number = 1) =>
            `https://www.saramin.co.kr/zf_user/search/recruit?search_area=main&search_done=y&search_optional_item=n&searchType=search&searchword=${encodeURIComponent(searchKeyword)}&recruitPage=${pageNum}&recruitSort=relation&recruitPageCount=100`,
        listSelector: ".item_recruit",
        extractJobListings: async (page: Page): Promise<JobListingDto[]> => {
            return await page.evaluate(() => {
                const getText = (element: Element | null): string => {
                    return element ? element.textContent?.trim() || "정보 없음" : "정보 없음";
                };

                const getLink = (element: Element | null, baseUrl: string): string => {
                    return element ? `${baseUrl}${element.getAttribute("href")}` : "링크 없음";
                };

                return Array.from(document.querySelectorAll(".item_recruit")).map(jobCard => ({
                    title: getText(jobCard.querySelector("h2.job_tit a")),
                    company: getText(jobCard.querySelector("strong.corp_name a")),
                    link: getLink(jobCard.querySelector("h2.job_tit a"), "https://www.saramin.co.kr"),
                }));
            });
        }
    },

    catch: {
        siteName: "catch",
        url: "https://www.catch.co.kr/Search/SearchDetail",
        searchUrl: (searchKeyword: string, pageNum: number = 1) =>
            `https://www.catch.co.kr/Search/SearchDetail?CurrentPage=${pageNum}&Keyword=${encodeURIComponent(searchKeyword)}&Menu=2`,
        listSelector: "li",
        extractJobListings: async (page: Page): Promise<JobListingDto[]> => {
            return await page.evaluate(() => {
                const getText = (element: Element | null): string => {
                    return element ? element.textContent?.trim() || "정보 없음" : "정보 없음";
                };

                const getLink = (element: Element | null, baseUrl: string): string => {
                    return element ? `${baseUrl}${element.getAttribute("href")}` : "링크 없음";
                };

                return Array.from(document.querySelectorAll("li")).map(jobCard => ({
                    title: getText(jobCard.querySelector("p.biz")),
                    company: getText(jobCard.querySelector("p.name a")),
                    link: getLink(jobCard.querySelector("p.name a"), "https://www.catch.co.kr"),
                }));
            });
        }
    }
};

/**
 * 사이트별 크롤러 설정을 반환하는 함수
 */
export const getScraperConfig = (siteName: string): ScraperConfigDto | undefined => {
    return siteConfigs[siteName] ?? undefined;
};





// /**
//  * HTML 요소에서 텍스트를 추출하는 공통 함수
//  */
// const getText = (element: Element | null): string => {
//     return element ? element.textContent?.trim() || "정보 없음" : "정보 없음";
// };
//
// /**
//  * HTML 요소에서 링크를 추출하는 공통 함수
//  */
// const getLink = (element: Element | null, baseUrl: string): string => {
//     return element ? `${baseUrl}${element.getAttribute("href")}` : "링크 없음";
// };
//
// /**
//  * 사이트별 크롤링 설정 정의
//  */
// const siteConfigs: Record<string, ScraperConfigDto> = {
//     wanted: {
//         siteName: "wanted",
//         url: "https://www.wanted.co.kr/search",
//         searchUrl: (searchKeyword: string) =>
//             `https://www.wanted.co.kr/search?query=${encodeURIComponent(searchKeyword)}&tab=position`,
//         listSelector: ".JobCard_container__REty8",
//         extractJobListings: async (page: Page): Promise<JobListingDto[]> => {
//             return await page.evaluate((getText, getLink) => {
//                 return Array.from(document.querySelectorAll(".JobCard_container__REty8")).map(jobCard => ({
//                     title: getText(jobCard.querySelector(".JobCard_title__HBpZf")),
//                     company: getText(jobCard.querySelector(".JobCard_companyName__N1YrF")),
//                     link: getLink(jobCard.querySelector("a"), "https://www.wanted.co.kr"),
//                 }));
//             }, getText, getLink);
//         }
//     },
//
//     jumpit: {
//         siteName: "jumpit",
//         url: "https://www.jumpit.co.kr/search",
//         searchUrl: (searchKeyword: string) =>
//             `https://www.jumpit.co.kr/search?keyword=${encodeURIComponent(searchKeyword)}`,
//         listSelector: ".sc-d609d44f-0",
//         extractJobListings: async (page: Page): Promise<JobListingDto[]> => {
//             return await page.evaluate((getText, getLink) => {
//                 return Array.from(document.querySelectorAll(".sc-d609d44f-0")).map(jobCard => ({
//                     title: getText(jobCard.querySelector("h2.position_card_info_title")),
//                     company: getText(jobCard.querySelector(".sc-15ba67b8-0 div div")),
//                     link: getLink(jobCard.querySelector("a"), "https://www.jumpit.co.kr"),
//                 }));
//             }, getText, getLink);
//         }
//     },
//
//     jobkorea: {
//         siteName: "jobkorea",
//         url: "https://www.jobkorea.co.kr/Search/",
//         searchUrl: (searchKeyword: string, pageNum: number = 1) =>
//             `https://www.jobkorea.co.kr/Search/?stext=${encodeURIComponent(searchKeyword)}&FeatureCode=TOT&tabType=recruit&Page_No=${pageNum}`,
//         listSelector: ".list-item",
//         extractJobListings: async (page: Page): Promise<JobListingDto[]> => {
//             return await page.evaluate((getText, getLink) => {
//                 return Array.from(document.querySelectorAll(".list-item")).map(jobCard => ({
//                     title: getText(jobCard.querySelector(".information-title-link")),
//                     company: getText(jobCard.querySelector(".corp-name-link")),
//                     link: getLink(jobCard.querySelector(".information-title-link"), "https://www.jobkorea.co.kr"),
//                 }));
//             }, getText, getLink);
//         }
//     },
//
//     saramin: {
//         siteName: "saramin",
//         url: "https://www.saramin.co.kr/zf_user/search/recruit",
//         searchUrl: (searchKeyword: string, pageNum: number = 1) =>
//             `https://www.saramin.co.kr/zf_user/search/recruit?search_area=main&search_done=y&search_optional_item=n&searchType=search&searchword=${encodeURIComponent(searchKeyword)}&recruitPage=${pageNum}&recruitSort=relation&recruitPageCount=100`,
//         listSelector: ".item_recruit",
//         extractJobListings: async (page: Page): Promise<JobListingDto[]> => {
//             return await page.evaluate((getText, getLink) => {
//                 return Array.from(document.querySelectorAll(".item_recruit")).map(jobCard => ({
//                     title: getText(jobCard.querySelector("h2.job_tit a")),
//                     company: getText(jobCard.querySelector("strong.corp_name a")),
//                     link: getLink(jobCard.querySelector("h2.job_tit a"), "https://www.saramin.co.kr"),
//                 }));
//             }, getText, getLink);
//         }
//     },
//
//     catch:{
//         siteName: "catch",
//         url: "https://www.catch.co.kr/Search/SearchDetail",
//         searchUrl: (searchKeyword: string, pageNum: number = 1) =>
//             `https://www.catch.co.kr/Search/SearchDetail?CurrentPage=${pageNum}&Keyword=${encodeURIComponent(searchKeyword)}&Menu=2`,
//         listSelector: "li",
//         extractJobListings: async (page: Page): Promise<JobListingDto[]> => {
//             return await page.evaluate((getText, getLink) => {
//                 return Array.from(document.querySelectorAll("li")).map(jobCard => ({
//                     title: getText(jobCard.querySelector("p.biz")),
//                     company: getText(jobCard.querySelector("p.name a")),
//                     link: getLink(jobCard.querySelector("p.name a"), "https://www.catch.co.kr"),
//                 }));
//             }, getText, getLink);
//         }
//     }
//
//
//
//
//
// };
//
// /**
//  * 사이트별 크롤러 설정을 반환하는 함수
//  */
// export const getScraperConfig = (siteName: string): ScraperConfigDto | undefined => {
//     return siteConfigs[siteName] ?? undefined;
// };
