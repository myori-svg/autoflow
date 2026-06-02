# /seq-plan reorder — 청크 순서 재조정

### Step 1 — 기존 seq-plan.md 읽기 (자동)
docs/seq-plan.md 없으면 종료.

### Step 2 — 현재 청크 구조 출력 (자동)
현재 청크 목록과 의존성 관계 출력.

### Step 3 — 재조정 요청 받기 ⚠️ (사람 개입)
```
현재 청크 구조:
Chunk 1 → Chunk 2 → Chunk 3

어떻게 바꿀까요?
```
나의 지시에 따라 순서 변경.
의존성 위반 발생 시 경고:
"⚠️ Chunk 3은 Chunk 1에 depends_on이 있어서 앞으로 이동할 수 없습니다."

### Step 4 — docs/seq-plan.md 업데이트 (자동)
확정되면 저장.
