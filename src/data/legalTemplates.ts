import { LegalTemplate } from "../types";

export const defaultTemplates: LegalTemplate[] = [
  {
    id: "formal_grievance",
    titleEn: "Formal Letter of Grievance to Employer",
    titlePl: "Oficjalna Skarga Pracownicza (Formal Grievance)",
    titleRo: "Plângere Oficială la Angajator (Formal Grievance)",
    statutoryReference: "ACAS Code of Practice No. 1 on Disciplinary & Grievance Procedures (s.199 TULRCA 1992)",
    category: "Grievance",
    descriptionEn: "Formal statutory workplace grievance under the ACAS Code of Practice regarding unfair treatment, bullying, health & safety violations, or contractual breaches.",
    descriptionPl: "Oficjalne zgłoszenie formalnej skargi (Grievance) u pracodawcy w UK zgodnie z procedurą ACAS. Pracodawca ma prawny obowiązek zwołać spotkanie wyjaśniające.",
    descriptionRo: "Depunerea unei plângeri oficiale la angajator în conformitate cu codul ACAS privind tratamentul incorect sau încălcarea contractului.",
    fields: [
      {
        key: "employee_name",
        labelEn: "Your Full Name",
        labelPl: "Twoje Imię i Nazwisko",
        labelRo: "Numele Tău Complet",
        placeholder: "e.g. Artur Kowalski",
        defaultValue: "Artur Kowalski"
      },
      {
        key: "job_title",
        labelEn: "Job Title / Department",
        labelPl: "Stanowisko / Dział",
        labelRo: "Funcție / Departament",
        placeholder: "e.g. Warehouse Operative / Order Picker",
        defaultValue: "Warehouse Operative (Inbound)"
      },
      {
        key: "employer_name",
        labelEn: "Employer / Company Name",
        labelPl: "Nazwa Pracodawcy / Agencji",
        labelRo: "Numele Companiei",
        placeholder: "e.g. Amazon UK Services Ltd",
        defaultValue: "Amazon Fulfilment LCY2"
      },
      {
        key: "manager_name",
        labelEn: "Recipient / HR Manager",
        labelPl: "Osoba Decyzyjna / Manager HR",
        labelRo: "Manager Resurse Umane",
        placeholder: "e.g. Head of Human Resources",
        defaultValue: "Head of Human Resources"
      },
      {
        key: "grievance_nature",
        labelEn: "Nature of Grievance (Details & Dates)",
        labelPl: "Szczegółowy Opis Problemu i Daty",
        labelRo: "Detalii și Date ale Problemei",
        placeholder: "e.g. Unfair shift allocation, aggressive behaviour from line supervisor, denial of mandatory break times",
        defaultValue: "On multiple occasions during the past month (particularly on 12th and 19th October), I was subjected to discriminatory comments regarding my nationality and denied my statutory 20-minute rest break during 10-hour shifts."
      },
      {
        key: "resolution_sought",
        labelEn: "Resolution Sought",
        labelPl: "Oczekiwane Rozwiązanie Sprawy",
        labelRo: "Soluția Solicitată",
        placeholder: "e.g. Formal investigation, shift reassignment, written apology",
        defaultValue: "Formal investigation under company procedures, immediate cessation of harassment, and a hearing with an independent manager."
      },
      {
        key: "companion_name",
        labelEn: "Union Companion / Representative",
        labelPl: "Imię Przedstawiciela Związkowego",
        labelRo: "Reprezentant Sindical",
        placeholder: "e.g. Trade Union Representative or Colleague",
        defaultValue: "a Trade Union Representative / Accredited Colleague"
      }
    ],
    defaults: {
      employee_name: "Artur Kowalski",
      job_title: "Warehouse Operative",
      employer_name: "Company HR",
      manager_name: "Human Resources Department",
      grievance_nature: "[Detailed description of incident and dates]",
      resolution_sought: "[Remedial action requested]",
      companion_name: "a Trade Union Representative"
    },
    letter: `FORMAL WRITTEN GRIEVANCE
CONFIDENTIAL - TO BE RECORDED IN COMPANY GRIEVANCE REGISTER

Date: {{date}}

TO: {{manager_name}}, {{employer_name}}
FROM: {{employee_name}} ({{job_title}})
SUBJECT: FORMAL GRIEVANCE SUBMISSION PURSUANT TO THE ACAS CODE OF PRACTICE NO. 1

Dear {{manager_name}},

Please accept this letter as a formal submission of a grievance under the company's Grievance Procedure and the ACAS statutory Code of Practice on Disciplinary and Grievance Procedures (issued under Section 199 of the Trade Union and Labour Relations (Consolidation) Act 1992).

1. STATEMENT OF GRIEVANCE:
{{grievance_nature}}

2. LEGAL GROUNDS & COMPANY POLICY BREACHES:
The conduct described above constitutes a serious failure to provide a safe and equitable working environment, contravenes fair employment principles, and breaches the implied contractual duty of mutual trust and confidence.

3. DESIRED RESOLUTION:
In order to resolve this matter satisfactorily, I request the following remedial actions:
{{resolution_sought}}

4. FORMAL GRIEVANCE MEETING & RIGHT TO BE ACCOMPANIED:
In accordance with paragraph 32 of the ACAS Code of Practice and Section 10 of the Employment Relations Act 1999, I request that you convene a formal grievance hearing within five working days of this letter.

I formally notify you of my intention to exercise my statutory right to be accompanied at this meeting by:
Companion: {{companion_name}}.

Please confirm receipt of this grievance in writing and provide details of the meeting time, venue, and the impartial manager assigned to hear this matter.

Yours sincerely,

{{employee_name}}
{{job_title}}`
  },
  {
    id: "unpaid_wages",
    titleEn: "Employer Demand: Unlawful Deduction from Wages & Overtime",
    titlePl: "Wezwanie Pracodawcy: Niewypłacone Wynagrodzenie i Nadgodziny",
    titleRo: "Notificare Angajator: Plata Salariului și a Orelor Suplimentare",
    statutoryReference: "Section 13, Employment Rights Act 1996 & National Minimum Wage Act 1998",
    category: "Wages",
    descriptionEn: "Statutory demand requiring employer to reimburse unlawful pay deductions, missing overtime payments, or unpaid working hours within 7 days.",
    descriptionPl: "Formalne wezwanie do zapłaty zaległych płac, nieopłaconych nadgodzin lub bezprawnych potrąceń z payslipu. Powołanie na art. 13 Employment Rights Act 1996.",
    descriptionRo: "Cerere oficială către angajator pentru plata salariilor restante, a orelor suplimentare și a deducerilor ilegale din fluturaș.",
    fields: [
      {
        key: "employee_name",
        labelEn: "Your Full Name",
        labelPl: "Twoje Imię i Nazwisko",
        labelRo: "Numele Tău",
        placeholder: "e.g. Artur Kowalski",
        defaultValue: "Artur Kowalski"
      },
      {
        key: "employer_name",
        labelEn: "Employer / Payroll Name",
        labelPl: "Pracodawca / Dział Płac",
        labelRo: "Numele Angajatorului",
        placeholder: "e.g. Logistics UK Ltd",
        defaultValue: "Amazon Fulfilment LCY2"
      },
      {
        key: "payroll_contact",
        labelEn: "Payroll / Finance Contact",
        labelPl: "Osoba Kontaktowa ds. Płac",
        labelRo: "Contact Salarii",
        placeholder: "e.g. Payroll Manager",
        defaultValue: "Payroll Manager"
      },
      {
        key: "amount_owed",
        labelEn: "Total Amount Owed (£)",
        labelPl: "Łączna Kwota Zaległości (£)",
        labelRo: "Suma Restantă (£)",
        placeholder: "e.g. 420.50",
        defaultValue: "348.60"
      },
      {
        key: "pay_period",
        labelEn: "Pay Period / Specific Dates",
        labelPl: "Okres Rozliczeniowy / Daty",
        labelRo: "Perioada de Plată",
        placeholder: "e.g. September 2026 payslip",
        defaultValue: "September 2026 pay period (Shift dates: 10th, 14th, 21st)"
      },
      {
        key: "details",
        labelEn: "Breakdown of Missing Hours / Deductions",
        labelPl: "Wyszczególnienie Brakujących Godzin / Potrąceń",
        labelRo: "Detalierea Orelor Lipsă",
        placeholder: "e.g. 24 unpaid hours at £14.50/hr plus £45 training deduction",
        defaultValue: "24 overtime hours worked at standard base rate £12.80/hr were omitted, and £41.40 was arbitrarily deducted under 'uniform charges' without written authorisation."
      }
    ],
    defaults: {
      employee_name: "Artur Kowalski",
      employer_name: "Employer Ltd",
      payroll_contact: "Payroll Department",
      amount_owed: "0.00",
      pay_period: "Current month",
      details: "[Breakdown of hours, rates and dates]"
    },
    letter: `FORMAL STATUTORY NOTICE OF UNLAWFUL DEDUCTION FROM WAGES
PURSUANT TO SECTION 13 OF THE EMPLOYMENT RIGHTS ACT 1996

Date: {{date}}

TO: {{payroll_contact}}, {{employer_name}}
FROM: {{employee_name}}
SUBJECT: FORMAL DEMAND FOR RECTIFICATION OF UNLAWFUL DEDUCTION FROM WAGES (£{{amount_owed}})

Dear {{payroll_contact}},

I am writing to formally raise a serious discrepancy regarding my pay for the period {{pay_period}}.

1. PARTICULARS OF UNLAWFUL DEDUCTION / SHORTFALL:
Upon examining my payslip and clock-in records, the following shortfall has been identified:
{{details}}
Total Outstanding Arrears: £{{amount_owed}}

2. STATUTORY FRAMEWORK:
Section 13(1) of the Employment Rights Act 1996 provides that:
"An employer shall not make a deduction from wages of a worker employed by him unless the deduction is required or authorised by statute, or the worker has previously signified in writing his agreement or consent to the making of the deduction."

Furthermore, failure to pay for all contracted hours worked breaches the National Minimum Wage Act 1998 and constitutes a material breach of contract.

3. REQUIRED ACTION:
I request that you arrange an immediate out-of-cycle payroll adjustment or confirm in writing that this sum of £{{amount_owed}} will be reimbursed into my nominated bank account within seven (7) calendar days of this notice.

If this matter is not resolved satisfactorily, I reserve the right to submit a formal grievance, notify ACAS for Early Conciliation, and make an application to the Employment Tribunal under Section 23 of the Employment Rights Act 1996.

Yours sincerely,

{{employee_name}}`
  },
  {
    id: "statutory_sick_pay",
    titleEn: "Statutory Sick Pay (SSP) Non-Payment Formal Demand",
    titlePl: "Wezwanie do Wypłaty Zasiłku Chorobowego (SSP)",
    titleRo: "Notificare Plată Concediu Medical (Statutory Sick Pay)",
    statutoryReference: "Social Security Contributions and Benefits Act 1992 & Statutory Sick Pay (General) Regulations",
    category: "Sick",
    descriptionEn: "Demand letter when an employer refuses or delays payment of Statutory Sick Pay (SSP) despite qualifying condition and fit note.",
    descriptionPl: "Oficjalne wezwanie pracodawcy do natychmiastowej wypłaty zaległego SSP po dostarczeniu zwolnienia lekarskiego (Fit Note) lub oświadczenia (self-certificate).",
    descriptionRo: "Cerere de plată a indemnizației de boală (SSP) refuzată nejustificat de către angajator.",
    fields: [
      {
        key: "employee_name",
        labelEn: "Your Full Name",
        labelPl: "Twoje Imię i Nazwisko",
        labelRo: "Numele Tău",
        placeholder: "e.g. Artur Kowalski",
        defaultValue: "Artur Kowalski"
      },
      {
        key: "employer_name",
        labelEn: "Employer / Company Name",
        labelPl: "Nazwa Pracodawcy",
        labelRo: "Companie",
        placeholder: "e.g. Amazon Fulfilment LCY2",
        defaultValue: "Amazon Fulfilment LCY2"
      },
      {
        key: "period_of_sickness",
        labelEn: "Period of Sickness (Dates)",
        labelPl: "Okres Choroby (Daty)",
        labelRo: "Perioada Concediului",
        placeholder: "e.g. 1st October to 14th October 2026",
        defaultValue: "1st October to 14th October 2026 (inclusive)"
      },
      {
        key: "fit_note_details",
        labelEn: "Fit Note / Doctor Certificate Date",
        labelPl: "Data Wystawienia Zwolnienia Lekarskiego",
        labelRo: "Data Certificatului Medical",
        placeholder: "e.g. GP Fit Note dated 4th October provided on 5th October",
        defaultValue: "Self-certification for days 1-7 submitted 1st Oct, followed by GP Fit note provided 8th Oct"
      }
    ],
    defaults: {
      employee_name: "Artur Kowalski",
      employer_name: "Employer Ltd",
      period_of_sickness: "[Dates of sickness absence]",
      fit_note_details: "[Fit note details]"
    },
    letter: `FORMAL DEMAND FOR STATUTORY SICK PAY (SSP)
PURSUANT TO THE SOCIAL SECURITY CONTRIBUTIONS AND BENEFITS ACT 1992

Date: {{date}}

TO: Human Resources / Payroll, {{employer_name}}
FROM: {{employee_name}}
SUBJECT: NON-PAYMENT OF STATUTORY SICK PAY (SSP) FOR PERIOD: {{period_of_sickness}}

Dear HR & Payroll,

I am writing regarding the failure to include my Statutory Sick Pay (SSP) in my latest wage disbursement.

I was absent from work due to incapacity for work from {{period_of_sickness}}.
All statutory notification requirements were strictly observed:
{{fit_note_details}}

I satisfy all qualifying criteria for SSP under Section 151 of the Social Security Contributions and Benefits Act 1992:
1. I am classed as an employed earner;
2. My average weekly earnings exceed the Lower Earnings Limit (LEL);
3. My period of incapacity for work (PIW) exceeded the 3 consecutive waiting days.

Under statutory regulations, employers are strictly liable to pay SSP for qualifying days. If you believe for any reason that I do not qualify for SSP, you are under a strict legal obligation to issue an official HMRC Form SSP1 to me explaining the refusal so that I may claim alternative state benefits.

I request that you either:
a) Immediately credit my account with the accrued SSP arrears; or
b) Provide the official HMRC Form SSP1 within seven working days.

Should you fail to respond, I will formally refer this dispute to HMRC Statutory Payments Dispute Team (HMRC DM PTC, PT Operations) for a formal determination.

Yours faithfully,

{{employee_name}}`
  },
  {
    id: "sar_data_request",
    titleEn: "Subject Access Request (SAR): Shift Logs, Pay Audits & HR Files",
    titlePl: "Wniosek SAR (RODO): Wydanie Zapisów Pracy, Payslipów i Notatek HR",
    titleRo: "Cerere de Acces la Date (SAR): Evidența Orelor, Fluturași și Dosar HR",
    statutoryReference: "Article 15 UK GDPR & Section 45 Data Protection Act 2018",
    category: "Data",
    descriptionEn: "Compulsory legal request under UK GDPR forcing employer/agency to disclose internal management notes, clocking-in swipe records, pay sheets, and CCTV within 30 days.",
    descriptionPl: "Bezpłatny formalny wniosek prawny zmuszający pracodawcę lub agencję do ujawnienia wszystkich danych osobowych, odbić kartą z bramek, audytów płac i notatek w ciągu 30 dni.",
    descriptionRo: "Cerere obligatorie în baza GDPR UK prin care soliciți toate datele de pontaj, fluturași și dosarul personal în 30 de zile.",
    fields: [
      {
        key: "employee_name",
        labelEn: "Your Full Name",
        labelPl: "Twoje Imię i Nazwisko",
        labelRo: "Numele Tău",
        placeholder: "e.g. Artur Kowalski",
        defaultValue: "Artur Kowalski"
      },
      {
        key: "dob_or_id",
        labelEn: "Date of Birth & Payroll ID",
        labelPl: "Data Urodzenia i Nr Pracowniczy",
        labelRo: "Data Nașterii și ID Angajat",
        placeholder: "e.g. DOB: 14/05/1990, Payroll ID: #AK9921",
        defaultValue: "DOB: 12/04/1992, Staff ID: #98421"
      },
      {
        key: "employer_name",
        labelEn: "Data Controller / Employer Name",
        labelPl: "Administrator Danych / Pracodawca",
        labelRo: "Operator Date / Companie",
        placeholder: "e.g. Amazon Fulfilment LCY2",
        defaultValue: "Amazon Fulfilment LCY2"
      },
      {
        key: "specific_records",
        labelEn: "Specific Documents Requested",
        labelPl: "Żądane Konkretne Dokumenty",
        labelRo: "Documente Specifice Solicitate",
        placeholder: "e.g. Electronic turnstile logs, HR grievance records, all email mentions",
        defaultValue: "All electronic turnstile clocking-in/out records, internal supervisory shift notes, WhatsApp/email messages containing my name, and detailed calculation worksheets for holiday pay."
      }
    ],
    defaults: {
      employee_name: "Artur Kowalski",
      dob_or_id: "DOB: [Date of Birth]",
      employer_name: "Employer Data Protection Officer",
      specific_records: "All personnel files, clock-in logs, and payslip data"
    },
    letter: `FORMAL SUBJECT ACCESS REQUEST (SAR)
PURSUANT TO ARTICLE 15 OF THE UK GENERAL DATA PROTECTION REGULATION (UK GDPR)
AND SECTION 45 OF THE DATA PROTECTION ACT 2018

Date: {{date}}

TO: The Data Protection Officer / HR Director, {{employer_name}}
FROM: {{employee_name}} (Identification: {{dob_or_id}})
SUBJECT: STATUTORY SUBJECT ACCESS REQUEST FOR EMPLOYMENT RECORDS

Dear Data Protection Officer,

Please accept this letter as a formal Subject Access Request pursuant to Article 15 of the UK General Data Protection Regulation (UK GDPR) and Section 45 of the Data Protection Act 2018.

As a current/former worker whose personal data you process as Data Controller, I am exercising my right to receive access to and a portable digital copy of all personal data held concerning me, specifically including but not limited to:

1. Time, Attendance & Swipes:
{{specific_records}}

2. Personnel Files & Grievance Communications:
All internal notes, correspondence, meeting minutes, disciplinary records, or risk assessments referencing my person, whether held in written, electronic, or archived systems.

3. Pay & Tax Calculations:
All payroll worksheets, deductions logs, calculation audits for holiday entitlement, and pension contribution receipts.

STATUTORY TIMEFRAME:
Under Article 12(3) of the UK GDPR, you are required to comply with this request without undue delay and at the latest within one calendar month of receipt. No fee may be charged for providing this information.

If you fail to provide full disclosure within the statutory 30-day window, a formal complaint will be escalated to the Information Commissioner's Office (ICO).

Yours faithfully,

{{employee_name}}`
  },
  {
    id: "flexible_working",
    titleEn: "Statutory Flexible Working Request (Day-One Right)",
    titlePl: "Wniosek o Elastyczny Czas Pracy (Flexible Working Request)",
    titleRo: "Cerere de Flexibilizare a Programului de Lucru (Day-One Right)",
    statutoryReference: "Section 80F Employment Rights Act 1996 & Flexible Working Regulations 2024",
    category: "Leave",
    descriptionEn: "Official statutory request to change work patterns, switch to fixed shifts, reduce working hours, or adjust start/end times under current UK day-one flexible working legislation.",
    descriptionPl: "Ustawowy wniosek o zmianę grafiku, stałe zmiany (np. tylko dzienne), pracę hybrydową lub ograniczenie godzin. Obowiązuje od 1. dnia pracy.",
    descriptionRo: "Cerere legală pentru ajustarea turelor de lucru sau a programului de la prima zi de angajare.",
    fields: [
      {
        key: "employee_name",
        labelEn: "Your Full Name",
        labelPl: "Twoje Imię i Nazwisko",
        labelRo: "Numele Tău",
        placeholder: "e.g. Artur Kowalski",
        defaultValue: "Artur Kowalski"
      },
      {
        key: "job_title",
        labelEn: "Job Title",
        labelPl: "Stanowisko",
        labelRo: "Funcție",
        placeholder: "e.g. Warehouse Operative",
        defaultValue: "Warehouse Operative"
      },
      {
        key: "employer_name",
        labelEn: "Employer / Line Manager",
        labelPl: "Pracodawca / Przełożony",
        labelRo: "Angajator",
        placeholder: "e.g. Amazon Fulfilment LCY2",
        defaultValue: "Amazon Fulfilment LCY2"
      },
      {
        key: "proposed_working_pattern",
        labelEn: "Requested Working Pattern (Days & Hours)",
        labelPl: "Proponowany Nowy Harmonogram",
        labelRo: "Programul de Lucru Solicitat",
        placeholder: "e.g. Fixed Monday to Thursday 07:00-17:30 (Day shifts only)",
        defaultValue: "Fixed 4-day working week: Monday to Thursday, 07:00 to 17:30, eliminating night shifts."
      },
      {
        key: "effective_date",
        labelEn: "Desired Start Date for New Pattern",
        labelPl: "Pożądana Data Wprowadzenia Zmiany",
        labelRo: "Data Dorită de Începere",
        placeholder: "e.g. 1st December 2026",
        defaultValue: "1st December 2026"
      },
      {
        key: "business_impact_mitigation",
        labelEn: "How the Business Can Manage the Change",
        labelPl: "Jak Zmiana Wpłynie na Zespół i Rozwiązania",
        labelRo: "Cum se Poate Gestiona Modificarea",
        placeholder: "e.g. Inbound shift coverage is highest during weekdays; colleagues are available to rotate.",
        defaultValue: "Inbound volume is heaviest during weekday mornings. This pattern ensures full throughput coverage while accommodating childcare responsibilities."
      }
    ],
    defaults: {
      employee_name: "Artur Kowalski",
      job_title: "Warehouse Operative",
      employer_name: "Operations Management",
      proposed_working_pattern: "[Specify exact proposed hours/days]",
      effective_date: "[Target Date]",
      business_impact_mitigation: "[Mitigation plan]"
    },
    letter: `STATUTORY REQUEST FOR FLEXIBLE WORKING
PURSUANT TO SECTION 80F OF THE EMPLOYMENT RIGHTS ACT 1996
(AS AMENDED BY THE EMPLOYMENT RELATIONS (FLEXIBLE WORKING) ACT 2023)

Date: {{date}}

TO: {{employer_name}}
FROM: {{employee_name}} ({{job_title}})
SUBJECT: STATUTORY APPLICATION FOR FLEXIBLE WORKING ARRANGEMENT

Dear Management,

This letter constitutes a statutory flexible working application submitted under Section 80F of the Employment Rights Act 1996 and the Flexible Working Regulations.

1. PROPOSED WORKING PATTERN:
I request to change my current working pattern to the following arrangement:
{{proposed_working_pattern}}

Proposed Effective Date: {{effective_date}}

2. REASON & BUSINESS IMPACT ANALYSIS:
{{business_impact_mitigation}}

3. STATUTORY CONSULTATION REQUIREMENT:
Under current legislation and the ACAS Code of Practice on handling requests to work flexibly, employers must consult with workers before making any decision and decide the outcome within two months of receiving this application.

I look forward to discussing this application with you in an informal consultation meeting at your earliest convenience.

Yours sincerely,

{{employee_name}}
{{job_title}}`
  },
  {
    id: "constructive_dismissal",
    titleEn: "Resignation with Immediate Effect: Constructive Dismissal",
    titlePl: "Wypowiedzenie ze Skutkiem Natychmiastowym: Zwolnienie Konstruktywne",
    titleRo: "Demisie cu Efect Imediat: Concediere Constructivă (Constructive Dismissal)",
    statutoryReference: "Section 95(1)(c) Employment Rights Act 1996",
    category: "Dismissal",
    descriptionEn: "Formal resignation letter citing repudiatory breach of contract and fundamental breakdown of trust and confidence due to employer actions, reserving the right to claim at Tribunal.",
    descriptionPl: "Ostateczne pismo o rozwiązaniu umowy bez zachowania okresu wypowiedzenia z winy pracodawcy (np. brak pensji, mobbing, zagrożenie zdrowia) z zachowaniem prawa do odszkodowania w ET.",
    descriptionRo: "Scrisoare oficială de demisie imediată cauzată de comportamentul abuziv sau neplata salariului de către angajator.",
    fields: [
      {
        key: "employee_name",
        labelEn: "Your Full Name",
        labelPl: "Twoje Imię i Nazwisko",
        labelRo: "Numele Tău",
        placeholder: "e.g. Artur Kowalski",
        defaultValue: "Artur Kowalski"
      },
      {
        key: "employer_name",
        labelEn: "Employer / Company Name",
        labelPl: "Pracodawca",
        labelRo: "Companie",
        placeholder: "e.g. Amazon Fulfilment LCY2",
        defaultValue: "Amazon Fulfilment LCY2"
      },
      {
        key: "breach_details",
        labelEn: "Fundamental Breach of Contract Details",
        labelPl: "Szczegóły Rażącego Naruszenia Umowy",
        labelRo: "Detaliile Încălcării Grave a Contractului",
        placeholder: "e.g. Sustained wage withholding, unsafe conditions, failure to address formal grievance",
        defaultValue: "Persistent refusal to pay earned overtime wages (£348.60), deliberate reduction of contracted shifts in retaliation for health complaints, and management's refusal to hear my formal grievance."
      }
    ],
    defaults: {
      employee_name: "Artur Kowalski",
      employer_name: "Managing Director / HR",
      breach_details: "[Details of fundamental breaches]"
    },
    letter: `NOTICE OF RESIGNATION WITH IMMEDIATE EFFECT
CLAIM OF CONSTRUCTIVE DISMISSAL
PURSUANT TO SECTION 95(1)(c) OF THE EMPLOYMENT RIGHTS ACT 1996

Date: {{date}}

TO: The Directors & Human Resources, {{employer_name}}
FROM: {{employee_name}}
SUBJECT: RESIGNATION IN RESPONSE TO FUNDAMENTAL REPUDIATORY BREACH OF CONTRACT

Please be advised that I am resigning from my employment with {{employer_name}} with immediate effect from today's date.

I have been forced to take this step because the company has committed serious and fundamental breaches of the contract of employment, including the breach of the fundamental implied term of mutual trust and confidence.

PARTICULARS OF FUNDAMENTAL REPUDIATORY BREACH:
{{breach_details}}

The company's conduct has made my continued employment completely untenable and intolerable. My resignation is directly in response to these fundamental breaches and is without prejudice to my rights to pursue statutory claims.

I consider myself to have been constructively and unfairly dismissed within the meaning of Section 95(1)(c) of the Employment Rights Act 1996.

I require all outstanding accrued payments, including all earned wages, accrued but untaken statutory holiday pay, and notice pay damages, to be paid into my account within 7 days, alongside my final P45.

Yours faithfully,

{{employee_name}}`
  }
];

export function renderTemplateLetter(template: LegalTemplate, values: Record<string, string>): string {
  const dateStr = new Date().toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });
  return template.letter.replace(/\{\{(\w+)\}\}/g, (_, key) => {
    if (key === "date") return dateStr;
    const v = values[key];
    if (v && v.trim() !== "") return v.trim();
    return template.defaults[key] || `[${key}]`;
  });
}
