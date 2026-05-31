#!/bin/bash
# [PostToolUse/Write Hook] Write 툴로 파일 저장 후 lint 자동 실행
#
# 동작:
#   - git 저장소 루트를 기준으로 client/package.json 탐색
#   - package.json 없으면 조용히 종료 (파싱 실패 없음)
#   - lint 실패해도 작업 중단하지 않음 (경고 메시지만 출력)
#   - lint 성공 시 아무것도 출력하지 않음 (조용히 통과)

# git rev-parse 실패 시 현재 디렉토리를 fallback으로 사용
PROJECT_ROOT=$(git rev-parse --show-toplevel 2>/dev/null)
if [ -z "$PROJECT_ROOT" ]; then
  PROJECT_ROOT="$(pwd)"
fi
CLIENT_DIR="${PROJECT_ROOT}/client"

# client/package.json 없으면 조용히 종료 (이슈 번호 파싱 실패와 동일하게 처리)
if [ ! -f "${CLIENT_DIR}/package.json" ]; then
  exit 0
fi

# npm 명령 존재 확인
if ! command -v npm &>/dev/null; then
  echo '{"systemMessage": "[경고] npm 없음. lint 스킵"}'
  exit 0
fi

# lint 실행 (stdout+stderr 캡처, 실패해도 계속 진행)
LINT_OUTPUT=$(cd "$CLIENT_DIR" && npm run lint 2>&1)
LINT_EXIT=$?

# lint 실패 시 경고 메시지 출력 (작업 중단하지 않음)
if [ $LINT_EXIT -ne 0 ]; then
  MSG=$(echo "$LINT_OUTPUT" | tail -5 | tr '\n' ' ' | tr '"' "'")
  echo "{}" | jq --arg msg "[Lint 경고] 오류 발생 - 확인 필요: ${MSG}" \
    '{"systemMessage": $msg}'
fi
