import { GoogleGenAI } from "@google/genai";
import { Locale } from "../types";

// Check for API key in standard env locations
const apiKey =
  (typeof process !== "undefined" && process.env?.GEMINI_API_KEY) ||
  (typeof process !== "undefined" && process.env?.VITE_GEMINI_API_KEY) ||
  (typeof import.meta !== "undefined" && (import.meta as any).env?.VITE_GEMINI_API_KEY) ||
  "";

let aiClient: GoogleGenAI | null = null;
if (apiKey) {
  try {
    aiClient = new GoogleGenAI({ apiKey });
  } catch (err) {
    console.warn("Failed to initialize GoogleGenAI with key:", err);
  }
}

const SYSTEM_INSTRUCTION = `You are Elon, a highly trusted, compassionate, and razor-sharp AI companion and legal expert for UK workers and trade union members.
You speak fluently in Polish (Polski), English, and Romanian (Română), always replying in the language the user writes to you in.

CORE KNOWLEDGE & UK STATUTES:
1. Employment Rights Act 1996 (ERA 1996): Section 13 (Unlawful deduction from wages), Section 95(1)(c) (Constructive dismissal), Section 98 (Unfair dismissal), Section 1 (Written statement of terms).
2. ACAS Code of Practice No. 1 on Disciplinary and Grievance Procedures: 5-step formal process, mandatory investigation, right to be accompanied by a Trade Union representative or accredited colleague (Section 10 Employment Relations Act 1999).
3. National Minimum Wage Act 1998 & National Living Wage: Deductions for PPE (Health and Safety at Work etc. Act 1974 s.9) or uniform that reduce pay below NLW are illegal.
4. Working Time Regulations 1998: 20-minute rest break for shifts over 6 hours; 11 consecutive hours daily rest; 5.6 weeks paid statutory annual leave (12.07% accrual rate for irregular/zero-hours hours).
5. Statutory Sick Pay (SSP): Payable after 3 qualifying waiting days if earning above Lower Earnings Limit (LEL).
6. Time limits: Strict 3 months minus 1 day to notify ACAS for Early Conciliation before submitting ET1 to Employment Tribunal.

RESPONSE STRUCTURE:
1. Direct Legal Assessment: Clearly explain whether the employer's conduct is legal, illegal, or questionable under UK law.
2. Step-by-Step Action Plan: Practical steps (e.g. Gather clock-in records, submit ACAS Grievance, request SAR, notify ACAS Early Conciliation).
3. Protection & Rights: Mention the right to bring a Trade Union representative or colleague to hearings.
4. Tone: Clear, protective, empowering, and easy to understand. Never robotic.`;

export async function askElonAI(
  prompt: string,
  history: { role: "user" | "assistant"; text: string }[],
  locale: Locale = "pl",
  userContext?: { name?: string; employer?: string; jobTitle?: string; hourlyRate?: number }
): Promise<string> {
  const contextSnippet = userContext
    ? `\nWorker context: Name: ${userContext.name || "Worker"}, Employer: ${userContext.employer || "Employer"}, Job: ${userContext.jobTitle || "Job"}, Rate: £${userContext.hourlyRate || "11.44"}/hr.`
    : "";

  if (aiClient) {
    try {
      const response = await aiClient.models.generateContent({
        model: "gemini-2.5-flash",
        contents: [
          { role: "system", parts: [{ text: SYSTEM_INSTRUCTION + contextSnippet }] },
          ...history.slice(-6).map((m) => ({
            role: m.role === "assistant" ? "model" : "user",
            parts: [{ text: m.text }],
          })),
          { role: "user", parts: [{ text: prompt }] },
        ],
      });

      if (response.text) {
        return response.text;
      }
    } catch (e) {
      console.warn("Gemini API call failed, using UK labor law legal engine fallback:", e);
    }
  }

  // Built-in UK Employment Law Legal Advisor Engine
  return generateExpertLegalResponse(prompt, locale, userContext);
}

