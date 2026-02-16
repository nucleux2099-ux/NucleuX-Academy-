/**
 * NMC CBME — Obstetrics & Gynaecology Curriculum: Complete UG → PG → SS Mapping
 *
 * UG: 39 modules (OG1–OG39), Obstetrics (OG1–OG22), Gynecology (OG23–OG39)
 * PG: MS Obstetrics & Gynaecology systemic topics
 * SS: MCh/DM super-specialty curricula
 */

// ─── Types ───────────────────────────────────────────────────────────────────

export type ObgynLevel = "UG" | "PG" | "SS";
export type NMCDomain = "K" | "KH" | "SH" | "P";

export interface ObgynCompetency {
  code: string;
  text: string;
  domain: NMCDomain;
  isCore: boolean;
}

export interface ObgynUGModule {
  id: string;
  module: string;
  title: string;
  competencies: ObgynCompetency[];
  subspecialty: string;
  topicSlugs: string[];
}

export interface ObgynPGTopic {
  id: string;
  title: string;
  section: string;
  subspecialty: string;
  topicSlugs: string[];
  ugModuleRefs: string[];
}

export interface ObgynSSTopic {
  id: string;
  degree: "MCh" | "DM";
  specialty: string;
  title: string;
  subspecialty: string;
  topicSlugs: string[];
  pgTopicRefs: string[];
}

export interface ObgynSubspecialtyMap {
  slug: string;
  name: string;
  icon: string;
  ugTopicCount: number;
  pgTopicCount: number;
  ssTopicCount: number;
  levels: ObgynLevel[];
}

// ─── Subspecialty Overview ───────────────────────────────────────────────────

export const OBGYN_SUBSPECIALTIES: ObgynSubspecialtyMap[] = [
  { slug: "general-topics", name: "General Topics", icon: "📋", ugTopicCount: 4, pgTopicCount: 3, ssTopicCount: 0, levels: ["UG", "PG"] },
  { slug: "antenatal-care", name: "Antenatal Care", icon: "🤰", ugTopicCount: 10, pgTopicCount: 6, ssTopicCount: 0, levels: ["UG", "PG"] },
  { slug: "labor-delivery", name: "Labor & Delivery", icon: "👶", ugTopicCount: 12, pgTopicCount: 7, ssTopicCount: 0, levels: ["UG", "PG"] },
  { slug: "high-risk-pregnancy", name: "High-Risk Pregnancy", icon: "⚠️", ugTopicCount: 8, pgTopicCount: 6, ssTopicCount: 4, levels: ["UG", "PG", "SS"] },
  { slug: "obstetrics", name: "Obstetric Complications", icon: "🏥", ugTopicCount: 6, pgTopicCount: 5, ssTopicCount: 0, levels: ["UG", "PG"] },
  { slug: "benign-gynecology", name: "Benign Gynecology", icon: "🌸", ugTopicCount: 8, pgTopicCount: 5, ssTopicCount: 0, levels: ["UG", "PG"] },
  { slug: "gynec-oncology", name: "Gynecologic Oncology", icon: "🎗️", ugTopicCount: 6, pgTopicCount: 5, ssTopicCount: 6, levels: ["UG", "PG", "SS"] },
  { slug: "infertility", name: "Infertility & ART", icon: "🧬", ugTopicCount: 4, pgTopicCount: 4, ssTopicCount: 5, levels: ["UG", "PG", "SS"] },
  { slug: "contraception", name: "Contraception & Family Planning", icon: "💊", ugTopicCount: 5, pgTopicCount: 3, ssTopicCount: 0, levels: ["UG", "PG"] },
  { slug: "reproductive-endo", name: "Reproductive Endocrinology", icon: "🦋", ugTopicCount: 4, pgTopicCount: 4, ssTopicCount: 4, levels: ["UG", "PG", "SS"] },
  { slug: "urogynecology", name: "Urogynecology", icon: "🩺", ugTopicCount: 3, pgTopicCount: 3, ssTopicCount: 0, levels: ["UG", "PG"] },
  { slug: "fetal-medicine", name: "Fetal Medicine", icon: "🔬", ugTopicCount: 3, pgTopicCount: 4, ssTopicCount: 4, levels: ["UG", "PG", "SS"] },
  { slug: "gynecology", name: "Gynecologic Procedures", icon: "🔧", ugTopicCount: 4, pgTopicCount: 3, ssTopicCount: 0, levels: ["UG", "PG"] },
];

// ─── UG Modules (OG1–OG39) ──────────────────────────────────────────────────

