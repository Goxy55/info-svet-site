---
title: "Plan za web aplikaciju za pracenje zadataka i projekata"
date: 2026-04-25
---

Ako zelis da aplikacija radi na bilo kom uredjaju, najbolji izbor je web aplikacija.

Predlog funkcionalnosti (MVP):
- Dashboard za "danas": top 3 prioriteta + dnevne obaveze.
- Taskovi sa statusima: TODO, In Progress, Done.
- Projekti sa milestone-ovima i povezanim taskovima.
- Lista ideja (Inbox) koju kasnije pretvaras u task ili projekat.
- Kalendar + podsetnici.
- Nedeljni i mesecni planovi.

Predlog stack-a:
- Frontend: Next.js + Tailwind.
- Backend: Supabase (Postgres, Auth, Storage).
- Hosting: Vercel.

Predlog strukture podataka:
- users
- projects
- tasks
- ideas
- plans (daily/weekly/monthly)

Sledeci koraci:
1) Definisi MVP ekran(e) i tok rada.
2) Napravi bazu i osnovne tabele.
3) Implementiraj login i autorizaciju.
4) Dodaj CRUD za taskove/projekte/ideje.
5) Ubaci dashboard i kalendar.
6) Deploy i test sa telefona + desktopa.
