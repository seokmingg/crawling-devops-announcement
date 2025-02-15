import { launchPuppeteer } from "./functions/puppeteerSetup";
import { autoScroll } from "./functions/autoScroll";
import { getJobListings } from "./functions/getJobListings";
import { saveToFile } from "./functions/saveToFile";
import { JobListingDTO } from "./dto/JobListing.dto";

(async () => {
    const { browser, page } = await launchPuppeteer();
    const url = "https://www.wanted.co.kr/search?query=devops&tab=overview";

    await page.goto(url, { waitUntil: "networkidle2" });

    // 특정 요소가 나타날 때까지 대기
    await page.waitForSelector(".JobCard_container__REty8", { timeout: 10000 });

    // 스크롤 처리
    await autoScroll(page);
    await new Promise(resolve => setTimeout(resolve, 2000));

    // 채용 공고 데이터 가져오기
    const jobListings:JobListingDTO[] = await getJobListings(page);

    // JSON 파일 저장
    await saveToFile(jobListings);

    console.log("✅ 크롤링 완료!");
    await browser.close();
})();
