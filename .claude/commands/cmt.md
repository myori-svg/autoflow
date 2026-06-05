# .claude/commands/cmt.md (commit)

작업 완료 후 push 준비 단계:
1. 변경된 파일 목록 보여줄 것
2. 사용자 확인 후 해당 파일들 git add
3. 아래 순서로 커밋 메시지 초안 작성 후 사용자 확인 받을 것:
   a. `.gitmessage` 템플릿 형식에 맞춰 작성
   b. 현재 브랜치명에서 이슈 번호 파싱 (예: `feature/#23-todo-input` → `23`)
   c. 이슈 번호가 있으면 커밋 메시지 맨 마지막 줄에 `Closes #23` 추가
   d. 이슈 번호가 없으면 추가하지 말 것
4. 확인 후 git commit -m 으로 실행
5. 그 이후 push는 절대 하지 말 것 — 사용자가 직접 진행
