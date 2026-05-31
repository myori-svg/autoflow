# issue-init

`docs/기능명세서.md`를 읽어 GitHub Milestone과 Issue를 자동 생성하는 커맨드.
이미 존재하는 Milestone/Issue는 스킵하므로 중복 없이 재실행 가능.

## 사용법

```
/issue-init
```

---

## 실행 절차

### Step 1 — 기능명세서 읽기

`@docs/기능명세서.md` 파일을 읽어.
파일이 없으면 아래 메시지 출력 후 종료:
```
❌ docs/기능명세서.md 파일이 없습니다. 파일을 먼저 작성해주세요.
```

---

### Step 2 — 기존 Milestone 목록 조회

중복 생성 방지를 위해 현재 존재하는 Milestone 제목 목록을 가져와:

```bash
gh api repos/:owner/:repo/milestones --template '{{range .}}{{.title}}{{"\n"}}{{end}}'
```

---

### Step 3 — 최상위 기능 그룹 추출 → Milestone 생성

기능명세서에서 `숫자. 제목` 형식의 최상위 그룹을 모두 추출해.
예: `1. 할일 입력 및 마감일 설정`, `2. AI 소요시간 추정`, `3. 캘린더 일정 배분`

각 그룹에 대해:
- Step 2에서 조회한 목록에 이미 같은 제목이 있으면 → 스킵
- 없으면 → Milestone 생성:

```bash
gh api repos/:owner/:repo/milestones --method POST -f title="그룹명"
```

생성 후 반환된 Milestone 번호(`id`)를 이후 Issue 연결에 사용.

---

### Step 4 — 🔴 높음 x.x.x 항목 추출 → Issue 생성

기능명세서에서 아래 조건을 모두 만족하는 항목만 추출해:
- 우선순위가 🔴 높음 으로 표시됨
- 번호 형식이 x.x.x 레벨 (예: 1.1.1, 2.3.2)

기존 이슈 목록을 가져와 중복 확인:

```bash
gh issue list --state all --limit 200 --json title --template '{{range .}}{{.title}}{{"\n"}}{{end}}'
```

각 항목에 대해:
- 같은 제목(`[x.x.x] 기능명`)의 이슈가 이미 있으면 → 스킵
- 없으면 → 이슈 생성:

```bash
gh issue create \
  --title "[x.x.x] 기능명" \
  --body "## 수용 기준\n\n{해당 항목의 수용 기준 내용}" \
  --milestone "해당 최상위 그룹명"
```

라벨은 붙이지 말 것.

---

### Step 5 — 결과 출력

생성된 이슈를 아래 형식으로 출력.
스킵된 항목은 표에 포함하지 말 것.

| 이슈 번호 | 제목 | Milestone |
|---|---|---|
| #1 | [1.1.1] 할일 제목 입력 필드 UI 구현 | 1. 할일 입력 및 마감일 설정 |
| #2 | [1.1.2] 마감일 날짜 선택 UI 구현 | 1. 할일 입력 및 마감일 설정 |

생성된 이슈가 없으면 (모두 스킵):
```
✅ 모든 Milestone/Issue가 이미 존재합니다. 추가 생성 없음.
```
