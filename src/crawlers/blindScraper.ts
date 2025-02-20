import {Page} from "puppeteer";



/**
 * 병합된 merged_jobs.json에서 회사별 회사들을 받아와평점, 리뷰를 추가함
 */
export async function blindScraper(
    page: Page,
    companyName: string
): Promise<{ stars: string; reviews: string }> {
    try {
        // 팀블라인드 회사 페이지 접속
        const url = `https://www.teamblind.com/kr/company/${encodeURIComponent(companyName)}`;
        await page.goto(url, { waitUntil: "networkidle0" });

        const ratingDiv = await page.$("div.rating");
        if (!ratingDiv) {
            return { stars: "nodata", reviews: "nodata" };
        }

        // 별점 추출
        const stars = await page.evaluate((el) => {
            const starSpan = el.querySelector("span.star");
            if (!starSpan) return "nodata";
            return starSpan.textContent?.replace("Rating Score", "").trim() || "nodata";
        }, ratingDiv);

        // 리뷰 수 추출
        const reviews = await page.evaluate((el) => {
            const reviewEm = el.querySelector("em.num");
            return reviewEm?.textContent?.trim() || "nodata";
        }, ratingDiv);

        return { stars, reviews };
    } catch (error) {
        console.error(`❌ 팀블라인드 조회 실패 (${companyName}):`, error);
        return { stars: "nodata", reviews: "nodata" };
    }
}

