# /seq-plan patch — 새 기능 추가 (로컬 우선)

GitHub 이슈를 스캔하는 대신, 사용자가 원하는 기능을 대화로 설명하면
Claude가 seq-plan.md를 먼저 업데이트한 뒤 GitHub 이슈를 생성.

---

### Step 1 — 기존 seq-plan.md 읽기 (자동)

`docs/seq-plan.md` 없으면:
```
⚠️ seq-plan.md가 없습니다. /seq-plan으로 먼저 전체 계획을 세워주세요.
```
출력 후 종료.

---

### Step 2 — 추가할 기능 파악 ⚠️ (사람 개입)

```
어떤 기능을 추가하고 싶으신가요?
기능 이름과 간략한 설명을 알려주세요.
```

스킵된 이슈(seq-plan.md에 SKIPPED 표시)가 있으면 함께 안내:
```
⏭ 스킵된 이슈가 있습니다:
- #22 캘린더 UI 즉시 반영

이 이슈를 재오픈해서 추가하시겠습니까, 아니면 새 기능을 추가하시겠습니까?
```

---

### Step 3 — 청크/이슈 구조 제안 (자동)

기존 청크 구조와 의존성을 분석하여 제안:

```
제안:

[새 청크 생성 or 기존 Chunk {n}에 추가]
- 이슈 제목: [{ID}] {기능명}
- depends_on: #{번호} or 없음
- 예상 브랜치: feature/{기능명-kebab}

이대로 진행할까요? (y / 수정 요청)
```

---

### Step 4 — GitHub 이슈 생성 + seq-plan.md 업데이트 (자동)

승인 후:

1. GitHub 이슈 생성:
```bash
gh issue create \
  --title "[{ID}] {기능명}" \
  --body "{기능 설명 및 수용 기준}" \
  --milestone "{현재 Milestone명}"
```

2. 반환된 이슈 번호를 seq-plan.md 해당 위치에 삽입

3. seq-plan.md 상태가 "완료"였으면 → "진행 중"으로 되돌리기

4. 커밋 + 푸시:
```bash
git add docs/seq-plan.md
git commit -m "chore: seq-plan patch - add #{이슈번호} {기능명}"
git push origin {현재 브랜치 or dev}
```

완료 후:
```
✅ 추가 완료
- GitHub 이슈: #{번호} {기능명}
- seq-plan.md 업데이트됨

/issue-start {번호} 로 구현을 시작할 수 있습니다.
```
