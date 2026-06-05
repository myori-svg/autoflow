# /seq-plan — 전체 재분석

### Step 1 — 이슈 목록 수집 (자동)
입력받은 Milestone 번호로 open 이슈 전체 조회:
```bash
gh issue list --milestone "{Milestone명}" --state open
```

### Step 2 — 의존성 분석 + 청크 구성 (자동)
아래 기준으로 이슈 간 의존성 분석:

- `depends_on`: 반드시 선행 완료 필요 (하드 블로킹)
- `blocks`: 이 이슈 완료돼야 다른 이슈 시작 가능
- `recommends`: 먼저 하면 좋지만 블로킹은 아님

분석 기준:
- UI 컴포넌트 → 입력값 저장 → API 연동 레이어 순서
- 같은 레이어끼리는 recommends
- 공통 컴포넌트/훅은 그것에 의존하는 이슈들을 blocks

### Step 3 — docs/seq-plan.md 저장 (자동)
schema.md 형식으로 저장.
브랜치는 청크(기능) 단위로 생성:
- 브랜치명: `feature/{기능명-kebab}` (예: feature/todo-input, feature/calendar-view)
- 청크마다 브랜치를 새로 만들어 작업
- PR은 청크 완료 시 해당 브랜치에서 dev로 생성 후 삭제

이미 존재하면 덮어쓰기.

### Step 4 — 검토 필요 항목 요약 출력 (자동)
저장 완료 후 아래 형식으로 출력:

```
✅ docs/seq-plan.md 저장 완료
📌 브랜치: feature/{기능명} → dev (청크별 분리)

⚠️ 검토 필요 항목:
1. {AI가 판단한 의존성 불확실 케이스}
2. {예상보다 클 수 있는 청크}
3. {병렬 처리 가능하지만 순서대로 잡은 이슈}

수정하려면:
- 청크 순서 변경 → /seq-plan reorder
- 새 이슈 추가 → /seq-plan patch

문제 없으면 /dev-workflow 로 구현을 시작하세요.
```
