# issue-start

이슈 번호를 받아 브랜치를 생성하고 GitHub 이슈를 in-progress 상태로 전환하는 커맨드.

## 사용법

```
/issue-start {이슈번호}
```

예시: `/issue-start 23`

---

## 실행 절차

`$ARGUMENTS`를 이슈 번호로 사용해. 아래 순서를 정확히 따라:

### Step 0 — 입력 검증

`$ARGUMENTS`가 비어있거나 숫자가 아니면:
```
사용법: /issue-start {이슈번호}
예시: /issue-start 23
```
출력 후 종료.

---

### Step 1 — 이슈 정보 조회

아래 두 커맨드를 실행해 제목과 Milestone을 각각 가져와:

```bash
gh issue view $ARGUMENTS --json title --template '{{.title}}'
gh issue view $ARGUMENTS --json milestone --template '{{if .milestone}}{{.milestone.title}}{{else}}없음{{end}}'
```

조회 실패 시: `"이슈 #$ARGUMENTS 를 찾을 수 없습니다."` 출력 후 종료.

---

### Step 2 — 브랜치명 결정

`docs/seq-plan.md`를 읽어서 `$ARGUMENTS` 이슈 번호(`#$ARGUMENTS`)가 속한 Chunk를 찾아.

- 찾았으면 → 해당 Chunk의 `브랜치: feature/{기능명} → dev` 라인에서 `feature/{기능명}`을 브랜치명으로 사용 (청크 단위 공유 브랜치).
- `docs/seq-plan.md`가 없거나 이슈가 어느 Chunk에도 속하지 않으면 → 아래 fallback으로 제목을 kebab-case 변환:
  1. 소문자로 변환
  2. 영문, 숫자 이외의 문자(한글, 특수문자 등)는 공백으로 대체
  3. 공백 → 하이픈
  4. 연속 하이픈 → 단일 하이픈
  5. 앞뒤 하이픈 제거
  6. 변환 결과가 비어있으면 `feature`를 fallback으로 사용

  fallback 브랜치명 형식: `feature/#$ARGUMENTS-{변환된제목}`

  예시:
  - `[1.1.1] 할일 제목 입력 필드 UI 구현` → `feature/#1-1-1-1-ui` (seq-plan 미존재 시에만)
  - `Add Todo Input Form UI` → `feature/#1-add-todo-input-form-ui`

---

### Step 3 — 브랜치 생성 및 체크아웃

Step 2에서 결정한 브랜치명을 `{브랜치명}`이라 할 때:

```bash
git checkout -b {브랜치명}
```

브랜치가 이미 존재해서 실패한 경우:
```bash
git checkout {브랜치명}
```
체크아웃 후 `"기존 브랜치로 전환했습니다."` 를 결과에 포함.

---

### Step 4 — in-progress 라벨 추가

```bash
gh issue edit $ARGUMENTS --add-label "in-progress"
```

라벨이 없어서 실패하면 먼저 생성 후 재시도:
```bash
gh label create "in-progress" --color "0075ca" --description "작업 진행 중" --force
gh issue edit $ARGUMENTS --add-label "in-progress"
```

---

### Step 5 — 결과 출력

아래 형식으로 출력 (Milestone이 없으면 해당 줄 생략):

```
✅ 작업 시작
브랜치: feature/drag-drop-schedule
이슈: #16 — [3.2.1] 드래그 앤 드롭 감지
Milestone: 3. 주간 캘린더 시각화 및 수동 조정
상태: in-progress
```

기존 브랜치로 전환한 경우:
```
✅ 작업 재개 (기존 브랜치로 전환했습니다.)
브랜치: feature/drag-drop-schedule
이슈: #16 — [3.2.1] 드래그 앤 드롭 감지
Milestone: 3. 주간 캘린더 시각화 및 수동 조정
상태: in-progress
```
