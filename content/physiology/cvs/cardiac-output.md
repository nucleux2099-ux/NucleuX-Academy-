# Cardiac Output & Its Regulation

> 📚 **Sources:** Guyton & Hall 14th Ed (Ch 9, 20-21), Ganong 26th Ed (Ch 30, 33)
> **Level:** UG

## Core Concept

**Cardiac Output (CO)** is the volume of blood pumped by each ventricle per minute. It is determined by heart rate and stroke volume, and is regulated by intrinsic (Frank-Starling) and extrinsic (neural, hormonal) mechanisms.

**CO = HR × SV** = 72 × 70 mL = **5 L/min** (at rest)

## Key Points

- Normal resting CO: **5 L/min** (can increase to **25 L/min** in exercise)
- **Cardiac Index (CI):** CO/BSA = 3.2 L/min/m² (normalizes for body size)
- **Frank-Starling mechanism:** ↑ preload → ↑ stretch → ↑ contractility
- **Four determinants of CO:** Preload, Afterload, Contractility, Heart Rate
- Venous return EQUALS cardiac output at steady state

## Detailed Content

### Determinants of Cardiac Output

```
           CARDIAC OUTPUT (CO)
                  │
        ┌─────────┴─────────┐
        ↓                   ↓
   HEART RATE (HR)    STROKE VOLUME (SV)
        │                   │
   Chronotropy        ┌─────┼─────┐
        │             ↓     ↓     ↓
   SA node rate    PRELOAD  AFTERLOAD  CONTRACTILITY
                   (EDV)    (TPR)      (Inotropy)
```

### 1. Preload (Frank-Starling Mechanism)

**Definition:** Ventricular wall tension at end-diastole (approximated by EDV)

```
↑ Venous return → ↑ EDV → ↑ Sarcomere stretch
                        → Optimal actin-myosin overlap
                        → ↑ Force of contraction
                        → ↑ Stroke Volume

"The heart pumps what it receives"
```

**Frank-Starling Curve:**
```
SV
↑     ___________  ← Normal heart (steep curve)
│   /
│  /    ________   ← Failing heart (flat curve)
│ /   /
│/___/____________→ EDV (Preload)
```

| Factor | Effect on Preload |
|--------|-------------------|
| ↑ Venous return | ↑ Preload |
| ↑ Blood volume | ↑ Preload |
| Venodilation (nitrates) | ↓ Preload |
| Standing up | ↓ Preload |
| Positive pressure ventilation | ↓ Preload |

### 2. Afterload

**Definition:** Resistance against which the ventricle must eject blood (approximated by aortic pressure/TPR)

```
↑ Afterload → ↑ Wall stress during ejection
            → ↑ Myocardial O₂ demand
            → ↓ Stroke Volume (if excessive)
```

**Laplace's Law:** Wall Tension = (Pressure × Radius) / (2 × Wall Thickness)

| Factor | Effect on Afterload |
|--------|---------------------|
| Hypertension | ↑ Afterload |
| Aortic stenosis | ↑ Afterload |
| Vasodilators | ↓ Afterload |
| LV hypertrophy | ↓ Wall stress (compensatory) |

### 3. Contractility (Inotropy)

**Definition:** Intrinsic ability of myocardium to generate force, independent of preload/afterload

```
↑ Contractility → ↑ Force at any given preload
               → ↑ Stroke Volume
               → ↑ Ejection Fraction
```

| Positive Inotropes | Negative Inotropes |
|-------------------|-------------------|
| Sympathetic stimulation (β1) | Parasympathetic (indirect) |
| Catecholamines | β-blockers |
| Digoxin | Calcium channel blockers |
| Calcium | Heart failure |
| Caffeine | Hypoxia, Acidosis |

**Mechanism of β1 stimulation:**
```
β1 receptor → Gs → ↑ cAMP → PKA → Phosphorylates:
1. L-type Ca²⁺ channels (↑ Ca²⁺ entry)
2. Phospholamban (↑ SERCA activity → ↑ SR Ca²⁺)
3. Troponin I (faster relaxation)
→ ↑ Contractility + ↑ Lusitropy (relaxation)
```

