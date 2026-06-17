# 코드 품질 체크 기준

## client/ 파일 → React 체크
- Props drilling 2단계 이상 (🔴)
- 영향받는 컴포넌트 3개 이상 (🔴)
- useEffect 의존성 배열 누락 또는 과다 선언
- 컴포넌트 200줄 이상 (🔴)
- 비즈니스 로직이 컴포넌트 안에 있는지 (🔴)
- key prop 누락 또는 index를 key로 사용
- try/catch 없는 fetch 호출

## server/ 파일 → Express 체크
- routes에 비즈니스 로직 직접 작성 (🔴)
- 에러 미들웨어 없이 에러 처리
- 환경변수 하드코딩 (🔴)
- MongoDB 쿼리에 사용자 입력 직접 삽입 (🔴)
- try/catch 없는 async 함수

## 공통 체크
- API 키 코드에 직접 노출 (🔴)
- CORS 설정 * 전체 허용 (🔴)
- 함수 단일 책임 원칙 위반
- 중복 코드 3번 이상 반복
- 매직 넘버/문자열 상수화 안 된 경우
- CLAUDE.md 아키텍처 기준 충돌 (🔴)
