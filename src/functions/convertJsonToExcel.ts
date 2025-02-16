import fs from 'fs';
import path from 'path';
import * as XLSX from 'xlsx';
import {JobListingDTO} from "../dto/JobListing.dto";

const resultDir = path.join(__dirname, '../result');

// 최신 날짜 폴더 찾기
function getLatestFolder(directory: string): string | null {
    const folders = fs
        .readdirSync(directory)
        .filter((file) => fs.statSync(path.join(directory, file)).isDirectory())
        .sort((a, b) => b.localeCompare(a)); // 내림차순 정렬

    return folders.length > 0 ? folders[0] : null;
}

// JSON 데이터를 엑셀로 변환하여 저장
function convertJsonToExcel(jsonFilePath: string, outputFilePath: string) {
    const rawData = fs.readFileSync(jsonFilePath, 'utf-8');
    const jsonData:JobListingDTO = JSON.parse(rawData);

    if (!Array.isArray(jsonData)) {
        console.error('JSON 데이터가 배열 형태가 아닙니다.');
        return;
    }

    // AOA 형식 (2차원 배열)으로 변환
    // 첫 번째 행은 헤더
    const sheetData: any[][] = [
        ['Title', 'Company', 'Stars', 'Reviews', 'Link'],
    ];

    // 각 JSON 객체를 행으로 변환
    jsonData.forEach((job:JobListingDTO) => {
        const row = [
            job.title || '',
            job.company || '',
            job.stars || '',
            job.reviews || '',
            job.link
                ? {
                    v: job.link, // 셀에 표시될 텍스트
                    l: { Target: job.link }, // 실제 링크
                }
                : '',
        ];
        sheetData.push(row);
    });

    // AOA 데이터를 시트로 변환
    const worksheet = XLSX.utils.aoa_to_sheet(sheetData);

    // 워크북에 시트 추가
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Jobs');

    XLSX.writeFile(workbook, outputFilePath);
    console.log(`엑셀 파일이 생성되었습니다: ${outputFilePath}`);
}

/**
 * 최신 날짜 폴더에서 star_merged.json을 찾아 star_merged.xlsx로 변환한다.
 */
export function createExcel() {
    const latestFolder = getLatestFolder(resultDir);
    if (!latestFolder) {
        console.error('최신 날짜 폴더를 찾을 수 없습니다.');
        return;
    }

    const latestFolderPath = path.join(resultDir, latestFolder);
    const jsonFilePath = path.join(latestFolderPath, 'star_merged.json');
    const excelFilePath = path.join(latestFolderPath, 'star_merged.xlsx');

    if (!fs.existsSync(jsonFilePath)) {
        console.error(`파일이 존재하지 않습니다: ${jsonFilePath}`);
        return;
    }

    convertJsonToExcel(jsonFilePath, excelFilePath);
}


createExcel()
