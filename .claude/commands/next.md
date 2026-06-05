# .claude/commands/next.md

seq-plan.md 기반으로 현재 진행 상황과 다음 할 일을 보여준다.

1. `docs/seq-plan.md` 읽기
2. 아래 형식으로 출력:

```
📋 현재 진행 상황 ({seq-plan 제목})

✅ 완료: Chunk 1 (프로젝트 초기 세팅), Chunk 2 (할일 입력 UI)
🟡 진행 중: Chunk 3 (Gemini API 연동)
   - [x] #6 Gemini API 클라이언트 설정
   - [ ] #7 소요시간 추정 프롬프트 설계  ← 다음 할 일
⏳ 대기: Chunk 4 (캘린더 뷰)

⏭ 스킵됨: #22 캘린더 UI 즉시 반영 (POST /api/tasks 미구현)

👉 다음: /issue-start 7
```

3. 모든 청크 완료(상태: 완료)인 경우:

```
✅ 모든 청크가 완료됐습니다!

다음 할 일을 선택해 주세요:
1. 새 기능 추가   → /seq-plan patch
2. 새 Milestone 계획 → /seq-plan {번호}
3. 종료
```

4. seq-plan.md 없으면:
"/seq-plan {Milestone번호} 를 먼저 실행해주세요." 출력 후 종료.
