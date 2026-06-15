# Seq Plan — MVP Core Flow
생성일: 2026-06-02
상태: 완료

---

## Chunk 1 — 프로젝트 초기 세팅 (✅ 완료)
브랜치: dev (직접 커밋)
depends_on: 없음

- [x] client 초기화 (Vite + React + TS + Tailwind)
- [x] server 초기화 (Express + MongoDB Atlas)
- [x] 환경변수 설정 (.env, .gitignore)
      note: 이슈 없는 세팅 작업

---

## Chunk 2 — 할일 입력 UI (✅ 완료)
브랜치: feature/todo-input → dev
depends_on: Chunk 1

- [x] #1 [1.1.1] 할일 제목 입력 필드 UI
      depends_on: 없음 / blocks: #2
- [x] #3 [1.2.1] 캘린더 피커 컴포넌트 구현
      depends_on: 없음 / blocks: #4
- [x] #2 [1.1.2] 할일 제목 입력값 저장
      depends_on: #1 / blocks: 없음
- [x] #4 [1.2.2] 마감일 선택 저장
      depends_on: #3 / blocks: #5
- [x] #5 [1.2.3] 마감일 유효성 검사
      depends_on: #3, #4 / blocks: 없음

---

## Chunk 3 — Gemini API 연동 (✅ 완료)
브랜치: feature/gemini-api → dev
depends_on: Chunk 2

- [x] #6 [2.1.1] Gemini API 클라이언트 설정
      depends_on: 없음 / blocks: #7
- [x] #7 [2.1.2] 소요시간 추정 프롬프트 설계
      depends_on: #6 / blocks: #8
- [x] #8 [2.2.1] 일정 자동 배분 로직
      depends_on: #7 / blocks: 없음

---

## Chunk 4 — 캘린더 뷰 (✅ 완료)
브랜치: feature/calendar-view → dev
depends_on: Chunk 3

- [x] #14 [3.1.1] 주간 캘린더 레이아웃 구현
      depends_on: 없음 / blocks: #15
- [x] #15 [3.1.2] 주간 네비게이션
      depends_on: #14 / blocks: 없음
- [x] #22 [3.4.2] 캘린더 UI 즉시 반영 ← GitHub상 closed 확인됨 (이전 SKIPPED 메모와 불일치, 구현 여부 재확인 필요)
      depends_on: #14 / blocks: 없음

---

## Chunk 5 — 드래그 앤 드롭 일정 조정 (✅ 완료)
브랜치: feature/drag-drop-schedule → dev
depends_on: Chunk 4

- [x] #16 [3.2.1] 드래그 앤 드롭 감지
      depends_on: 없음 / blocks: #17
- [x] #17 [3.2.3] 드롭 후 변경된 일정 DB 저장
      depends_on: #16 / blocks: #18, #21
- [x] #18 [3.2.4] 충돌 감지 및 경고
      depends_on: #17 / blocks: 없음

---

## Chunk 6 — 할일 상세 편집 (✅ 완료)
브랜치: feature/task-detail-edit → dev
depends_on: Chunk 4 (Chunk 5와 병렬 진행 가능)

- [x] #19 [3.3.1] 할일 블록 클릭 감지
      depends_on: 없음 / blocks: #20
- [x] #20 [3.3.2] 세부 정보 편집 폼
      depends_on: #19 / blocks: #21

---

## Chunk 7 — 실시간 데이터 동기화 (✅ 완료)
브랜치: feature/realtime-sync → dev
depends_on: Chunk 5, Chunk 6

- [x] #21 [3.4.1] 실시간 데이터 동기화
      depends_on: #17, #20 / blocks: 없음

---

## Chunk 8 — 마감일 시간 선택 (✅ 완료)
브랜치: feature/deadline-time-picker → dev
depends_on: Chunk 2

- [x] #51 [1.2.4] 마감일 시간 선택 기능
      depends_on: #3, #4 / blocks: 없음

---

## Chunk 9 — AI 기반 일정 자동 배분 (아이젠하워 매트릭스) (✅ 완료)
브랜치: feature/auto-schedule-matrix → dev
depends_on: Chunk 8

- [x] #53 [2.1.3] 할일 일정 optional화 (미배치 상태 지원)
      depends_on: 없음 / blocks: #10, #11, #9
- [x] #10 [2.3.1] 마감일+중요도 기반 우선순위 계산 (아이젠하워 매트릭스)
      depends_on: #53 / blocks: #11
- [x] #11 [2.3.2] 우선순위 기반 일정 배치
      depends_on: #10 / blocks: #9
- [x] #9 [2.2.2] 자동 배분 실행 로직
      depends_on: #11 / blocks: 없음