export const OBGYN_UG_MODULES: ObgynUGModule[] = [
  // Obstetrics (OG1–OG22)
  {
    id: "og1", module: "OG1", title: "Maternal & Reproductive Anatomy",
    subspecialty: "general-topics", topicSlugs: ["reproductive-anatomy"],
    competencies: [
      { code: "OG1.1", text: "Describe the applied anatomy of female reproductive tract", domain: "K", isCore: true },
      { code: "OG1.2", text: "Describe the physiology of menstruation and its disorders", domain: "K", isCore: true },
      { code: "OG1.3", text: "Describe the physiology of conception, implantation and placentation", domain: "K", isCore: true },
    ],
  },
  {
    id: "og2", module: "OG2", title: "Preconception & Antenatal Care",
    subspecialty: "antenatal-care", topicSlugs: ["antenatal-care-basics"],
    competencies: [
      { code: "OG2.1", text: "Describe and discuss the pre-conception and antenatal care", domain: "K", isCore: true },
      { code: "OG2.2", text: "Enumerate the risk factors in pregnancy and describe preventive strategies", domain: "K", isCore: true },
      { code: "OG2.3", text: "Describe the diagnosis of pregnancy", domain: "KH", isCore: true },
    ],
  },
  {
    id: "og3", module: "OG3", title: "Antenatal Assessment",
    subspecialty: "antenatal-care", topicSlugs: ["antenatal-assessment"],
    competencies: [
      { code: "OG3.1", text: "Describe and demonstrate the clinical features of pregnancy", domain: "SH", isCore: true },
      { code: "OG3.2", text: "Elicit, document and present an obstetric history", domain: "SH", isCore: true },
    ],
  },
  {
    id: "og4", module: "OG4", title: "Fetal Growth & Development",
    subspecialty: "fetal-medicine", topicSlugs: ["fetal-growth"],
    competencies: [
      { code: "OG4.1", text: "Describe the physiology of fetal growth and development", domain: "K", isCore: true },
      { code: "OG4.2", text: "Describe the assessment of fetal well-being including USG, NST, BPP", domain: "KH", isCore: true },
    ],
  },
  {
    id: "og5", module: "OG5", title: "Nutrition in Pregnancy",
    subspecialty: "antenatal-care", topicSlugs: ["nutrition-pregnancy"],
    competencies: [
      { code: "OG5.1", text: "Describe and discuss the nutritional requirements during pregnancy", domain: "K", isCore: true },
      { code: "OG5.2", text: "Describe and discuss iron and folic acid supplementation", domain: "KH", isCore: true },
    ],
  },
  {
    id: "og6", module: "OG6", title: "Hyperemesis & Minor Disorders",
    subspecialty: "antenatal-care", topicSlugs: ["hyperemesis"],
    competencies: [
      { code: "OG6.1", text: "Describe and discuss the etiology, clinical features and management of hyperemesis gravidarum", domain: "KH", isCore: true },
      { code: "OG6.2", text: "Describe and discuss the minor disorders of pregnancy", domain: "K", isCore: true },
    ],
  },
  {
    id: "og7", module: "OG7", title: "Hypertensive Disorders in Pregnancy",
    subspecialty: "high-risk-pregnancy", topicSlugs: ["preeclampsia", "eclampsia"],
    competencies: [
      { code: "OG7.1", text: "Describe the classification of hypertensive disorders of pregnancy", domain: "K", isCore: true },
      { code: "OG7.2", text: "Describe and discuss the clinical features, diagnosis and management of preeclampsia and eclampsia", domain: "KH", isCore: true },
      { code: "OG7.3", text: "Discuss the complications and management of eclampsia (MgSO4 protocol)", domain: "KH", isCore: true },
    ],
  },
  {
    id: "og8", module: "OG8", title: "Antepartum Hemorrhage",
    subspecialty: "obstetrics", topicSlugs: ["placenta-previa", "abruption"],
    competencies: [
      { code: "OG8.1", text: "Describe and discuss the etiology, clinical features, diagnosis and management of antepartum hemorrhage", domain: "KH", isCore: true },
      { code: "OG8.2", text: "Describe and discuss the management of placenta previa", domain: "KH", isCore: true },
      { code: "OG8.3", text: "Describe and discuss the management of abruptio placentae", domain: "KH", isCore: true },
    ],
  },
  {
    id: "og9", module: "OG9", title: "Medical Disorders in Pregnancy",
    subspecialty: "high-risk-pregnancy", topicSlugs: ["anemia-pregnancy", "diabetes-pregnancy", "heart-disease-pregnancy"],
    competencies: [
      { code: "OG9.1", text: "Describe and discuss the etiology, clinical features and management of anemia in pregnancy", domain: "KH", isCore: true },
      { code: "OG9.2", text: "Describe and discuss the management of diabetes mellitus in pregnancy (GDM)", domain: "KH", isCore: true },
      { code: "OG9.3", text: "Describe and discuss the management of heart disease in pregnancy", domain: "KH", isCore: true },
      { code: "OG9.4", text: "Describe and discuss the management of thyroid disorders in pregnancy", domain: "K", isCore: true },
      { code: "OG9.5", text: "Describe and discuss the management of urinary tract infections in pregnancy", domain: "K", isCore: true },
    ],
  },
  {
    id: "og10", module: "OG10", title: "Rh Incompatibility",
    subspecialty: "high-risk-pregnancy", topicSlugs: ["rh-incompatibility"],
    competencies: [
      { code: "OG10.1", text: "Describe and discuss the etiology, pathophysiology and management of Rh-negative pregnancy", domain: "KH", isCore: true },
      { code: "OG10.2", text: "Describe the principles of prevention of Rh isoimmunization", domain: "KH", isCore: true },
    ],
  },
  {
    id: "og11", module: "OG11", title: "Multiple Pregnancy",
    subspecialty: "high-risk-pregnancy", topicSlugs: ["multiple-pregnancy"],
    competencies: [
      { code: "OG11.1", text: "Describe and discuss the etiology, clinical features, diagnosis and management of multiple pregnancy", domain: "K", isCore: true },
    ],
  },
  {
    id: "og12", module: "OG12", title: "Normal Labor",
    subspecialty: "labor-delivery", topicSlugs: ["normal-labor"],
    competencies: [
      { code: "OG12.1", text: "Describe and discuss the mechanism of normal labor", domain: "K", isCore: true },
      { code: "OG12.2", text: "Describe and discuss the stages of labor and management", domain: "KH", isCore: true },
      { code: "OG12.3", text: "Describe the use of partograph in the management of labor", domain: "SH", isCore: true },
      { code: "OG12.4", text: "Describe the mechanism and management of third stage of labor", domain: "KH", isCore: true },
    ],
  },
  {
    id: "og13", module: "OG13", title: "Abnormal Labor",
    subspecialty: "labor-delivery", topicSlugs: ["abnormal-labor", "obstructed-labor"],
    competencies: [
      { code: "OG13.1", text: "Describe and discuss the etiology, clinical features and management of abnormal labor", domain: "KH", isCore: true },
      { code: "OG13.2", text: "Describe and discuss obstructed labor and its complications", domain: "KH", isCore: true },
      { code: "OG13.3", text: "Describe and discuss the management of malpresentations (breech, transverse lie)", domain: "KH", isCore: true },
    ],
  },
  {
    id: "og14", module: "OG14", title: "Induction of Labor",
    subspecialty: "labor-delivery", topicSlugs: ["induction-of-labor"],
    competencies: [
      { code: "OG14.1", text: "Describe the indications and methods of induction of labor", domain: "KH", isCore: true },
      { code: "OG14.2", text: "Describe the Bishop score and its use in predicting successful induction", domain: "KH", isCore: true },
    ],
  },
  {
    id: "og15", module: "OG15", title: "Operative Obstetrics",
    subspecialty: "labor-delivery", topicSlugs: ["cesarean-section", "instrumental-delivery"],
    competencies: [
      { code: "OG15.1", text: "Describe the indications, technique and complications of cesarean section", domain: "KH", isCore: true },
      { code: "OG15.2", text: "Describe the indications and technique of instrumental delivery (forceps, vacuum)", domain: "KH", isCore: true },
      { code: "OG15.3", text: "Describe the management of shoulder dystocia", domain: "KH", isCore: true },
    ],
  },
  {
    id: "og16", module: "OG16", title: "Postpartum Hemorrhage",
    subspecialty: "obstetrics", topicSlugs: ["pph"],
    competencies: [
      { code: "OG16.1", text: "Describe and discuss the etiology, clinical features, diagnosis and management of postpartum hemorrhage", domain: "KH", isCore: true },
      { code: "OG16.2", text: "Describe the management of retained placenta", domain: "KH", isCore: true },
      { code: "OG16.3", text: "Describe the uterotonic agents and their use in PPH", domain: "KH", isCore: true },
    ],
  },
  {
    id: "og17", module: "OG17", title: "Puerperium",
    subspecialty: "obstetrics", topicSlugs: ["puerperium", "puerperal-sepsis"],
    competencies: [
      { code: "OG17.1", text: "Describe the physiology of normal puerperium", domain: "K", isCore: true },
      { code: "OG17.2", text: "Describe and discuss puerperal sepsis — etiology, diagnosis and management", domain: "KH", isCore: true },
      { code: "OG17.3", text: "Discuss breastfeeding and lactation management", domain: "KH", isCore: true },
    ],
  },
  {
    id: "og18", module: "OG18", title: "Abortion",
    subspecialty: "obstetrics", topicSlugs: ["abortion-types", "mtp"],
    competencies: [
      { code: "OG18.1", text: "Describe the classification, etiology, clinical features and management of abortion", domain: "KH", isCore: true },
      { code: "OG18.2", text: "Describe the MTP Act and its provisions", domain: "K", isCore: true },
      { code: "OG18.3", text: "Describe the management of septic abortion", domain: "KH", isCore: true },
    ],
  },
  {
    id: "og19", module: "OG19", title: "Ectopic Pregnancy",
    subspecialty: "obstetrics", topicSlugs: ["ectopic-pregnancy"],
    competencies: [
      { code: "OG19.1", text: "Describe and discuss the etiology, clinical features, diagnosis and management of ectopic pregnancy", domain: "KH", isCore: true },
    ],
  },
  {
    id: "og20", module: "OG20", title: "Gestational Trophoblastic Disease",
    subspecialty: "obstetrics", topicSlugs: ["gtd"],
    competencies: [
      { code: "OG20.1", text: "Describe and discuss the etiology, clinical features, diagnosis and management of gestational trophoblastic disease", domain: "KH", isCore: true },
    ],
  },
  {
    id: "og21", module: "OG21", title: "Preterm Labor & PROM",
    subspecialty: "high-risk-pregnancy", topicSlugs: ["preterm-labor", "prom"],
    competencies: [
      { code: "OG21.1", text: "Describe and discuss the etiology, clinical features and management of preterm labor", domain: "KH", isCore: true },
      { code: "OG21.2", text: "Describe and discuss the management of premature rupture of membranes", domain: "KH", isCore: true },
    ],
  },
  {
    id: "og22", module: "OG22", title: "Intrauterine Growth Restriction",
    subspecialty: "fetal-medicine", topicSlugs: ["iugr"],
    competencies: [
      { code: "OG22.1", text: "Describe and discuss the etiology, clinical features, diagnosis and management of IUGR", domain: "KH", isCore: true },
      { code: "OG22.2", text: "Discuss fetal surveillance methods — Doppler, CTG, BPP", domain: "KH", isCore: true },
    ],
  },

  // Gynecology (OG23–OG39)
  {
    id: "og23", module: "OG23", title: "Puberty & Amenorrhea",
    subspecialty: "reproductive-endo", topicSlugs: ["puberty", "amenorrhea"],
    competencies: [
      { code: "OG23.1", text: "Describe and discuss the physiology of puberty and its disorders", domain: "K", isCore: true },
      { code: "OG23.2", text: "Describe and discuss the etiology, clinical features, diagnosis and management of amenorrhea", domain: "K", isCore: true },
    ],
  },
  {
    id: "og24", module: "OG24", title: "Abnormal Uterine Bleeding",
    subspecialty: "benign-gynecology", topicSlugs: ["aub"],
    competencies: [
      { code: "OG24.1", text: "Describe and discuss the PALM-COEIN classification of abnormal uterine bleeding", domain: "K", isCore: true },
      { code: "OG24.2", text: "Describe and discuss the investigation and management of AUB", domain: "KH", isCore: true },
    ],
  },
  {
    id: "og25", module: "OG25", title: "Dysmenorrhea & PMS",
    subspecialty: "benign-gynecology", topicSlugs: ["dysmenorrhea"],
    competencies: [
      { code: "OG25.1", text: "Describe and discuss the etiology, clinical features and management of dysmenorrhea", domain: "K", isCore: true },
      { code: "OG25.2", text: "Describe and discuss the clinical features and management of premenstrual syndrome", domain: "K", isCore: true },
    ],
  },
  {
    id: "og26", module: "OG26", title: "Endometriosis",
    subspecialty: "benign-gynecology", topicSlugs: ["endometriosis"],
    competencies: [
      { code: "OG26.1", text: "Describe and discuss the etiology, clinical features, diagnosis and management of endometriosis", domain: "K", isCore: true },
      { code: "OG26.2", text: "Describe and discuss the role of laparoscopy in endometriosis", domain: "K", isCore: true },
    ],
  },
  {
    id: "og27", module: "OG27", title: "Pelvic Inflammatory Disease",
    subspecialty: "benign-gynecology", topicSlugs: ["pid"],
    competencies: [
      { code: "OG27.1", text: "Describe and discuss the etiology, clinical features, diagnosis and management of PID", domain: "KH", isCore: true },
      { code: "OG27.2", text: "Describe and discuss the sequelae and complications of PID", domain: "K", isCore: true },
    ],
  },
  {
    id: "og28", module: "OG28", title: "Uterine Fibroids",
    subspecialty: "benign-gynecology", topicSlugs: ["fibroids"],
    competencies: [
      { code: "OG28.1", text: "Describe and discuss the etiology, clinical features, diagnosis and management of uterine fibroids", domain: "KH", isCore: true },
      { code: "OG28.2", text: "Discuss the surgical and non-surgical management of fibroids", domain: "KH", isCore: true },
    ],
  },
  {
    id: "og29", module: "OG29", title: "Ovarian Tumors",
    subspecialty: "gynec-oncology", topicSlugs: ["ovarian-tumors"],
    competencies: [
      { code: "OG29.1", text: "Describe and discuss the classification of ovarian tumors", domain: "K", isCore: true },
      { code: "OG29.2", text: "Describe and discuss the clinical features, diagnosis and management of benign and malignant ovarian tumors", domain: "KH", isCore: true },
      { code: "OG29.3", text: "Describe and discuss the staging and management of ovarian cancer", domain: "KH", isCore: true },
    ],
  },
  {
    id: "og30", module: "OG30", title: "Cervical Cancer",
    subspecialty: "gynec-oncology", topicSlugs: ["cervical-cancer", "cervical-screening"],
    competencies: [
      { code: "OG30.1", text: "Describe and discuss the etiology, clinical features, diagnosis and management of cervical cancer", domain: "KH", isCore: true },
      { code: "OG30.2", text: "Describe the screening methods for cervical cancer (Pap smear, VIA, HPV testing)", domain: "SH", isCore: true },
      { code: "OG30.3", text: "Describe the role of HPV vaccination in prevention of cervical cancer", domain: "KH", isCore: true },
    ],
  },
  {
    id: "og31", module: "OG31", title: "Uterine Cancer",
    subspecialty: "gynec-oncology", topicSlugs: ["endometrial-cancer"],
    competencies: [
      { code: "OG31.1", text: "Describe and discuss the etiology, clinical features, diagnosis and management of carcinoma endometrium", domain: "K", isCore: true },
    ],
  },
  {
    id: "og32", module: "OG32", title: "Pelvic Organ Prolapse",
    subspecialty: "urogynecology", topicSlugs: ["pelvic-organ-prolapse"],
    competencies: [
      { code: "OG32.1", text: "Describe and discuss the etiology, clinical features and classification of pelvic organ prolapse", domain: "KH", isCore: true },
      { code: "OG32.2", text: "Describe the management options — conservative and surgical", domain: "KH", isCore: true },
    ],
  },
  {
    id: "og33", module: "OG33", title: "Urinary Incontinence",
    subspecialty: "urogynecology", topicSlugs: ["urinary-incontinence"],
    competencies: [
      { code: "OG33.1", text: "Describe and discuss the types, clinical features, diagnosis and management of urinary incontinence", domain: "K", isCore: true },
    ],
  },
  {
    id: "og34", module: "OG34", title: "Infertility",
    subspecialty: "infertility", topicSlugs: ["infertility-workup"],
    competencies: [
      { code: "OG34.1", text: "Describe and discuss the causes, investigation and management of infertility", domain: "K", isCore: true },
      { code: "OG34.2", text: "Describe and discuss the principles of ovulation induction", domain: "K", isCore: true },
      { code: "OG34.3", text: "Describe and discuss the role of assisted reproductive techniques (IUI, IVF, ICSI)", domain: "K", isCore: true },
      { code: "OG34.4", text: "Describe the ethical and legal aspects of ART", domain: "K", isCore: true },
    ],
  },
  {
    id: "og35", module: "OG35", title: "Contraception",
    subspecialty: "contraception", topicSlugs: ["contraception-methods"],
    competencies: [
      { code: "OG35.1", text: "Describe and discuss the types of contraceptive methods — barrier, hormonal, IUCD, natural", domain: "KH", isCore: true },
      { code: "OG35.2", text: "Describe the indications, technique and complications of IUCD insertion", domain: "SH", isCore: true },
      { code: "OG35.3", text: "Describe and discuss emergency contraception", domain: "KH", isCore: true },
      { code: "OG35.4", text: "Describe and discuss the National Family Planning Programme", domain: "K", isCore: true },
      { code: "OG35.5", text: "Describe and discuss male and female sterilization methods", domain: "K", isCore: true },
    ],
  },
  {
    id: "og36", module: "OG36", title: "Menopause & HRT",
    subspecialty: "reproductive-endo", topicSlugs: ["menopause"],
    competencies: [
      { code: "OG36.1", text: "Describe and discuss the physiology of menopause and its clinical features", domain: "K", isCore: true },
      { code: "OG36.2", text: "Describe and discuss the indications, benefits and risks of hormone replacement therapy", domain: "K", isCore: true },
    ],
  },
  {
    id: "og37", module: "OG37", title: "PCOS & Hirsutism",
    subspecialty: "reproductive-endo", topicSlugs: ["pcos"],
    competencies: [
      { code: "OG37.1", text: "Describe and discuss the etiology, clinical features, diagnosis and management of PCOS", domain: "KH", isCore: true },
      { code: "OG37.2", text: "Describe and discuss the approach to a patient with hirsutism and virilization", domain: "K", isCore: true },
    ],
  },
  {
    id: "og38", module: "OG38", title: "Vulvar & Vaginal Infections",
    subspecialty: "benign-gynecology", topicSlugs: ["vaginitis", "sti"],
    competencies: [
      { code: "OG38.1", text: "Describe and discuss the etiology, clinical features, diagnosis and management of vulvovaginal infections", domain: "KH", isCore: true },
      { code: "OG38.2", text: "Describe and discuss the management of sexually transmitted infections in women", domain: "KH", isCore: true },
    ],
  },
  {
    id: "og39", module: "OG39", title: "Gynecological Procedures & Ethics",
    subspecialty: "gynecology", topicSlugs: ["gynec-procedures"],
    competencies: [
      { code: "OG39.1", text: "Observe and assist in common gynecological procedures (D&C, colposcopy)", domain: "SH", isCore: true },
      { code: "OG39.2", text: "Describe the principles of hysterectomy — indications and types", domain: "K", isCore: true },
      { code: "OG39.3", text: "Discuss the role of laparoscopy and hysteroscopy in gynecology", domain: "K", isCore: true },
      { code: "OG39.4", text: "Discuss medico-legal issues in obstetrics and gynecology (PCPNDT Act, MTP Act)", domain: "K", isCore: true },
    ],
  },
];

