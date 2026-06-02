# /seq-plan patch — 새 이슈 추가

### Step 1 — 기존 seq-plan.md 읽기 (자동)
docs/seq-plan.md 없으면:
"seq-plan.md가 없습니다. /seq-plan으로 먼저 전체 계획을 세워주세요." 출력 후 종료.

### Step 2 — 새 이슈 파악 (자동)
GitHub Issues에서 seq-plan.md에 없는 이슈 탐지:
```bash
gh issue list --state open
```

### Step 3 — 새 이슈 의존성 분석 + 삽입 위치 제안 ⚠️ (사람 개입)
새 이슈의 의존성 분석 후 어느 청크에 삽입할지 제안:

```
새 이슈 발견:
- #12 [1.4.1] 입력 폼 애니메이션

의존성 분석:
depends_on: #1 (UI 컴포넌트 필요)
recommends: #3

삽입 위치 제안: Chunk 1 마지막
이대로 추가할까요? (y / 다른 위치 지정)
```

### Step 4 — docs/seq-plan.md 업데이트 (자동)
승인되면 해당 위치에 이슈 삽입 후 저장.
