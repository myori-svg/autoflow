# /issue-start — 이슈 단위 자동 구현

전체 상세 워크플로우. SKILL.md에서 참조됨.
리스크 판단: [checks/risk.md](checks/risk.md)
코드 품질: [checks/quality.md](checks/quality.md)

---

# issue-start

이슈 번호를 받아 seq-plan.md 기반으로 청크 단위 구현을 진행하는 커맨드.

## 사용법

```
/issue-start {이슈번호}
```

예시: `/issue-start 23`

---

## 실행 절차

`$ARGUMENTS`를 이슈 번호로 사용해. 아래 순서를 정확히 따라:

### Step 0 — 의존성 체크 (자동)

이슈 본문에서 depends_on 파싱:
```bash
gh issue view $ARGUMENTS --json body
```

depends_on에 적힌 이슈 번호들 상태 확인:
```bash
gh issue view {번호} --json state,title
```

결과 처리:
- 모두 closed → 통과, Step 0.5 진행
- open인 이슈 있으면:
```
⛔ 선행 이슈가 완료되지 않았습니다.

depends_on:
- #1 [1.1.1] 할일 제목 입력 필드 UI → ✅ closed
- #2 [1.1.2] 할일 제목 입력값 저장 → ⚠️ open (미완료)

#2를 먼저 완료해주세요.
강제로 진행하시겠습니까? (y/n)
```
  - y → 경고 후 Step 0.5 진행
  - n → 종료

depends_on 없거나 "없음"이면 → 체크 스킵, Step 0.5 바로 진행

---

### Step 0.5 — 입력 검증

`$ARGUMENTS`가 비어있거나 숫자가 아니면:
```
사용법: /issue-start {이슈번호}
예시: /issue-start 23
```
출력 후 종료.

---

### Step 1 — seq-plan.md 확인 (자동)
`docs/seq-plan.md` 읽기.
- 파일 없으면: "`/seq-plan` 먼저 실행해주세요." 출력 후 종료.
- 파일 있으면: 입력받은 이슈 번호가 속한 청크 파악.

---

### Step 2 — 이슈 읽기 (자동)
해당 청크의 이슈 목록 순서대로 읽기:
```bash
gh issue view {이슈번호}
```

조회 실패 시: `"이슈 #$ARGUMENTS 를 찾을 수 없습니다."` 출력 후 종료.

---

### Step 3 — 브랜치 생성 (자동)
Milestone 단위 브랜치 생성 or 체크아웃:
- 있으면 체크아웃만
- 없으면 생성
```bash
git checkout -b feature/{milestone-kebab-case}
# 또는
git checkout feature/{milestone-kebab-case}
```

체크아웃 후 기존 브랜치면 `"기존 브랜치로 전환했습니다."` 를 결과에 포함.

---

### Step 4 — 리스크 판단 + 구현 계획 (조건부 자동)

아래 기준으로 리스크 자동 판단:

**🟢 낮음** (자동 진행):
- 새 파일 생성
- UI 컴포넌트 추가
- 단순 CRUD 구현

**🟡 보통** (계획 출력 후 자동 진행):
- 기존 파일 수정
- API 연동
- 상태 관리 변경

**🔴 높음** (승인 요청 후 진행):
- DB 스키마 변경
- 기존 로직 대규모 수정
- 여러 파일에 걸친 리팩토링
- 외부 API 키 관련 작업
- 컴포넌트 계층 구조 변경 (props drilling 발생 가능성)
- 새로운 아키텍처 패턴 도입
- 3개 이상 컴포넌트에 영향을 미치는 상태 변경
- 공통 훅/유틸 신규 생성

설계 체크 (자동 분석):

**client/ 파일 포함 시 → React 체크**
- Props drilling 발생 여부 (2단계 이상이면 🔴)
- 영향받는 컴포넌트 수 (3개 이상이면 🔴)
- useEffect 의존성 배열 누락 또는 과다 선언
- 컴포넌트 200줄 이상 (🔴)
- 비즈니스 로직이 컴포넌트 안에 있는지 (🔴)
- key prop 누락 또는 index를 key로 사용
- try/catch 없는 fetch 호출