// ─── PG: MS OBG Topics ──────────────────────────────────────────────────────

export const OBGYN_PG_TOPICS: ObgynPGTopic[] = [
  // General
  { id: "pg-gen-01", title: "Applied Anatomy & Embryology", section: "General Topics", subspecialty: "general-topics", topicSlugs: ["reproductive-anatomy"], ugModuleRefs: ["OG1"] },
  { id: "pg-gen-02", title: "Reproductive Physiology & Endocrinology", section: "General Topics", subspecialty: "general-topics", topicSlugs: ["reproductive-physiology"], ugModuleRefs: ["OG1"] },
  { id: "pg-gen-03", title: "Research Methods & Biostatistics in OBG", section: "General Topics", subspecialty: "general-topics", topicSlugs: ["research-methods"], ugModuleRefs: [] },

  // Antenatal
  { id: "pg-anc-01", title: "Antenatal Care & High-Risk Screening", section: "Obstetrics", subspecialty: "antenatal-care", topicSlugs: ["antenatal-care-basics"], ugModuleRefs: ["OG2", "OG3"] },
  { id: "pg-anc-02", title: "Obstetric Ultrasonography", section: "Obstetrics", subspecialty: "antenatal-care", topicSlugs: ["obs-ultrasound"], ugModuleRefs: ["OG4"] },
  { id: "pg-anc-03", title: "Nutrition & Anemia in Pregnancy", section: "Obstetrics", subspecialty: "antenatal-care", topicSlugs: ["nutrition-pregnancy", "anemia-pregnancy"], ugModuleRefs: ["OG5", "OG9"] },
  { id: "pg-anc-04", title: "Hyperemesis & Minor Ailments", section: "Obstetrics", subspecialty: "antenatal-care", topicSlugs: ["hyperemesis"], ugModuleRefs: ["OG6"] },
  { id: "pg-anc-05", title: "Preterm Birth — Prevention & Management", section: "Obstetrics", subspecialty: "antenatal-care", topicSlugs: ["preterm-labor"], ugModuleRefs: ["OG21"] },
  { id: "pg-anc-06", title: "PROM — Diagnosis & Management", section: "Obstetrics", subspecialty: "antenatal-care", topicSlugs: ["prom"], ugModuleRefs: ["OG21"] },

  // Labor
  { id: "pg-lab-01", title: "Normal Labor — Mechanism & Management", section: "Obstetrics", subspecialty: "labor-delivery", topicSlugs: ["normal-labor"], ugModuleRefs: ["OG12"] },
  { id: "pg-lab-02", title: "Abnormal Labor & Dystocia", section: "Obstetrics", subspecialty: "labor-delivery", topicSlugs: ["abnormal-labor"], ugModuleRefs: ["OG13"] },
  { id: "pg-lab-03", title: "Induction & Augmentation of Labor", section: "Obstetrics", subspecialty: "labor-delivery", topicSlugs: ["induction-of-labor"], ugModuleRefs: ["OG14"] },
  { id: "pg-lab-04", title: "Cesarean Section — Technique & Complications", section: "Obstetrics", subspecialty: "labor-delivery", topicSlugs: ["cesarean-section"], ugModuleRefs: ["OG15"] },
  { id: "pg-lab-05", title: "Instrumental Delivery", section: "Obstetrics", subspecialty: "labor-delivery", topicSlugs: ["instrumental-delivery"], ugModuleRefs: ["OG15"] },
  { id: "pg-lab-06", title: "Obstetric Analgesia & Anesthesia", section: "Obstetrics", subspecialty: "labor-delivery", topicSlugs: ["obstetric-anesthesia"], ugModuleRefs: [] },
  { id: "pg-lab-07", title: "Intrapartum Fetal Monitoring", section: "Obstetrics", subspecialty: "labor-delivery", topicSlugs: ["ctg-monitoring"], ugModuleRefs: ["OG12"] },

  // High-Risk Pregnancy
  { id: "pg-hrp-01", title: "Hypertensive Disorders — PIH, PE, Eclampsia", section: "Obstetrics", subspecialty: "high-risk-pregnancy", topicSlugs: ["preeclampsia", "eclampsia"], ugModuleRefs: ["OG7"] },
  { id: "pg-hrp-02", title: "Gestational Diabetes Mellitus", section: "Obstetrics", subspecialty: "high-risk-pregnancy", topicSlugs: ["diabetes-pregnancy"], ugModuleRefs: ["OG9"] },
  { id: "pg-hrp-03", title: "Heart Disease & Pregnancy", section: "Obstetrics", subspecialty: "high-risk-pregnancy", topicSlugs: ["heart-disease-pregnancy"], ugModuleRefs: ["OG9"] },
  { id: "pg-hrp-04", title: "Rh Isoimmunization", section: "Obstetrics", subspecialty: "high-risk-pregnancy", topicSlugs: ["rh-incompatibility"], ugModuleRefs: ["OG10"] },
  { id: "pg-hrp-05", title: "Multiple Pregnancy & Its Complications", section: "Obstetrics", subspecialty: "high-risk-pregnancy", topicSlugs: ["multiple-pregnancy"], ugModuleRefs: ["OG11"] },
  { id: "pg-hrp-06", title: "Infections in Pregnancy (TORCH, HIV)", section: "Obstetrics", subspecialty: "high-risk-pregnancy", topicSlugs: ["infections-pregnancy"], ugModuleRefs: ["OG9"] },

  // Obstetric Complications
  { id: "pg-obs-01", title: "Antepartum Hemorrhage — Complete Management", section: "Obstetrics", subspecialty: "obstetrics", topicSlugs: ["placenta-previa", "abruption"], ugModuleRefs: ["OG8"] },
  { id: "pg-obs-02", title: "Postpartum Hemorrhage — Protocol-Based Care", section: "Obstetrics", subspecialty: "obstetrics", topicSlugs: ["pph"], ugModuleRefs: ["OG16"] },
  { id: "pg-obs-03", title: "Puerperal Sepsis & Complications", section: "Obstetrics", subspecialty: "obstetrics", topicSlugs: ["puerperal-sepsis"], ugModuleRefs: ["OG17"] },
  { id: "pg-obs-04", title: "Abortion & Ectopic Pregnancy — Surgical Management", section: "Obstetrics", subspecialty: "obstetrics", topicSlugs: ["ectopic-pregnancy", "mtp"], ugModuleRefs: ["OG18", "OG19"] },
  { id: "pg-obs-05", title: "GTD — Molar Pregnancy & Choriocarcinoma", section: "Obstetrics", subspecialty: "obstetrics", topicSlugs: ["gtd"], ugModuleRefs: ["OG20"] },

  // Benign Gynecology
  { id: "pg-bg-01", title: "Abnormal Uterine Bleeding — PALM-COEIN", section: "Gynecology", subspecialty: "benign-gynecology", topicSlugs: ["aub"], ugModuleRefs: ["OG24"] },
  { id: "pg-bg-02", title: "Endometriosis & Adenomyosis", section: "Gynecology", subspecialty: "benign-gynecology", topicSlugs: ["endometriosis"], ugModuleRefs: ["OG26"] },
  { id: "pg-bg-03", title: "Uterine Fibroids — Medical & Surgical Management", section: "Gynecology", subspecialty: "benign-gynecology", topicSlugs: ["fibroids"], ugModuleRefs: ["OG28"] },
  { id: "pg-bg-04", title: "PID & Tubo-ovarian Abscess", section: "Gynecology", subspecialty: "benign-gynecology", topicSlugs: ["pid"], ugModuleRefs: ["OG27"] },
  { id: "pg-bg-05", title: "Vulvovaginal Infections & STIs", section: "Gynecology", subspecialty: "benign-gynecology", topicSlugs: ["vaginitis", "sti"], ugModuleRefs: ["OG38"] },

  // Gynec Oncology
  { id: "pg-go-01", title: "Cervical Cancer — Screening & Management", section: "Gynecology", subspecialty: "gynec-oncology", topicSlugs: ["cervical-cancer"], ugModuleRefs: ["OG30"] },
  { id: "pg-go-02", title: "Ovarian Cancer — Staging & Chemotherapy", section: "Gynecology", subspecialty: "gynec-oncology", topicSlugs: ["ovarian-tumors"], ugModuleRefs: ["OG29"] },
  { id: "pg-go-03", title: "Endometrial Cancer", section: "Gynecology", subspecialty: "gynec-oncology", topicSlugs: ["endometrial-cancer"], ugModuleRefs: ["OG31"] },
  { id: "pg-go-04", title: "Vulvar & Vaginal Malignancies", section: "Gynecology", subspecialty: "gynec-oncology", topicSlugs: ["vulvar-cancer"], ugModuleRefs: [] },
  { id: "pg-go-05", title: "Gestational Trophoblastic Neoplasia", section: "Gynecology", subspecialty: "gynec-oncology", topicSlugs: ["gtd"], ugModuleRefs: ["OG20"] },

  // Infertility
  { id: "pg-inf-01", title: "Infertility Investigation — Male & Female Factors", section: "Gynecology", subspecialty: "infertility", topicSlugs: ["infertility-workup"], ugModuleRefs: ["OG34"] },
  { id: "pg-inf-02", title: "Ovulation Induction & IUI", section: "Gynecology", subspecialty: "infertility", topicSlugs: ["ovulation-induction"], ugModuleRefs: ["OG34"] },
  { id: "pg-inf-03", title: "IVF, ICSI & ART", section: "Gynecology", subspecialty: "infertility", topicSlugs: ["art-ivf"], ugModuleRefs: ["OG34"] },
  { id: "pg-inf-04", title: "Recurrent Pregnancy Loss", section: "Gynecology", subspecialty: "infertility", topicSlugs: ["recurrent-miscarriage"], ugModuleRefs: ["OG34"] },

  // Contraception
  { id: "pg-con-01", title: "Hormonal Contraception & IUCD", section: "Gynecology", subspecialty: "contraception", topicSlugs: ["contraception-methods"], ugModuleRefs: ["OG35"] },
  { id: "pg-con-02", title: "Sterilization & Emergency Contraception", section: "Gynecology", subspecialty: "contraception", topicSlugs: ["emergency-contraception"], ugModuleRefs: ["OG35"] },
  { id: "pg-con-03", title: "National Family Planning Programme", section: "Gynecology", subspecialty: "contraception", topicSlugs: ["family-planning"], ugModuleRefs: ["OG35"] },

  // Reproductive Endocrinology
  { id: "pg-re-01", title: "PCOS — Comprehensive Management", section: "Gynecology", subspecialty: "reproductive-endo", topicSlugs: ["pcos"], ugModuleRefs: ["OG37"] },
  { id: "pg-re-02", title: "Amenorrhea — Evaluation & Management", section: "Gynecology", subspecialty: "reproductive-endo", topicSlugs: ["amenorrhea"], ugModuleRefs: ["OG23"] },
  { id: "pg-re-03", title: "Menopause & Hormone Therapy", section: "Gynecology", subspecialty: "reproductive-endo", topicSlugs: ["menopause"], ugModuleRefs: ["OG36"] },
  { id: "pg-re-04", title: "Disorders of Sexual Development", section: "Gynecology", subspecialty: "reproductive-endo", topicSlugs: ["dsd"], ugModuleRefs: ["OG23"] },

  // Urogynecology
  { id: "pg-uro-01", title: "Pelvic Organ Prolapse — Surgical Options", section: "Gynecology", subspecialty: "urogynecology", topicSlugs: ["pelvic-organ-prolapse"], ugModuleRefs: ["OG32"] },
  { id: "pg-uro-02", title: "Urinary Incontinence — Evaluation & Management", section: "Gynecology", subspecialty: "urogynecology", topicSlugs: ["urinary-incontinence"], ugModuleRefs: ["OG33"] },
  { id: "pg-uro-03", title: "Urodynamics & Pelvic Floor Rehabilitation", section: "Gynecology", subspecialty: "urogynecology", topicSlugs: ["urodynamics"], ugModuleRefs: ["OG33"] },

  // Fetal Medicine
  { id: "pg-fm-01", title: "Fetal Growth Assessment & Doppler", section: "Obstetrics", subspecialty: "fetal-medicine", topicSlugs: ["fetal-growth"], ugModuleRefs: ["OG4", "OG22"] },
  { id: "pg-fm-02", title: "IUGR — Diagnosis & Management", section: "Obstetrics", subspecialty: "fetal-medicine", topicSlugs: ["iugr"], ugModuleRefs: ["OG22"] },
  { id: "pg-fm-03", title: "Prenatal Diagnosis & Genetic Counseling", section: "Obstetrics", subspecialty: "fetal-medicine", topicSlugs: ["prenatal-diagnosis"], ugModuleRefs: ["OG4"] },
  { id: "pg-fm-04", title: "Fetal Therapy & Interventions", section: "Obstetrics", subspecialty: "fetal-medicine", topicSlugs: ["fetal-therapy"], ugModuleRefs: [] },

  // Procedures
  { id: "pg-proc-01", title: "Hysterectomy — Techniques & Complications", section: "Gynecology", subspecialty: "gynecology", topicSlugs: ["gynec-procedures"], ugModuleRefs: ["OG39"] },
  { id: "pg-proc-02", title: "Laparoscopy & Hysteroscopy", section: "Gynecology", subspecialty: "gynecology", topicSlugs: ["laparoscopy"], ugModuleRefs: ["OG39"] },
  { id: "pg-proc-03", title: "Colposcopy & LEEP", section: "Gynecology", subspecialty: "gynecology", topicSlugs: ["colposcopy"], ugModuleRefs: ["OG30", "OG39"] },
];

