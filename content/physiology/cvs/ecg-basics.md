# ECG Basics & Interpretation

> 📚 **Sources:** Guyton & Hall 14th Ed (Ch 11-13), Dubin's Rapid ECG Interpretation
> **Level:** UG

## Core Concept

The **Electrocardiogram (ECG/EKG)** records the electrical activity of the heart from the body surface. It represents the sum of all cardiac action potentials occurring at any given moment, NOT the mechanical contraction. The standard 12-lead ECG provides 12 different "views" of the heart's electrical activity.

## Key Points

- **P wave:** Atrial depolarization
- **QRS complex:** Ventricular depolarization (0.06-0.10s)
- **T wave:** Ventricular repolarization
- **PR interval:** AV nodal conduction time (0.12-0.20s)
- **QT interval:** Total ventricular electrical activity
- Paper speed: **25 mm/s** (1 small box = 0.04s, 1 large box = 0.2s)

## Detailed Content

### ECG Paper & Measurements

```
│←──── 1 large box = 0.2 sec ────→│
│  ┌──┬──┬──┬──┬──┐               │
│  │  │  │  │  │  │ ← 1 small box │
│  ├──┼──┼──┼──┼──┤   = 0.04 sec  │
│  │  │  │  │  │  │   = 1 mm      │
│  ├──┼──┼──┼──┼──┤               │
│  │  │  │  │  │  │ Voltage:      │
│  ├──┼──┼──┼──┼──┤ 1 mm = 0.1 mV │
│  │  │  │  │  │  │               │
│  └──┴──┴──┴──┴──┘               │
```

### ECG Waveforms & Intervals

```
                    R
                   /\
                  /  \
                 /    \
        P      /      \      T
       /\     /        \    /\
      /  \   /          \  /  \
_____/    \_/            \/    \________
     │    │ │            │ │    │
     │←PR→│ │←──QRS──→│  │ │←ST→│
     │interval│         │    segment│
     │        │←────QT interval────→│
```

| Wave/Interval | Duration | Significance |
|---------------|----------|--------------|
| **P wave** | <0.12s, <2.5mm | Atrial depolarization |
| **PR interval** | 0.12-0.20s | Atrial depol + AV nodal delay |
| **QRS complex** | 0.06-0.10s | Ventricular depolarization |
| **ST segment** | Isoelectric | Early ventricular repolarization |
| **T wave** | Variable | Ventricular repolarization |
| **QT interval** | <0.44s (corrected) | Total ventricular activity |

### 12-Lead ECG System

**Limb Leads (Frontal Plane):**

| Lead | Positive Electrode | View |
|------|-------------------|------|
| I | Left arm | Lateral |
| II | Left leg | Inferior |
| III | Left leg | Inferior |
| aVR | Right arm | Cavity |
| aVL | Left arm | Lateral |
| aVF | Left foot | Inferior |

**Precordial Leads (Horizontal Plane):**

| Lead | Position | View |
|------|----------|------|
| V1 | 4th ICS, right sternal border | Septal |
| V2 | 4th ICS, left sternal border | Septal |
| V3 | Between V2 and V4 | Anterior |
| V4 | 5th ICS, midclavicular line | Anterior |
| V5 | 5th ICS, anterior axillary line | Lateral |
| V6 | 5th ICS, midaxillary line | Lateral |

### Einthoven's Triangle & Axis

```
        aVR (-150°)     aVL (-30°)
              \         /
               \   0°  /  ← Lead I
                \  ↑  /
                 \ | /
                  \|/
         +90° ────●──── -90°
                  |
                  |
                aVF (+90°)
                Lead II (+60°)
                Lead III (+120°)
```

**Normal Axis:** -30° to +90°
- **Left Axis Deviation:** More negative than -30°
- **Right Axis Deviation:** More positive than +90°

**Quick Axis Determination:**
1. Look at Lead I and aVF
2. Both positive = Normal axis
3. Lead I (+), aVF (-) = LAD
4. Lead I (-), aVF (+) = RAD

### Heart Rate Calculation

**Regular Rhythm:**
```
HR = 300 / (# large boxes between R-R)
HR = 1500 / (# small boxes between R-R)
```

