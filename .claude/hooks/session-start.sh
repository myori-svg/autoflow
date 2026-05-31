#!/bin/bash
# [SessionStart Hook] 세션 시작 시 GitHub 이슈 상태 확인 및 라벨 자동 전환
#
# 동작 순서:
#   1. gh auth 상태 확인 → 실패 시 안내 메시지 출력 후 조용히 종료 (에러 코드 없음)
#   2. Milestone 존재 여부 확인 → 없으면 /issue-init 실행 안내 후 종료
#   3. 브랜치명에서 이슈 번호 파싱 → 없으면 조용히 종료
#   4. 라벨(in-progress, paused) --force로 자동 생성 (이미 있어도 에러 없음)
#   5. paused 라벨이 있으면 → paused 제거 + in-progress 추가 + 안내 메시지 출력

# 1. gh auth 상태 확인
#    인증 실패 시 안내 메시지만 출력하고 exit 0 (세션 시작 막지 않음)
if ! gh auth status 2>/dev/null; then
  echo "{\"systemMessage\": \"⚠️  GitHub CLI 인증이 필요합니다. 아래 명령어를 실행해주세요:\\ngh auth login\"}"
  exit 0
fi

# 2. Milestone 존재 여부 확인
#    Milestone이 없으면 /issue-init 실행 안내 후 종료
MILESTONES=$(gh api repos/:owner/:repo/milestones 2>/dev/null)
if [ "$MILESTONES" = "[]" ] || [ -z "$MILESTONES" ]; then
  echo "{\"systemMessage\": \"⚠️  GitHub Milestone이 없습니다. 아래 커맨드를 먼저 실행해주세요:\\n/issue-init\"}"
  exit 0
fi

# 3. 현재 브랜치에서 #숫자 패턴 추출 (feature/#23-xxx → 23)
#    git 실패하거나 이슈 번호 없으면 조용히 종료 (에러 없이)
BRANCH=$(git rev-parse --abbrev-ref HEAD 2>/dev/null)
ISSUE=$(echo "$BRANCH" | grep -oE '#[0-9]+' | tr -d '#' | head -1)

if [ -z "$ISSUE" ]; then
  exit 0
fi

# 4. 라벨 자동 생성 (--force: 이미 있어도 에러 없이 통과)
gh label create "in-progress" --color "0075ca" --description "작업 진행 중" --force 2>/dev/null || true
gh label create "paused"      --color "e4e669" --description "작업 일시 중단" --force 2>/dev/null || true

# 5. 이슈 제목 조회 (gh --template 플래그로 파싱)
TITLE=$(gh issue view "$ISSUE" --json title --template '{{.title}}' 2>/dev/null)
if [ -z "$TITLE" ]; then
  echo "{\"systemMessage\": \"이슈 #${ISSUE} 조회 실패\"}"
  exit 0
fi

# 라벨 목록 조회 (공백 구분 → ", " 구분으로 변환)
LABELS_RAW=$(gh issue view "$ISSUE" --json labels --template '{{range .labels}}{{.name}} {{end}}' 2>/dev/null)
LABELS=$(echo "$LABELS_RAW" | sed 's/ *$//' | sed 's/ /, /g')

# paused 라벨 확인 → in-progress 전환
if echo "$LABELS_RAW" | grep -q "paused"; then
  gh issue edit "$ISSUE" --remove-label "paused" --add-label "in-progress" 2>/dev/null
  echo "{\"systemMessage\": \"이슈 #${ISSUE} [${TITLE}]\\npaused → in-progress 전환 완료. 이어서 작업할까요?\"}"
else
  echo "{\"systemMessage\": \"이슈 #${ISSUE} [${TITLE}] 작업 중 (라벨: ${LABELS})\"}"
fi
