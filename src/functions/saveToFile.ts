import fs from "fs";
import path from "path";
import { JobListingDTO } from "../dto/JobListing.dto";

// 현재 날짜 가져오기 (YYYY-MM-DD)
const currentDate = new Date().toISOString().split("T")[0];

// ✅ `src/result/YYYY-MM-DD/` 폴더에 저장하도록 변경
const resultDir = path.join(__dirname, "../result", currentDate);

// 폴더가 없으면 생성
if (!fs.existsSync(resultDir)) {
    fs.mkdirSync(resultDir, { recursive: true });
}

export async function saveToFile(jobListings: JobListingDTO[]) {
    const filePath = path.join(resultDir, "devops_jobs.json");
    fs.writeFileSync(filePath, JSON.stringify(jobListings, null, 2));
    console.log(`✅ JSON 파일 저장 완료: ${filePath}`);
}
