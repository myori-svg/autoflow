# CLAUDE.md

## 프로젝트 개요
- 프로젝트명: autoflow
- 설명: 할일 + 마감일 입력하면 AI가 소요시간 추정 + 일정 자동 배분해주는 캘린더 앱

## 기술 스택
- Frontend: React + TypeScript + Vite + Tailwind CSS + FullCalendar
- Backend: Express + Node.js
- Database: MongoDB Atlas
- External API: Gemini Flash 2.0
- Linter: ESLint

## 디렉토리 구조
```
autoflow/
├── client/
│   └── src/
│       ├── components/
│       ├── hooks/
│       ├── api/
│       └── pages/
├── server/
│   └── src/
│       ├── routes/
│       ├── controllers/
│       ├── models/
│       └── services/
├── docs/
├── .claude/
│   ├── skills/
│   └── commands/
├── .gitignore
├── .gitmessage
└── CLAUDE.md
```

## 코딩 컨벤션

### Frontend
- `type`으로 통일 (`interface`와 혼용 금지)
- `import type` 필수 (verbatimModuleSyntax)
- 함수형 컴포넌트만 사용
- 커스텀 훅으로 비즈니스 로직 분리
- App.tsx는 구조 셸 역할만

### Backend
- Layered Architecture: routes → controllers → services → models
- 환경변수는 .env로 관리, 절대 커밋 금지
