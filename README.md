# 챗봇 인터페이스 구현

제공된 LLM API 키와 LLM 모델을 사용하여 단일 챗봇 대화 UI를 구현
아래 내용을 참고하여 설치 및 실행하세요.

---

## 설치 및 실행

1. **레포지토리 클론**

   ```bash
   git clone https://github.com/Boradoris/interx-chatbot.git
   cd interx-chatbot
   ```

2. **의존성 설치**

   ```bash
   # yarn 사용 예시
   yarn install

   # 또는 npm 사용 시
   # npm install

   # 또는 pnpm 사용 시
   # pnpm install
   ```

3. **로컬 환경 실행**

   ```bash
   # Local: http://localhost:3000/
   yarn dev
   ```

---

## 사전 요구사항

- **프레임워크**: React (Next.js, CRA 등 자유 선택)
- **API 연동**: LLM API 활용 (API Key 제공)
- **상태 관리**: useState, useReducer 또는 상태 관리 라이브러리 자유 선택
- **스타일링**: CSS Modules, Tailwind, styled-components 등 자유 선택
- **로컬 저장**: localStorage를 사용하여 챗봇 인스턴스 임시 저장 가능
- **환경 변수 처리**: `.env` 파일을 사용하여 API 키 외부 노출 금지

---

## 프로젝트 구조

```bash
project-root/
... 생략
└── src/
    ├── api/
    ├── assets/
    ├── components/
    ├── pages/
    ├── routes/
    ├── types/
    └── utils/
```
