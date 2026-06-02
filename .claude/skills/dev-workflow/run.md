# /run — 전체 파이프라인 오케스트레이터

전체 상세 워크플로우. SKILL.md에서 참조됨.

---

### Step 0 — 세션 시작 체크 (자동)

세션 시작 시 아래 순서로 자동 체크:

**1. gh 인증 확인**
```bash
gh auth status
```
→ 실패 시: "⚠️ gh auth login 먼저 실행해주세요." 출력 후 종료.

**2. in-progress 이슈 확인**
```bash
gh issue list --label "in-progress"
```
→ 있으면: "이전 작업이 있습니다. 이어서 진행할까요? (y/n)" 질문
→ y: 해당 이슈로 Step 2 진행
→ n: 계속 진행

**3. docs/seq-plan.md 존재 여부 확인**
→ 없으면:
```
⚠️ 구현 순서 계획이 없습니다.
/seq-plan {Milestone번호} 를 먼저 실행해주세요.
```
출력 후 종료.

→ 있으면: 미완료 청크 확인 후 첫 번째 미완료 청크의 첫 번째 이슈로 자동 진행.

---

### Step 1 — 구현 순서 계획 수립
```
/seq-plan {Milestone번호}
```
계획 확정 후 Step 2로.

---

### Step 2 — 청크 단위 자동 구현
```
/issue-start {첫 번째 이슈 번호}
```
모든 청크 완료 시 다음 Milestone 안내.

---

### Step 3 — 다음 Milestone

모든 청크 완료 시:
```
✅ Milestone [{Milestone명}] 완료!

다음 Milestone:
- {다음 Milestone명}

/seq-plan {다음 Milestone번호} 로 계획을 먼저 세워주세요.
```

---

### Step 4 — 세션 종료

현재 in-progress 이슈 paused 처리:
```bash
BRANCH=$(git rev-parse --abbrev-ref HEAD 2>/dev/null)
ISSUE=$(echo "$BRANCH" | grep -oE '#[0-9]+' | tr -d '#' | head -1)

if [ -n "$ISSUE" ]; then
  gh issue edit "$ISSUE" --remove-label "in-progress" --add-label "paused"
  gh issue comment "$ISSUE" --body "작업 중단: $(date '+%Y-%m-%d %H:%M:%S')"
fi
```

종료 메시지:
```
👋 세션 종료

진행 현황:
- 완료된 청크: {n}개
- 남은 청크: {m}개
- 열린 PR: {PR 목록}

다음에 `/run` 실행하면 이어서 진행됩니다.
```