**server/ 파일 포함 시 → Express 체크**
- routes에 비즈니스 로직 직접 작성 여부 (🔴)
- 에러 미들웨어 없이 에러 처리
- 환경변수 하드코딩 여부 (🔴)
- MongoDB 쿼리에 사용자 입력 직접 삽입 여부 (🔴)
- try/catch 없는 async 함수

**공통 체크**
- API 키 코드에 직접 노출 (🔴)
- CORS 설정 * 로 전체 허용 (🔴)
- 함수 단일 책임 원칙 위반
- 중복 코드 3번 이상 반복
- 매직 넘버/문자열 상수화 안 된 경우
- 기존 아키텍처(CLAUDE.md 기준)와 충돌 여부 (🔴)

출력 형식:
```
## 구현 계획 — #{이슈번호} ({청크명} {n}/{전체})

리스크: 🟢 낮음 / 🟡 보통 / 🔴 높음
판단 근거: (한 줄 설명)

### 설계 체크 결과
- [client] Props drilling: ✅ 이상 없음
- [server] routes 분리: ⚠️ controller 분리 필요
- [공통] API 키 노출: ✅ 이상 없음

### 생성/수정할 파일
- `파일경로` — 역할 설명

### 구현 순서
1. ...
2. ...
```

- 🟢 → 바로 Step 5 진행
- 🟡 → 계획 출력 후 자동으로 Step 5 진행
- 🔴 → "승인하시겠습니까? (y/n)" 대기 후 진행

---

### Step 5 — in-progress 라벨 추가

```bash
gh issue edit $ARGUMENTS --add-label "in-progress"
```

라벨이 없어서 실패하면 먼저 생성 후 재시도:
```bash
gh label create "in-progress" --color "0075ca" --description "작업 진행 중" --force
gh issue edit $ARGUMENTS --add-label "in-progress"
```

---

### Step 6 — 코드 구현 (자동)
CLAUDE.md 코딩 컨벤션 준수하며 구현.
구현 중 막히면 스스로 해결하고 계속 진행.

---

### Step 7 — 검증 (자동)
1. `npm run lint` 실행 → 오류 있으면 자동 수정 후 재실행
2. 이슈 수용 기준 체크:
```
✅ 1. 할일 제목 입력 필드 제공
✅ 2. 최대 100자 제한
❌ 3. 실시간 유효성 검사 → 자동 수정 후 재체크
```
모든 항목 ✅ 될 때까지 자동 반복.

---

### Step 8 — 커밋 (자동)
.gitmessage 형식으로 커밋 메시지 작성.
마지막 줄에 `Closes #{이슈번호}` 포함.
```bash
git push origin {현재 브랜치명}
```

---

### Step 9 — seq-plan.md 업데이트 (자동)
완료된 이슈 체크박스 업데이트:
```
- [x] #1 [1.1.1] 할일 제목 입력 필드 UI  ← 완료 표시
```

---

### Step 10 — 청크 내 다음 이슈 처리 (자동)
청크 내 다음 이슈 있으면 → Step 2부터 자동으로 재시작.
청크 내 모든 이슈 완료 시 → Step 11로 진행.

---

### Step 11 — PR 생성 (자동)
```bash
gh pr create \
  --title "[Chunk {n}] {청크 이름}" \
  --body "## 구현 내용\n{청크 내 완료된 이슈 목록}\n\n## 관련 이슈\n{Closes #1\nCloses #2\n...}" \
  --base dev \
  --head {현재 브랜치명}
```

---

### Step 12 — 다음 청크 확인 → 승인 요청 ⚠️
```
✅ Chunk {n} [{청크 이름}] 완료
🔗 PR: {PR URL}

다음 청크:
- Chunk {n+1} — {청크 이름}
  - #3 [1.2.1] 마감일 캘린더 피커 UI
  - #4 [1.2.2] 마감일 입력값 저장

다음 청크 시작할까요? (y/n)
```
y 입력 시 다음 청크 첫 번째 이슈로 Step 2 재시작.

Milestone 내 모든 청크 완료 시:
```
✅ Milestone [{Milestone명}] 완료!

다음 Milestone:
- {다음 Milestone명}

/seq-plan {다음 Milestone번호} 로 계획을 먼저 세워주세요.
```