### 4. Heart Rate (Chronotropy)

```
CO = HR × SV

Initially: ↑ HR → ↑ CO
But at very high HR: ↓ Diastolic filling time → ↓ SV → ↓ CO

Optimal HR for max CO: ~150-170 bpm in healthy adults
```

### Cardiac Output Measurement

| Method | Principle | Formula |
|--------|-----------|---------|
| **Fick Principle** | O₂ consumption / A-V O₂ difference | CO = VO₂ / (CaO₂ - CvO₂) |
| **Thermodilution** | Cold saline injection, temp change | Area under curve |
| **Echocardiography** | Doppler flow × CSA | CO = VTI × CSA × HR |

**Fick Principle Example:**
```
VO₂ = 250 mL/min
CaO₂ = 200 mL O₂/L blood
CvO₂ = 150 mL O₂/L blood

CO = 250 / (200 - 150) = 250/50 = 5 L/min
```

### Venous Return

**At steady state: Venous Return = Cardiac Output**

Factors affecting venous return:
1. **Mean Systemic Filling Pressure (MSFP):** ~7 mmHg - driving force
2. **Right atrial pressure:** Back-pressure opposing return
3. **Venous resistance:** Impedance to flow

**Guyton's Venous Return Curve:**
```
VR
↑
│  \
│   \
│    \________
│             \
└──────────────→ RAP
    MSFP (x-intercept)
```

## Clinical Correlations

### Heart Failure

**Systolic HF (HFrEF):**
- ↓ Contractility → ↓ EF
- Frank-Starling curve flattened
- Compensatory: ↑ preload, ↑ HR, ↑ afterload (all worsen over time)

**Diastolic HF (HFpEF):**
- Normal EF, impaired relaxation
- ↓ Compliance → ↓ filling → ↓ SV

### Shock States

| Type | CO | TPR | Preload |
|------|-----|-----|---------|
| Cardiogenic | ↓↓ | ↑ | ↑ |
| Hypovolemic | ↓ | ↑ | ↓↓ |
| Distributive (Septic) | ↑/N | ↓↓ | ↓ |
| Obstructive | ↓ | ↑ | Variable |

### Valvular Lesions

| Lesion | Preload | Afterload | Compensation |
|--------|---------|-----------|--------------|
| Aortic Stenosis | N | ↑↑ | LV hypertrophy |
| Aortic Regurgitation | ↑↑ | ↑ | LV dilation |
| Mitral Stenosis | ↓ | N | LA dilation, AFib |
| Mitral Regurgitation | ↑ | ↓ | LV dilation |

## High-Yield for Exams

1. **Normal CO:** 5 L/min; **Cardiac Index:** 3.2 L/min/m²
2. **Frank-Starling** operates on beat-to-beat basis
3. **Digoxin** increases contractility by inhibiting Na⁺/K⁺-ATPase → ↑ intracellular Ca²⁺
4. **Dobutamine:** β1 agonist → ↑ contractility (used in cardiogenic shock)
5. **Milrinone:** PDE inhibitor → ↑ cAMP → ↑ contractility + vasodilation
6. **Fick method** is the gold standard for CO measurement
7. **Ejection fraction <40%** = Systolic dysfunction
8. **High-output failure:** Hyperthyroidism, AV fistula, Beriberi, Anemia, Paget's
9. **Valsalva maneuver:** Phase II = ↓ VR → ↓ CO → ↓ BP
10. **Exercise:** ↑ CO up to 5x (↑ HR + ↑ SV + ↓ TPR)

### Key Equations
```
CO = HR × SV
CI = CO / BSA
EF = SV / EDV × 100
Fick: CO = VO₂ / (CaO₂ - CvO₂)
Wall Tension = (P × r) / (2 × h)   [Laplace]
```
