#!/bin/bash
# [Stop Hook] 세션 종료 시 GitHub 이슈 상태 자동 업데이트
#
# 동작 순서:
#   1. gh auth 상태 확인 → 실패 시 경고만 출력하고 종료
#   2. 브랜치명에서 이슈 번호 파싱 → 없으면 아무것도 안 하고 조용히 종료
#   3. 라벨(in-progress, paused) --force로 자동 생성 (이미 있어도 에러 없음)
#   4. in-progress → paused 전환 + 작업 중단 코멘트 추가
#
# 비차단 보장: gh 명령 실패해도 || true 처리, main() 실패해도 exit 0으로 종료

set +e  # 개별 명령 실패해도 스크립트 계속 실행

main() {
  # 1. gh auth 상태 확인
  if ! gh auth status 2>/dev/null; then
    echo '{"systemMessage": "[경고] gh 인증 실패. 이슈 상태 업데이트 스킵"}'
    return 0
  fi

  # 2. 브랜치명에서 이슈 번호 파싱
  #    파싱 실패 시 아무것도 안 하고 조용히 종료
  local BRANCH ISSUE
  BRANCH=$(git rev-parse --abbrev-ref HEAD 2>/dev/null)
  ISSUE=$(echo "$BRANCH" | grep -oE '#[0-9]+' | tr -d '#' | head -1)

  if [ -z "$ISSUE" ]; then
    return 0
  fi

  # 3. 라벨 자동 생성 (--force: 이미 있어도 에러 없이 통과)
  gh label create "in-progress" --color "0075ca" --description "작업 진행 중" --force 2>/dev/null || true
  gh label create "paused"      --color "e4e669" --description "작업 일시 중단" --force 2>/dev/null || true

  # 4. in-progress → paused 전환 (gh 실패해도 클코 종료 막지 않음)
  gh issue edit "$ISSUE" --remove-label "in-progress" --add-label "paused" 2>/dev/null || true

  # 작업 중단 코멘트 자동 추가
  local TIMESTAMP
  TIMESTAMP=$(date '+%Y-%m-%d %H:%M:%S')
  gh issue comment "$ISSUE" --body "작업 중단: ${TIMESTAMP}" 2>/dev/null || true

  echo "{\"systemMessage\": \"이슈 #${ISSUE} → paused 처리 완료 (${TIMESTAMP})\"}"
}

# main 실패해도 반드시 exit 0 (클코 세션 종료를 절대 막지 않음)
main || true
exit 0
