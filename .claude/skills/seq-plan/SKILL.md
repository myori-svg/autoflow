---
name: seq-plan
description: 구현 순서 계획 수립 Skill. GitHub Issues 의존성 분석 + 청크 구성 + docs/seq-plan.md 저장. /seq-plan으로 전체 분석, /seq-plan patch로 새 이슈 추가, /seq-plan reorder로 순서 재조정. 구현 시작 전 또는 이슈 추가/변경 시 사용.
---

# Seq Plan

구현 순서 계획 수립 + 의존성 분석.
dev-workflow Skill이 이 파일을 읽어서 구현 순서를 결정함.

## 모드

- `/seq-plan` → [full.md](full.md) — Milestone 전체 재분석
- `/seq-plan patch` → [patch.md](patch.md) — 새 이슈만 추가 분석
- `/seq-plan reorder` → [reorder.md](reorder.md) — 청크 순서 재조정

## 저장 형식

[schema.md](schema.md) 참조.

## 전제 조건

- GitHub Issues + Milestone 생성 완료 (`/issue-init` 실행 후)
- `gh` CLI 인증 완료
