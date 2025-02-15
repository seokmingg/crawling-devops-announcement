import fs from "fs";
import path from "path";
import { JobListingDTO } from "../dto/JobListing.dto";

const currentDate = new Date().toISOString().split("T")[0];
const resultDir = path.join(__dirname, "../result", currentDate);

if (!fs.existsSync(resultDir)) {
    fs.mkdirSync(resultDir, { recursive: true });
}

export async function saveToFile(jobListings: JobListingDTO[], siteName: string) {
    const filePath = path.join(resultDir, `${siteName}_jobs.json`);
    fs.writeFileSync(filePath, JSON.stringify(jobListings, null, 2));
    console.log(`✅ JSON 파일 저장 완료: ${filePath}`);
}
