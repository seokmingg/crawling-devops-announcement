import fs from "fs";
import path from "path";
import {JobListingDTO} from "../dto/JobListing.dto";

const resultDir = path.join(__dirname, "../result"); // 크롤링 결과 폴더

export async function mergeJobListings(searchKeyword:string) {
    try {
        // 📌 최신 날짜 폴더 찾기
        const dateFolders = fs.readdirSync(resultDir).filter(folder => /^\d{4}-\d{2}-\d{2}$/.test(folder));
        if (dateFolders.length === 0) {
            console.error("❌ 크롤링 데이터 폴더가 없습니다.");
            return;
        }

        const latestDateFolder = dateFolders.sort().reverse()[0]; // 최신 날짜 폴더 선택
        const latestFolderPath = path.join(resultDir, latestDateFolder);

        console.log(`📂 최신 크롤링 폴더: ${latestDateFolder}`);

        // 📌 JSON 파일 읽기
        const jobFiles = fs.readdirSync(latestFolderPath).filter(file => file.endsWith(".json"));
        let allJobs: JobListingDTO[] = [];

        for (const file of jobFiles) {
            if (file === "merged_jobs.json") continue; // ✅ 기존 병합 파일 제외
            const filePath = path.join(latestFolderPath, file);
            console.log(`🔍 파일 읽는 중: ${file}`);
            const fileData = fs.readFileSync(filePath, "utf-8");
            const jobListings = JSON.parse(fileData);

            allJobs = allJobs.concat(jobListings);
        }

        console.log(`📊 총 ${allJobs.length}개의 공고 데이터 수집 완료!`);


        // ✅ 사용자가 입력한 검색어를 정규식으로 변환

        const defaultKeywords = ["devops", "데브옵스", "infra", "클라우드", "cloud", "운영"]; // 기본 검색 키워드
        const keywordRegex = new RegExp(`${searchKeyword}|${defaultKeywords.join("|")}`, "i");

        // 📌 `searchKeyword` 포함된 공고만 필터링
        const filteringJobs = allJobs.filter(job => keywordRegex.test(job.title));

        console.log(`🔎 ${searchKeyword} 관련 공고 ${filteringJobs.length}개 필터링 완료!`);



        // 📌 회사명에서 "(주)" 또는 "주식회사" 제거
        filteringJobs.forEach(job => {
            job.company = job.company
                // ㈜, (주), 주식회사 패턴을 모두 제거 (문자열 어디에 있든지 전역 삭제)
                .replace(/(\(주\)|주식회사|㈜)/g, "")
                // 제거 후 남은 공백도 정리
                .trim();
        });

        // 📌 중복 제거 (회사명 기준)
        const uniqueJobs = Array.from(new Map(filteringJobs.map(job => [job.company, job])).values());

        console.log(`✅ 중복 제거 후 ${uniqueJobs.length}개의 공고 데이터 유지`);

        // 📌 해당 날짜 폴더에 병합된 JSON 저장
        const outputFilePath = path.join(latestFolderPath, "merged_jobs.json");
        fs.writeFileSync(outputFilePath, JSON.stringify(uniqueJobs, null, 2), "utf-8");

        console.log(`✅ 통합 JSON 파일 저장 완료: ${outputFilePath}`);

    } catch (error) {
        console.error("❌ 오류 발생:", error);
    }
}