// ─── SS: MCh/DM OBG Super Specialties ────────────────────────────────────────

export const OBGYN_SS_SPECIALTIES: {
  id: string;
  degree: "MCh" | "DM";
  title: string;
  slug: string;
  description: string;
  subspecialties: string[];
  pgPrerequisite: string;
}[] = [
  {
    id: "mch-gynae-oncology",
    degree: "MCh",
    title: "MCh Gynae Oncology",
    slug: "gynae-oncology",
    description: "Cervical, ovarian, endometrial, vulvar cancers — radical surgery, chemotherapy, staging",
    subspecialties: ["gynec-oncology"],
    pgPrerequisite: "MS Obstetrics & Gynaecology",
  },
  {
    id: "mch-reproductive-medicine",
    degree: "MCh",
    title: "MCh Reproductive Medicine & Surgery",
    slug: "reproductive-medicine",
    description: "Advanced ART, reproductive endocrinology, microsurgery, IVF",
    subspecialties: ["infertility", "reproductive-endo"],
    pgPrerequisite: "MS Obstetrics & Gynaecology",
  },
  {
    id: "dm-neonatology",
    degree: "DM",
    title: "DM Neonatology",
    slug: "neonatology",
    description: "Neonatal intensive care, prematurity, perinatal medicine (related SS)",
    subspecialties: ["fetal-medicine"],
    pgPrerequisite: "MD Pediatrics",
  },
];

// ─── Helper functions ────────────────────────────────────────────────────────

export function getTotalUGCompetencies(): number {
  return OBGYN_UG_MODULES.reduce((sum, m) => sum + m.competencies.length, 0);
}

export function getModulesBySubspecialty(subspecialty: string): ObgynUGModule[] {
  return OBGYN_UG_MODULES.filter((m) => m.subspecialty === subspecialty);
}

export function getPGTopicsBySubspecialty(subspecialty: string): ObgynPGTopic[] {
  return OBGYN_PG_TOPICS.filter((t) => t.subspecialty === subspecialty);
}
