# docs/seq-plan.md 저장 형식

## 형식

```markdown
# Seq Plan — {Milestone명}
생성일: {날짜}
상태: 진행 중 / 완료

## Chunk {n} — {청크 이름} ({상태})
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
