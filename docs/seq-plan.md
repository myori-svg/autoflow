# Seq Plan — MVP Core Flow
생성일: 2026-06-02
상태: 진행 중

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

## Chunk 3 — Gemini API 연동 (⏳ 대기)
브랜치: feature/gemini-api → dev
depends_on: Chunk 2

- [x] #6 [2.1.1] Gemini API 클라이언트 설정
      depends_on: 없음 / blocks: #7
- [x] #7 [2.1.2] 소요시간 추정 프롬프트 설계
      depends_on: #6 / blocks: #8
- [ ] #8 [2.2.1] 일정 자동 배분 로직
      depends_on: #7 / blocks: 없음

---

## Chunk 4 — 캘린더 뷰 (⏳ 대기)
브랜치: feature/calendar-view → dev
depends_on: Chunk 3

- [ ] #14 [3.1.1] 주간 캘린더 레이아웃 구현
      depends_on: 없음 / blocks: #15
- [ ] #15 [3.1.2] 주간 네비게이션
      depends_on: #14 / blocks: 없음
- [ ] #22 [3.4.2] 캘린더 UI 즉시 반영
      depends_on: #14 / blocks: 없음
