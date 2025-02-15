
## 📂 프로젝트 폴더 구조
```plaintext
crawling-devops-announcement/
│── src/
│   ├── index.ts                # 메인 실행 파일
│   ├── result/                  # ✅ 크롤링 데이터 저장 폴더
│   │   ├── 2025-02-15/           # ✅ 날짜별 폴더 (자동 생성)
│   │   │   ├── devops_jobs.json  # ✅ JSON 파일
│   ├── dto/
│   │   ├── JobListing.dto.ts     # DTO 정의
│   ├── functions/
│   │   ├── puppeteerSetup.ts     # Puppeteer 초기화 관련 코드
│   │   ├── autoScroll.ts         # 스크롤 처리 함수
│   │   ├── getJobListings.ts     # 채용 공고 크롤링 함수
│   │   ├── saveToFile.ts         # JSON 파일 저장 함수
│── package.json
│── tsconfig.json