**Irregular Rhythm:**
```
HR = # of R waves in 6 seconds × 10
```

| Large Boxes | Heart Rate |
|-------------|------------|
| 1 | 300 |
| 2 | 150 |
| 3 | 100 |
| 4 | 75 |
| 5 | 60 |
| 6 | 50 |

### Systematic ECG Interpretation

**"RATE, RHYTHM, AXIS, INTERVALS, WAVES, ST-T, OVERALL"**

1. **Rate:** Normal 60-100 bpm
2. **Rhythm:** Sinus? Regular? P before every QRS?
3. **Axis:** Normal, LAD, RAD
4. **Intervals:** PR, QRS, QT
5. **Waves:** P (LAE, RAE), QRS (LVH, RVH, Q waves)
6. **ST-T changes:** Elevation, depression, T inversion
7. **Overall:** Compare with previous, clinical correlation

## Clinical Correlations

### Myocardial Infarction

**STEMI Evolution:**
```
Hyperacute T waves → ST elevation → Q waves → T inversion → ST normalizes
(minutes)           (hours)        (hours-days) (days)      (weeks)
```

| Territory | Leads | Artery |
|-----------|-------|--------|
| Anterior | V1-V4 | LAD |
| Lateral | I, aVL, V5-V6 | LCx |
| Inferior | II, III, aVF | RCA (80%) |
| Posterior | V1-V2 (reciprocal) | RCA/LCx |

### Arrhythmias

| Rhythm | ECG Features |
|--------|--------------|
| **Sinus bradycardia** | <60 bpm, normal P-QRS |
| **Sinus tachycardia** | >100 bpm, normal P-QRS |
| **AFib** | Irregularly irregular, no P waves |
| **AFlutter** | Sawtooth pattern, 300 bpm atrial rate |
| **SVT** | Narrow QRS, regular, >150 bpm |
| **VTach** | Wide QRS, regular, >100 bpm |
| **VFib** | Chaotic, no discernible pattern |

### Conduction Blocks

| Block | ECG Finding |
|-------|-------------|
| **1st degree AV** | PR > 0.20s |
| **2nd degree Type I (Wenckebach)** | Progressive PR prolongation, dropped beat |
| **2nd degree Type II** | Constant PR, sudden dropped beat |
| **3rd degree (Complete)** | Complete AV dissociation |
| **LBBB** | Wide QRS >0.12s, RsR' in V5-V6 |
| **RBBB** | Wide QRS >0.12s, rsR' in V1-V2 |

### Electrolyte Abnormalities

| Abnormality | ECG Changes |
|-------------|-------------|
| **Hyperkalemia** | Peaked T → Wide QRS → Sine wave → Asystole |
| **Hypokalemia** | Flat T, U waves, ST depression |
| **Hypercalcemia** | Short QT |
| **Hypocalcemia** | Prolonged QT |
| **Digoxin** | "Scooped" ST, short QT |

## High-Yield for Exams

1. **1 small box** = 0.04 sec = 1 mm (at standard speed/gain)
2. **Normal PR interval:** 0.12-0.20 seconds (3-5 small boxes)
3. **Normal QRS duration:** <0.12 seconds (3 small boxes)
4. **QTc > 0.44s** = Prolonged (risk of Torsades de Pointes)
5. **QTc = QT / √RR** (Bazett's formula)
6. **Lead II** = Best lead to see P waves (atrial activity)
7. **V1** = Best lead to see bundle branch blocks
8. **Hyperkalemia:** Tall peaked T waves → medical emergency
9. **ST elevation + reciprocal depression** = STEMI until proven otherwise
10. **Irregularly irregular + narrow QRS** = Atrial fibrillation

### Memory Aids

**"STEMI locations" - Coronary Anatomy:**
- **Widow maker** = Proximal LAD occlusion (anterior MI)
- **RCA supplies** SA node (60%), AV node (90%), inferior wall

**"Wellens' syndrome":** Biphasic or deeply inverted T in V2-V3 = Critical LAD stenosis (even if pain-free now)

**"De Winter T waves":** ST depression + hyperacute T in precordial leads = LAD occlusion (STEMI equivalent)