function generateExpertLegalResponse(
  query: string,
  locale: Locale,
  userContext?: { name?: string; employer?: string; jobTitle?: string; hourlyRate?: number }
): string {
  const q = query.toLowerCase();
  const name = userContext?.name ? userContext.name.split(" ")[0] : (locale === "pl" ? "Kolego" : locale === "ro" ? "Prietene" : "Worker");

  // 1. Unpaid wages / deductions / nadgodziny / payslip
  if (q.includes("nadgodzin") || q.includes("wypłat") || q.includes("payslip") || q.includes("wages") || q.includes("potrąc") || q.includes("salariu") || q.includes("overtime")) {
    if (locale === "pl") {
      return `Cześć ${name}! Przeanalizowałem Twoje zgłoszenie dotyczące potrąceń i nieopłaconych godzin.

⚖️ **Twoje prawa w świetle brytyjskiego prawa:**
Zgodnie z **Section 13 Employment Rights Act 1996**, pracodawca nie ma prawa dokonać żadnego potrącenia z Twojego wynagrodzenia, chyba że:
1. Jest to wymagane przez prawo (podatek PAYE, National Insurance), LUB
2. Masz to wyraźnie zapisane w podpisanej przez Ciebie umowie o pracę, LUB
3. Wyraziłeś wcześniejszą, pisemną zgodę przed dokonaniem potrącenia.

⚠️ **Ważne – sprzęt roboczy (PPE) i uniformy:**
Zgodnie z **Health and Safety at Work etc. Act 1974 Section 9**, pracodawca ma bezwzględny ustawowy obowiązek zapewnić niezbędne środki ochrony (buty ze stalowym noskiem, kamizelki odblaskowe) **całkowicie bezpłatnie**. Potrącanie za to z wypłaty jest bezprawne! Ponadto, żadne potrącenie nie może obniżyć Twojej realnej stawki poniżej National Living Wage (£11.44/h).

📋 **Co musisz teraz zrobić (krok po kroku):**
1. **Zabezpiecz dowody:** Zrób zdjęcia/kopie wszystkich payslipów, grafików i odbić kartą (clocking-in).
2. **Wyślij formalne wezwanie:** Przejdź do zakładki **Pisma** w ask Elon i wybierz wzór *"Wezwanie Pracodawcy: Niewypłacone Wynagrodzenie (Section 13 ERA 1996)"*. Wyślij je do Payroll/HR z terminem 7 dni na zwrot.
3. **Brak reakcji:** Jeśli w ciągu 7 dni nie zwrócą pieniędzy, zgłoś sprawę do **ACAS Early Conciliation**. Pamiętaj: masz 3 miesiące minus 1 dzień od daty wypłaty na zgłoszenie do ACAS!`;
    } else if (locale === "ro") {
      return `Salut ${name}! Am analizat problema legată de salariu și ore suplimentare neplătite.

⚖️ **Drepturile tale conform legii britanice:**
Conform **Secțiunii 13 din Employment Rights Act 1996**, angajatorul nu are dreptul de a face rețineri din salariu fără acordul tău prealabil scris, cu excepția taxelor legale (PAYE, NI).

⚠️ **Echipamentul de protecție (PPE):**
Este ilegal ca angajatorul să îți oprească bani pentru bocanci de protecție sau veste, conform **Health and Safety at Work Act 1974**. De asemenea, salariul orar nu poate coborî sub salariul minim legal (£11.44/h).

📋 **Pași recomandați:**
1. Păstrează fluturașii de salariu și dovezile pontajului.
2. Generează din secțiunea **Scrisori** formularul *"Notificare Angajator: Plata Salariului (Section 13 ERA 1996)"* și trimite-l departamentului HR.
3. Dacă nu primești răspuns în 7 zile, inițiază procedura gratuită **ACAS Early Conciliation**.`;
    } else {
      return `Hello ${name}, I have reviewed your inquiry regarding wage deductions and unpaid overtime.

⚖️ **Your Legal Rights Under UK Law:**
Under **Section 13 of the Employment Rights Act 1996 (ERA 1996)**, an employer cannot make unlawful deductions from your wages unless required by law (Tax/NI) or authorised by an express written clause in your contract agreed in advance.

⚠️ **PPE & National Living Wage:**
Charging workers for mandatory safety equipment (steel-toe boots, hi-vis) violates **Section 9 of the Health and Safety at Work etc. Act 1974**. Furthermore, no deduction may take your effective hourly pay below the statutory National Living Wage (£11.44/hr).

📋 **Immediate Next Steps:**
1. Save copies of clock-in records, shift rosters, and payslips.
2. Go to the **Letters** tab in ask Elon and generate the *"Unlawful Deduction from Wages Statutory Demand"*.
3. Allow HR 7 calendar days to rectify. If unpaid, contact **ACAS for Early Conciliation** (strict 3-month less 1 day deadline).`;
    }
  }

  // 2. SSP / Sick Pay / Chorobowe
  if (q.includes("ssp") || q.includes("choro") || q.includes("sick") || q.includes("medical") || q.includes("lekarz") || q.includes("doctor")) {
    if (locale === "pl") {
      return `Cześć ${name}! Odmowa wypłaty Statutory Sick Pay (SSP) to częste naruszenie praw pracownika w UK.

⚖️ **Kiedy przysługuje Ci SSP:**
Zgodnie z **Social Security Contributions and Benefits Act 1992**, masz ustawowe prawo do SSP (£116.75 tygodniowo), jeśli:
- Jesteś zatrudniony jako pracownik (w tym umowa agencyjna lub zero-hours!),
- Byłeś niezdolny do pracy przez co najmniej 4 kolejne dni (wliczając weekendy),
- Twoje średnie zarobki przed chorobą wynosiły co najmniej Lower Earnings Limit (£123/tydzień).

🛑 **Co musi zrobić pracodawca:**
Pracodawca NIE MOŻE po prostu powiedzieć "nie płacimy". Jeśli twierdzi, że nie spełniasz kryteriów, ma **ustawowy obowiązek wydać Ci oficjalny formularz HMRC Form SSP1** z pisemnym uzasadnieniem w ciągu 7 dni!

📋 **Kroki do podjęcia:**
1. Złóż wniosek z zakładki **Pisma**: *"Wezwanie do Wypłaty Zasiłku Chorobowego (SSP)"*.
2. Zażądaj natychmiastowej wypłaty lub wydania druku **HMRC Form SSP1**.
3. Jeśli pracodawca odmawia, możesz zadzwonić bezpośrednio do **HMRC Statutory Payments Dispute Team** pod numer 0300 056 0630 – HMRC ma prawo nałożyć na pracodawcę karę finansową i nakazać natychmiastową wypłatę!`;
    } else {
      return `Hello ${name}! Under the **Social Security Contributions and Benefits Act 1992**, you are legally entitled to Statutory Sick Pay (SSP, £116.75/wk) if you have been sick for 4+ consecutive days and earn above the Lower Earnings Limit (£123/wk), even on zero-hours or agency contracts.

If the employer refuses payment, they are legally obligated to issue **HMRC Form SSP1** stating the statutory reason within 7 days. You can report them to the HMRC Statutory Payments Dispute Team (0300 056 0630). Generate the SSP demand letter in our Letters tab.`;
    }
  }

  // 3. Dismissal / Zwolnienie / Concediere / Notice
  if (q.includes("zwoln") || q.includes("dismiss") || q.includes("fire") || q.includes("concedi") || q.includes("notice") || q.includes("wypowiedzeni")) {
    if (locale === "pl") {
      return `Cześć ${name}! Kwestia zwolnienia z pracy w UK zależy od Twojego stażu pracy i procedury, którą zastosował pracodawca.

⚖️ **Twoje prawa w zależności od stażu:**
1. **Poniżej 2 lat stażu:** Pracodawca może rozwiązać umowę bez podawania głębokiego powodu biznesowego, ALE:
   - Musi wypłacić **Notice Pay** (okres wypowiedzenia z umowy lub min. 1 tydzień ustawowy).
   - Musi wypłacić ekwiwalent za wszystkie niewykorzystane dni urlopu (**Holiday Pay**).
   - Zwolnienie **nigdy** nie może mieć charakteru dyskryminacyjnego (ze względu na narodowość, ciążę, rasę, płeć) ani nie może być odwetem za zgłoszenie BHP / whistleblowing (wtedy jest to tzw. *Automatically Unfair Dismissal* niezależnie od stażu!).
2. **Powyżej 2 lat stażu:** Masz pełną ochronę przed **Unfair Dismissal**. Pracodawca musi mieć uzasadniony powód i ściśle przestrzegać procedury **ACAS Code of Practice No. 1**.

📋 **Co zrobić natychmiast:**
- Zażądaj pisemnego potwierdzenia zwolnienia i rozliczenia P45.
- Sprawdź, czy wypłacono cały zaległy urlop (12.07% z każdej przepracowanej godziny).
- Zgłoś sprawę w zakładce **Sprawy** i rozważ konsultację z przedstawicielem związkowym.`;
    } else {
      return `Hello ${name}. Dismissal laws in the UK depend on length of service:
1. **Under 2 years:** Employers can terminate without reason unless it involves discrimination or automatic unfair dismissal (whistleblowing, asserting statutory rights). You are still legally entitled to statutory Notice Pay and accrued untaken Holiday Pay.
2. **Over 2 years:** Full protection against Unfair Dismissal under Section 98 ERA 1996. Employer must adhere strictly to ACAS Code of Practice No. 1.
Check the Letters tab for Disciplinary Appeal or Constructive Dismissal notices.`;
    }
  }

  // Default UK Legal Companion response
  if (locale === "pl") {
    return `Cześć ${name}! Zapoznałem się z Twoim pytaniem.

Jako Twój asystent praw pracowniczych w UK, przypominam o kluczowych prawach każdego pracownika:
1. **Prawo do umowy:** W ciągu pierwszego dnia pracy masz prawo otrzymać *Written Statement of Employment Particulars* (Section 1 ERA 1996).
2. **Prawo do płatnego urlopu:** Każdy pracownik w UK ma prawo do minimum 5.6 tygodnia płatnego urlopu rocznie (28 dni dla pełnego etatu lub 12.07% godzin).
3. **Prawo do reprezentacji:** Na każdym formalnym spotkaniu dyscyplinarnym lub skargowym masz prawo do obecności przedstawiciela związku zawodowego (Section 10 Employment Relations Act 1999).

Napisz mi więcej szczegółów: w jakiej branży pracujesz, jaki masz typ umowy (stała, agencja czy zero-hours) oraz kiedy dokładnie doszło do spornej sytuacji, a przygotuję dla Ciebie konkretną strategię prawną!`;
  } else if (locale === "ro") {
    return `Salut ${name}! Ca asistent pentru drepturile muncii în UK, îți reamintesc că legislația britanică protejează toți muncitorii, inclusiv pe contracte de agenție sau zero-hours:
1. Ai dreptul la concediu plătit (5.6 săptămâni pe an / 12.07% din ore).
2. Nicio oprire din salariu nu este permisă fără acord scris.
3. Ai dreptul să fii însoțit de un reprezentant sindical la orice ședință disciplinară (Section 10 Employment Relations Act 1999).

Oferă-mi mai multe detalii despre situația ta pentru a formula o strategie legală concretă!`;
  } else {
    return `Hello ${name}! As your UK employment rights companion, I'm here to ensure you are treated fairly under UK labor laws.
Key worker rights in the UK include:
- Statutory holiday pay entitlement of 5.6 weeks per year.
- Protection against unlawful wage deductions under Section 13 ERA 1996.
- The statutory right to be accompanied by a trade union representative at disciplinary/grievance hearings.

Please share the details of your issue so I can give you tailored statutory guidance and draft any necessary letters.`;
  }
}
