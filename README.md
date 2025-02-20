
# 🕵️‍♂️ Crawling DevOps Announcement

**Crawling Devops Announcement**는 검색키워드를  채용 공고사이트에서 자동으로 크롤링하여 수집한후  엑셀로 변환하는 프로젝트입니다.  


## 📌 기능 소개
- `여러 구직사이트`에서 **검색키워드 관련 채용 공고를 크롤링**합니다.
- **Puppeteer & TypeScript 기반**으로 동작합니다.
- **날짜별로 저장**하여 데이터를 관리합니다.
- **사이트별로 크롤링된 데이터를 JSON 파일로 저장후 중복제거**합니다.
- 정제된 json 파일을 기반으로 회사별로 **블라인드에 검색해 별점을 추가후 JSON 파일을 재생성** 합니다.
- **최종적으로 별점이추가된 데이터를 엑셀로 변환** 합니다.

---

## 🚀 실행 방법
- **프로젝트 클론**
```bash
git clone https://github.com/seokmingg/crawling-devops-announcement.git
cd crawling-devops-announcement
index.ts 파일에서 검색키워드를 수정합니다.
npm install
npm run start

```
---
## 📂 프로젝트 폴더 구조
```plaintext
crawling-devops-announcement/
│── src/
│   ├── index.ts                # 메인 실행 파일 (모든 크롤링 사이트 순회 & 실행 & 중복제거 & 엑셀변환)
│   ├── result/                  #  크롤링 데이터 저장 폴더
│   │   ├── 2025-02-15/           #  날짜별 폴더 (자동 생성)
│   │   │   ├── star_merged.xlsx  #  회사별로별점추가된 데이터 엑셀파일
│   │   │   ├── star_merged.json  #  mareged_jobs.json에서 회사별로별점추가된 데이터
│   │   │   ├── merged_jobs.json  #  크롤링후 합쳐진 중복제거된 데이터
│   │   │   ├── saramin_jobs.json #  사람인 크롤링 데이터
│   │   │   ├── jobkorea_jobs.json#  잡코리아 크롤링 데이터
│   ├── dto/
│   │   ├── JobListingDto.ts     # DTO 정의 (채용 공고 데이터 타입)
│   ├── functions/
│   │   ├── puppeteerSetup.ts     # Puppeteer 초기화 관련 코드 (브라우저 설정)
│   │   ├── autoScroll.ts         #  무한 스크롤 함수 (점핏, 원티드등등 무한스크롤형식인사이트사용)
│   │   ├── saveToFile.ts         #  JSON 파일 저장 함수 (날짜별로 저장)
|   |   ├── starMergeCompany.ts   #  JSON 파일 병합 함수 (회사별로 별점 추가)
│   │   ├── mergeJobs.ts         #  JSON 파일 병합 함수 (중복제거)
│   │   ├── convertJsonToExcel.ts     #  JSON 파일 엑셀로 변환 함수
│   │   ├── crawlers/             #  사이트별 크롤러 폴더
│   │   │   ├── blindScraper.ts   #  블라인드 크롤러(별점확인위해 회사들을 하나하나 검색후 크롤링)
│   │   │   ├── getScraperConfig.ts  #  크롤러 설정 (사이트별로 크롤링할 타겟설정 ,새로운사이트추가나,해당사이트url이나 Css가 변경될시 여기 수정해야함) 
│   │   │   ├── createAutoScrollScraper.ts  # 사이트가 무한스크롤방식일때 사용 (무한 스크롤)
│   │   │   ├── createPagingScraper.ts  # 사이트가 페이징방식일때 사용 (페이지네이션)
│── package.json                  # 프로젝트 패키지 관리
│── tsconfig.json                  # TypeScript 설정
│── README.md                      # 프로젝트 설명 문서


```
---
## 🛠 사이트 추가
- **새로운 사이트를 추가 및 기존사이트 크롤링이**안된다면 `src/functions/crawlers/getScraperConfig.ts` 파일에서
- 새로운 페이지형식에 맞춰 추가 및 수정 해야합니다.
- **getScraperConfig.ts**에 페이지추가후 **index.ts**에서  Const scrapers = [
  createAutoScrollScraper("wanted", searchKeyword),
  createAutoScrollScraper("jumpit", searchKeyword),
  createPaginationScraper("jobkorea", searchKeyword, 5),
  createPaginationScraper("saramin", searchKeyword, 2),
  createPaginationScraper("catch", searchKeyword, 2),
  createAutoScrollScraper("새로운사이트", searchKeyword),
];
- 형식에 해당사이트 페이징 형식에 맞춰 추가합니다.
- 
- ex) Devops검색시 Devops 뿐만아니라 추가로 여러가지 공고들이나오는데 mergeJobs.ts 40번째줄에서  추가 설정할 수 있습니다.
- Default = ["devops", "데브옵스", "infra", "클라우드", "cloud", "운영"];
- 

