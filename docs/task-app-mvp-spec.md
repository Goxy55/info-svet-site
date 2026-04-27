# TaskFlow MVP specifikacija

Datum: 2026-04-25

## 1) Cilj
Napraviti web aplikaciju za pracenje:
- dnevnih obaveza
- taskova
- projekata
- ideja
- nedeljnih/mesecnih planova

Aplikacija mora biti responsive i dostupna sa telefona i desktopa.

## 2) MVP ekrani

### 2.1 Login / Registracija
- Email + password autentikacija.
- Reset password.

### 2.2 Dashboard (Danas)
- Top 3 prioriteta za danas.
- Lista taskova za danas.
- Brzi unos novog taska.
- Pregled kasnjenih taskova.

### 2.3 Projects
- Lista projekata (Active, On Hold, Done).
- Detalj projekta:
  - opis
  - milestone-ovi
  - povezani taskovi

### 2.4 Tasks
- Globalna lista taskova sa filterima:
  - status
  - projekat
  - prioritet
  - rok
- Kanban prikaz: TODO / In Progress / Done.

### 2.5 Ideas (Inbox)
- Brzi unos ideje.
- Konverzija ideje u task ili projekat.

### 2.6 Plans
- Daily plan (datum + fokus).
- Weekly plan (ciljevi nedelje).
- Monthly plan (tema/cilj meseca).

## 3) Tok rada korisnika
1. Korisnik se prijavi.
2. Unese ideju u Inbox.
3. Ideju pretvori u task ili projekat.
4. Tasku doda rok, prioritet i status.
5. Na Dashboard-u svakog dana bira top 3 prioriteta.
6. Na kraju dana zatvara zavrsene taskove.

## 4) Tehnologije
- Frontend: Next.js 14 + TypeScript + Tailwind CSS
- Backend/Baza/Auth: Supabase
- Hosting: Vercel

## 5) API funkcionalnosti (MVP)
- Auth (signup/login/logout/reset)
- CRUD: projects
- CRUD: tasks
- CRUD: ideas
- CRUD: plans
- Promena statusa taska (kanban drag/drop)

## 6) Metrike uspeha
- Korisnik moze da napravi projekat i bar 5 taskova za < 5 min.
- Svi taskovi vidljivi i upotrebljivi na mobilnom bez horizontalnog skrola.
- Uspesna konverzija ideje u task/projekat u 1-2 klika.

## 7) Sledeca iteracija (posle MVP)
- Notifikacije/podsetnici (email/push)
- Ponavljajuci taskovi
- Attachments
- Time tracking
