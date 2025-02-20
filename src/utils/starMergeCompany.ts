
// src/functions/starMergeCompany.ts

import fs from "fs";
import path from "path";
import { launchPuppeteer } from "./puppeteerSetup";
import { Page } from "puppeteer";
import { JobListingDto } from "../types/JobListingDto";
import {blindScraper} from "../crawlers/blindScraper";



/**
 * 병합된 merged_jobs.json을 읽어와 회사별 평점, 리뷰를 추가하고,
 * star_merged.json 등으로 저장. 봇 차단 최소화를 위해 요청 사이에 지연을 둡니다.
 */
export async function starMergeCompany() {
    // Puppeteer 시작
    const { browser, page } = await launchPuppeteer();

    try {
        // 최신 날짜 폴더 찾기
        const resultDir = path.join(__dirname, "../result");
        const dateFolders = fs.readdirSync(resultDir).filter(folder => /^\d{4}-\d{2}-\d{2}$/.test(folder));

        if (dateFolders.length === 0) {
            console.error("❌ 크롤링 데이터 폴더가 없습니다.");
            return;
        }

        const latestDateFolder = dateFolders.sort().reverse()[0];
        const latestFolderPath = path.join(resultDir, latestDateFolder);

        console.log(`📂 최신 크롤링 폴더: ${latestDateFolder}`);

        // merged_jobs.json 읽기
        const mergedFilePath = path.join(latestFolderPath, "merged_jobs.json");
        if (!fs.existsSync(mergedFilePath)) {
            console.error("❌ merged_jobs.json 파일이 없습니다.");
            return;
        }

        const rawData = fs.readFileSync(mergedFilePath, "utf-8");
        const mergedJobs = JSON.parse(rawData) as JobListingDto[];

        console.log(`🔍 merged_jobs.json 파일 읽기 완료: 총 ${mergedJobs.length}건`);

        // 회사별로 팀블라인드 평점/리뷰 가져오기
        for (let i = 0; i < mergedJobs.length; i++) {
            const job = mergedJobs[i];

            // 실제 스크래핑
            const { stars, reviews } = await blindScraper(page, job.company);
            job.stars = stars;
            job.reviews = reviews;

            // 1초~3초 랜덤 지연
            const delay = 1000 + Math.floor(Math.random() * 2000); // 1000 ~ 3000 ms
            console.log(`⏳ [${i + 1}/${mergedJobs.length}] ${job.company} 처리 후 지연: ${delay}ms`);
            // await page.waitForTimeout(delay);
            await new Promise(resolve => setTimeout(resolve, delay));
        }

        // star_merged.json 파일로 저장
        const starMergedPath = path.join(latestFolderPath, "star_merged.json");
        fs.writeFileSync(starMergedPath, JSON.stringify(mergedJobs, null, 2), "utf-8");
        console.log(`✅ 별점·리뷰 추가 완료: ${starMergedPath}`);
    } catch (error) {
        console.error("❌ 별점·리뷰 추가 중 오류 발생:", error);
    } finally {
        await browser.close();
    }
}
