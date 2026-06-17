---
name: dev-workflow
description: GitHub Issues 기반 개발 워크플로우 자동화 Skill. 구현 순서 계획(/seq-plan), 이슈 단위 자동 구현(/issue-start), 전체 파이프라인 실행(/run)을 제공. GitHub 이슈 작업 시작, 구현 계획 수립, 개발 자동화가 필요할 때 사용.
---

# Dev Workflow

GitHub Issues + Milestone 기반 개발 워크플로우 자동화.

## 슬래시 커맨드

- `/run` — 전체 파이프라인 오케스트레이터 (계획 → 구현 → PR → 종료)
- `/seq-plan {Milestone번호}` — 구현 순서 계획 수립
- `/issue-start {이슈번호}` — 이슈 단위 자동 구현

## 빠른 시작

```bash
# 1. 최초 1회: 이슈/Milestone 생성
/issue-init

# 2. 전체 파이프라인 실행
/run
```

## 상세 가이드

- 전체 파이프라인: [run.md](run.md)
- 구현 순서 계획: [seq-plan.md](seq-plan.md)
- 이슈 단위 구현: [issue-start.md](issue-start.md)
- 리스크 판단 기준: [checks/risk.md](checks/risk.md)
- 코드 품질 기준: [checks/quality.md](checks/quality.md)

## 전제 조건

- `gh` CLI 설치 및 인증 완료
- `docs/기능명세서.md` 존재
- GitHub Labels: `in-progress`, `paused`
- 브랜치 전략: `main → dev → feature/{milestone-kebab-case}`
