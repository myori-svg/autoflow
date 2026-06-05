# docs/seq-plan.md 저장 형식

## 형식

```markdown
# Seq Plan — {Milestone명}
생성일: {날짜}
상태: 진행 중 / 완료

## Chunk {n} — {청크 이름} ({상태})
브랜치: feature/{기능명} → dev
depends_on: 없음 / Chunk {n}

- [ ] #1 [1.1.1] 할일 제목 입력 필드 UI
      depends_on: 없음 / blocks: #2
- [x] #2 [1.1.2] 할일 제목 입력값 저장
      depends_on: #1 / blocks: #5
- [ ] #3 [1.2.1] 마감일 캘린더 피커 UI
      depends_on: 없음 / recommends: #1
```

## 청크 상태
- ⏳ 대기: 아직 시작 안 함
- 🟡 진행 중: 일부 이슈 완료
- ✅ 완료: 모든 이슈 closed

## 브랜치 전략
- 브랜치는 청크(기능) 단위로 생성: `feature/{기능명-kebab}`
  - 예: feature/todo-input, feature/gemini-api, feature/calendar-view
- 청크 완료 시 PR (feature/... → dev) 생성 후 브랜치 삭제
- seq-plan.md의 `브랜치:` 필드에 해당 청크 브랜치명 명시

## 스킵 이슈 표기
선행 이슈 미구현 등으로 일시 스킵 시:
```
- [ ] #22 [3.4.2] 기능명 ← SKIPPED ({사유})
```
`/seq-plan patch` 실행 시 스킵 이슈 재오픈 여부 안내.
