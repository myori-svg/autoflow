# .claude/commands/review.md

## 사용법
- `/review` — 전체 코드베이스 정합성 검토
- `/review diff` — git diff 기반 버그 탐지
- `/review full` — 전체 검토 + diff 버그 탐지 통합 실행

---

## 사전 체크 (모든 모드 공통)

시작 전 아래 두 가지를 확인해:

1. 코드 파일 존재 여부: `src/`, `client/src/`, `server/src/` 중 하나에 `.ts` / `.tsx` / `.js` 파일이 있는지 확인
   - 없으면: "리뷰할 코드가 없습니다. 개발 시작 후 다시 실행해주세요." 출력 후 종료

2. `docs/design-system.md` 존재 여부 확인
   - 없으면: 디자인 스펙 항목은 "⏭️ 스킵 (design-system.md 없음)"으로 표시

---

## 기본 모드 (`/review`) — 전체 코드베이스 검토

CLAUDE.md를 읽고 기준을 파악한 뒤 아래 5개 항목을 검토해.
결과는 마크다운 테이블로 출력:

| 항목 | 상태 | 발견 내용 |
|---|---|---|
| 아키텍처 | ✅ / ⚠️ / ❌ | |
| 코드 품질 | ✅ / ⚠️ / ❌ | |
| 스타일 일관성 | ✅ / ⚠️ / ❌ | |
| 디자인 스펙 | ✅ / ⚠️ / ❌ / ⏭️ | |
| 개선 제안 | ✅ / ⚠️ / ❌ | |

### 검토 기준

1. **아키텍처** — CLAUDE.md 폴더 구조 기준 일치 여부, Layered Architecture (routes → controllers → services → models) 준수
2. **코드 품질**
   - 클라이언트 (TS): `any` 타입 사용, `import type` 누락, 불필요한 중복, 매직 넘버
   - 서버 (JS): `console.log` 미제거, 하드코딩된 API 키/값, 불필요한 중복, 매직 넘버
3. **스타일 일관성** — Tailwind 외 인라인 스타일 · CSS 모듈 · styled-components 혼용 여부
4. **디자인 스펙** — docs/design-system.md 기준 이탈 여부 (파일 없으면 스킵)
5. **개선 제안** — 커스텀 훅 분리 필요, 컴포넌트 비대화, 중복 로직 등

발견된 문제는 반드시 [파일명:라인](파일경로#L라인) 형식으로 링크 포함.
수정이 필요한 경우 목록을 보여주고 사용자 확인 후 진행.

---

## diff 모드 (`/review diff`) — 변경사항 버그 탐지

### Step 1 — diff 수집

아래 순서로 시도해서 첫 번째 성공한 결과 사용:
1. `git diff @{upstream}...HEAD`
2. `git diff main...HEAD`
3. `git diff HEAD~1`
4. `git diff HEAD` (uncommitted 변경사항 포함)

실패 케이스별 안내:
- git 저장소 없음 → "git init 후 다시 실행해주세요."
- 커밋 없음 → "첫 커밋 후 다시 실행해주세요."
- 변경사항 없음 → "변경사항이 없습니다."

### Step 2 — 4가지 앵글로 버그 후보 탐색

각 앵글에서 최대 6개 후보 발굴:

- **Line scan** — 변경된 모든 라인 순차 검토. 잘못된 조건, null/undefined 역참조, missing await, falsy-zero 처리, 복붙 오타
- **Removed behavior** — 삭제된 라인이 지키던 불변식·가드·에러 처리가 새 코드에서 복원됐는지 확인
- **Cross-file impact** — 변경된 함수의 호출부(Grep)를 찾아 새 시그니처·반환 타입과 맞는지 검증
- **Altitude** — 특수 케이스 패치인지, 더 깊은 계층에서 근본 수정이 가능한지

### Step 3 — 검증

후보마다 CONFIRMED / PLAUSIBLE / REFUTED 중 하나로 판정:
- CONFIRMED / PLAUSIBLE → 유지
- REFUTED → 코드에서 반증 가능한 경우만 제거 (불확실하면 PLAUSIBLE 유지)

### Step 4 — 결과 출력

| 심각도 | 파일 | 위치 | 요약 | 재현 시나리오 |
|---|---|---|---|---|
| 🔴 Critical | | [파일:라인](경로#L라인) | | |
| 🟡 Warning | | [파일:라인](경로#L라인) | | |
| 🔵 Info | | [파일:라인](경로#L라인) | | |

발견 없으면: "변경사항에서 버그 없음."
수정이 필요한 경우 사용자 확인 후 진행.

---

## full 모드 (`/review full`)

1. 기본 모드 실행 (전체 코드베이스 검토)
2. diff 모드 실행 (변경사항 버그 탐지)
3. 두 결과를 합쳐 아래 형식으로 요약 출력:

```
## 리뷰 요약
- 전체 정합성: X개 항목 이상 / Y개 항목 정상
- 변경사항 버그: Z개 발견
- 우선 수정 대상: (가장 심각한 항목 1~2개)
```
