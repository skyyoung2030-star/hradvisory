# HCG Master · Guided Tour (Vite)

5분 인터랙티브 컨설팅 체험. **Vite + React 18 + React Router + Tailwind + Supabase**.

Bolt(WebContainer)에서 잘 동작하도록 Next.js → Vite로 마이그레이션한 버전입니다. 디자인 · 카피 · 흐름은 동일.

---

## Bolt에서 시작하기 (3단계)

1. 폴더 전체 import (zip 풀어서 드래그)
2. Bolt가 자동으로 `npm install` 돌립니다
3. 자동으로 `npm run dev` → preview 자동 열림

**Supabase 없어도 동작합니다** (mock 모드). 데이터 저장만 안 됨.

---

## Supabase 연결하기 (선택)

1. Supabase 대시보드에서 새 프로젝트 만들기
2. SQL 에디터에 붙여넣기:

   ```sql
   create table if not exists leads (
     id          uuid primary key default gen_random_uuid(),
     name        text,
     email       text,
     phone       text,
     company     text,
     tier        text,
     status      text not null default 'diagnosing',
     metadata    jsonb default '{}'::jsonb,
     created_at  timestamptz default now()
   );

   create table if not exists turnkey_clicks (
     id          uuid primary key default gen_random_uuid(),
     source      text,
     created_at  timestamptz default now()
   );

   -- RLS: anon 키로 insert 허용 (read는 막아둠)
   alter table leads enable row level security;
   alter table turnkey_clicks enable row level security;

   create policy "anon insert leads" on leads
     for insert to anon with check (true);
   create policy "anon insert turnkey" on turnkey_clicks
     for insert to anon with check (true);
   ```

3. Project Settings → API에서 URL과 anon key 복사
4. `.env.example`을 `.env`로 복사하고 키 채우기:

   ```
   VITE_SUPABASE_URL=https://....supabase.co
   VITE_SUPABASE_ANON_KEY=eyJ...
   ```

5. dev 서버 재시작

---

## 구조

```
src/
├── main.tsx                    엔트리 + Router
├── App.tsx                     라우트 테이블
├── index.css                   Tailwind + 디자인 토큰
├── pages/
│   ├── Welcome.tsx             /
│   ├── Step1Diagnose.tsx       /tour/1-diagnose
│   ├── Step2Demo.tsx           /tour/2-demo
│   ├── Step3Deliverables.tsx   /tour/3-deliverables
│   ├── Step4Process.tsx        /tour/4-process
│   ├── Step5BeforeAfter.tsx    /tour/5-before-after
│   └── Step6Master.tsx         /tour/6-master
├── components/
│   ├── TourLayout.tsx          Outlet + ProgressBar
│   ├── TourProgressBar.tsx     상단 진행률 바
│   ├── TourNav.tsx             하단 Prev/Next
│   └── StepShell.tsx           각 step 공통 wrapper
└── lib/
    ├── tour-config.ts          7-step 단일 소스 (여기서만 수정하면 라우팅/UI 따라옴)
    ├── templates.ts            20+ HR 템플릿 데이터
    ├── pain-impact-map.ts      Before/After 매핑
    ├── claude-mock.ts          Step 2 채팅 mock 응답
    ├── supabase.ts             클라이언트 (lazy)
    ├── api.ts                  /api/* 대체 (lead 저장 · 클릭 추적 · 채팅)
    └── utils.ts                cn() 헬퍼
```

---

## 새 스텝 추가하려면

`src/lib/tour-config.ts`의 `TOUR_STEPS` 배열만 수정하세요. ProgressBar, Prev/Next, 라우팅이 거기서 따라옵니다 (`src/App.tsx`에 Route 한 줄만 추가).

---

## 채팅을 진짜 Claude로 바꾸려면

`src/lib/api.ts`의 `getChatReply()`를 Supabase Edge Function 호출로 교체하세요. (브라우저에서 Anthropic API 직접 호출은 CORS로 막힙니다.)

```ts
export async function getChatReply(messages: ChatMessage[]): Promise<string> {
  const r = await fetch(
    `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/chat`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
      },
      body: JSON.stringify({ messages }),
    },
  );
  const { reply } = await r.json();
  return reply;
}
```

Edge Function 쪽에서 `Deno.env.get("ANTHROPIC_API_KEY")`로 호출.
