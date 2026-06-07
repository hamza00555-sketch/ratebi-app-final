# راتبي — Context File للمحادثة الجديدة

## معلومات المشروع

**اسم التطبيق:** راتبي — مخطط الراتب الشهري  
**النوع:** PWA (Progressive Web App) — React 18 + Vite  
**اللغة:** عربي RTL  
**الهدف:** تطبيق إدارة مالية شخصية (التزامات، أهداف، بنوك، دخل إضافي)

## Git & Deployment

- **الريبو:** `hamza00555-sketch/ratebi-app-final`
- **الفرع الحالي:** `claude/app-information-PQYRs`
- **Vercel مشروع:** `ratebi-app-final`
- **آخر deployment URL:** `ratebi-app-final-5pzpegp92-hamza00555-3384s-projects.vercel.app`
- **Team ID:** `team_aOu1DR8cZDOiBThGmJRkyOuC`
- **Project ID:** `prj_1gJR8Dkw3ZsdTtGn8xrvE8BlWCqc`
- **عند الـ push:** دائماً `git push -u origin claude/app-information-PQYRs`

## قواعد مهمة جداً

1. **لا تلمس BottomNav.jsx** — المستخدم رفض أي تعديل عليه
2. **لا ترسم أو تعيد إنشاء أي تصميم** — فقط استخدم الأصول (assets) اللي يعطيك إياها المستخدم كما هي
3. **بعد كل تعديل:** ابنِ (`npm run build`) ثم push ثم أعطِ رابط Vercel shareable
4. **الخط:** Mestika للعربي فقط (بدون glyphs للأرقام اللاتينية) → Cairo للأرقام → system fonts fallback
5. **الأرقام:** استخدم `<span className="num">` دائماً لعرض الأرقام (يجبر LTR + Cairo)
6. **الـ PIN:** 4 أرقام، hash بـ SHA-256 + salt `ratebi-secure-salt-2024`
7. **Vercel shareable link:** استخدم MCP tool `get_access_to_vercel_url` بعد كل push

## Tech Stack

```json
{
  "react": "^18.3.1",
  "react-dom": "^18.3.1",
  "vite": "^5.4.2",
  "vite-plugin-pwa": "^1.3.0",
  "idb": "^8.0.3",
  "recharts": "^3.8.1"
}
```

## هيكل المشروع

```
src/
  App.jsx                    — Router الرئيسي
  main.jsx                   — Entry point
  index.css                  — Global styles + CSS variables + SalaryQuest CSS
  sw.js                      — Service Worker (Workbox injectManifest)
  context/
    AppContext.jsx            — State management (React Context)
  db/
    index.js                 — IndexedDB (idb) — قاعدة البيانات المحلية
  utils/
    format.js                — formatAmount, currentMonth, uid, daysUntil...
    calc.js                  — calcGoalProgress, calcCommitmentsTotal...
    notifications.js         — إشعارات، PIN hash، Biometric (WebAuthn)
  components/
    BottomNav.jsx            — ⚠️ لا تلمسه أبداً
    BottomSheet.jsx          — Bottom sheet modal
    CategoryData.js          — COMMITMENT_CATEGORIES, EXPENSE_CATEGORIES, GOAL_CATEGORIES
    CategoryIcons.jsx        — SVG icons للفئات
    DonutChart.jsx           — رسم بياني دائري
    SalaryQuest.jsx          — ✅ جديد — Game layer ليوم الراتب (3 أطوار)
  pages/
    Dashboard.jsx            — الصفحة الرئيسية
    Commitments.jsx          — التزامات (checklist UX)
    Goals.jsx                — الأهداف
    Banks.jsx                — البنوك والحسابات
    Settings.jsx             — الإعدادات (PIN, biometric, import/export)
    Onboarding.jsx           — الإعداد الأولي (3 خطوات)
    SalaryDay.jsx            — شاشة يوم الراتب — يستدعي SalaryQuest
    LockScreen.jsx           — شاشة القفل (PIN + biometric)
    ExtraIncomeSheet.jsx     — شاشة الدخل الإضافي
    SavingsCalc.jsx          — حاسبة الادخار

public/
  icon-192.png               — أيقونة PWA 192x192
  icon-512.png               — أيقونة PWA 512x512
  apple-touch-icon.png       — أيقونة iOS 180x180
  ratebi-demo.json           — ✅ جديد — بيانات ديمو جاهزة للاستيراد (راتب 25,000)
  assets/icons/app-icon.png  — أيقونة التطبيق الرئيسية
  assets/icons/nav-*.png     — أيقونات الـ BottomNav
  assets/icons/illus-*.png   — صور توضيحية للـ Onboarding
  assets/ratebi/             — ✅ جديد — مجلد أصول SalaryQuest (الصور غير موجودة بعد)
    salary-monster-01.png    — وحش الالتزامات (0-24%)
    salary-monster-02.png    — وحش أصغر (25-49%)
    salary-monster-03.png    — وحش متوسط كيوت (50-74%)
    salary-monster-04.png    — كائن لطيف (75-99%)
    salary-buddy-05.png      — مستشار مالي كيوت (100%)
    reward-chest.png         — صندوق المكافأة
  fonts/Mestika-*.otf        — خط Mestika (عربي فقط، بدون أرقام لاتينية)
  fonts/Zanjabeel-*.otf      — خط Zanjabeel (احتياطي)
```

## CSS Variables (index.css)

```css
--bg: #0D0A26        /* خلفية رئيسية */
--bg2: #13103A       /* خلفية ثانوية */
--card: #1A1650      /* بطاقات */
--card2: #201C5E     /* بطاقات ثانوية */
--primary: #6C63FF   /* بنفسجي رئيسي */
--accent: #00C9A7    /* أخضر/تيفاني */
--danger: #FF6B6B    /* أحمر */
--gold: #FFB830      /* ذهبي */
--text: #FFFFFF
--text2: #9B99C8
--text3: #5C5A8A
--border: #2A2660
```

## IndexedDB Schema (ratebi-db v3)

```
settings      { key, value }           — إعدادات المستخدم
commitments   { id, name, amount, category, dayOfMonth, bankId, accountId, paidThisMonth, active, extraIncomeTag }
goals         { id, name, targetAmount, savedAmount, targetDate, category, monthlyContribution, completed, bankId, accountId, extraIncomeTag }
expenses      { id, month, ... }       — مصاريف يومية (index على month)
banks         { id, name, emoji, color, accounts: [{id, name}] }
monthlyRecords { month, salary, commitmentsTotal, goalsTotal, remaining, goalContribs, confirmedAt }
debts         { id, name, totalAmount, paidAmount, paid }
extraIncome   { id, date, amount, source, distribution, debtBreakdown, taggedBreakdown }
```

## AppContext — State & Actions

```js
// State
settings, commitments, goals, banks, monthlyRecords, debts, extraIncome
page, setPage          // 'loading' | 'onboarding' | 'salaryDay' | 'dashboard' | 'commitments' | 'banks' | 'goals' | 'settings'
privacyMode, togglePrivacy
locked, unlock
currentMonthRecord     // monthlyRecords.find(r => r.month === currentMonth())
fmt(n)                 // formatAmount أو '••••' في وضع الخصوصية

// Actions
updateSettings(updates)
addCommitment(data), updateCommitment(item), deleteCommitment(id)
addGoal(data), updateGoal(item), deleteGoal(id), addGoalAmount(id, amount)
addBank(data), updateBank(item), deleteBank(id)
addDebt(data), updateDebt(item), deleteDebt(id)
addExtraIncome(data), deleteExtraIncome(id)
confirmSalaryDay(record)
```

## DEFAULT_SETTINGS

```js
{ salary: 0, salaryDay: 25, currency: 'ريال', onboardingComplete: false }
```

---

## SalaryQuest — مكون يوم الراتب التفاعلي ✅ جديد

**الملف:** `src/components/SalaryQuest.jsx`

مكون game layer يظهر في شاشة `SalaryDay.jsx` فوق الـ flow الحالي.

### الأطوار الثلاثة:

| الطور | الوصف |
|---|---|
| **Hero** | "سيطر على الشهر" + صورة الوحش + الراتب + زر "ابدأ المهمة" |
| **Quest** | الوحش يتحوّل بـ 5 مراحل حسب نسبة الالتزامات المدفوعة + checklist |
| **Summary** | ملخص مالي + حالة الشهر + فقاعة نصح من الـ buddy |

### مراحل الوحش:

```
0-24%   → salary-monster-01.png  → "الالتزامات وصلت"
25-49%  → salary-monster-02.png  → "بدأت السيطرة"
50-74%  → salary-monster-03.png  → "ماشي تمام!"
75-99%  → salary-monster-04.png  → "باقي شوي"
100%    → salary-buddy-05.png    → "تمت السيطرة 🎉"
```

### Props:

```js
<SalaryQuest
  salary={Number}          // الراتب الشهري
  commitments={Array}      // قائمة الالتزامات
  goals={Array}            // قائمة الأهداف
  fmt={Function}           // دالة التنسيق من AppContext
  onStart={Function}       // callback عند الضغط على "ابدأ المهمة"
  onGoSummary={Function}   // callback عند الذهاب للملخص
  onPayCommitment={Function} // updateCommitment من AppContext
/>
```

### ربطه في SalaryDay.jsx:

```jsx
import SalaryQuest from '../components/SalaryQuest.jsx'
// في useApp():
const { ..., updateCommitment, ... } = useApp()
// في الـ JSX:
<SalaryQuest
  salary={Number(salary)}
  commitments={commitments}
  goals={goals}
  fmt={fmt}
  onPayCommitment={updateCommitment}
/>
```

### ملاحظة الأصول:
الصور في `public/assets/ratebi/` غير موجودة بعد — المكون يخفيها تلقائياً عبر `onError`. لرفع الصور: أضفها يدوياً للمجلد ثم push.

---

## بيانات الديمو ✅ جديد

**الملف:** `public/ratebi-demo.json`  
**الاستخدام:** الإعدادات ← ⬇️ استيراد نسخة

```
الراتب:       25,000 ريال (يوم 25)
البنوك:       الأهلي السعودي، الراجحي، بنك الرياض، ساب
الالتزامات:  9 التزامات — إجمالي 8,633 ريال
              (إيجار 4,500 | كامري 1,850 | كهرباء 380 | STC 299 |
               نتفليكس+شاهد 89 | تأمين 300 | نادي 200 | والدين 1,000 | iCloud 15)
الأهداف:     5 أهداف — 7,800 ريال شهري
              (طوارئ 2,000 | حج 800 | باترول 3,000 | أوروبا 1,500 | MacBook 500)
المتبقي:      8,567 ريال
```

---

## أهم التعديلات حسب الجلسة

### جلسة 2026-06-07:
1. **`src/components/SalaryQuest.jsx`** — ملف جديد كامل (game layer ليوم الراتب)
2. **`src/index.css`** — أضيف ~280 سطر CSS لكلاسات `.salary-quest*`
3. **`src/pages/SalaryDay.jsx`** — استدعاء SalaryQuest + إضافة `updateCommitment`
4. **`public/assets/ratebi/`** — مجلد جديد لأصول SalaryQuest (فارغ، ينتظر الصور)
5. **`public/ratebi-demo.json`** — بيانات ديمو جاهزة للعروض التقديمية

### جلسات سابقة:
1. **`src/index.css`** — أضيفت system fonts fallback عشان الإنجليزي يظهر (مثل "SCC")
2. **`src/pages/Commitments.jsx`** — الضغط على البطاقة يغير `paidThisMonth`، زر ✎ بـ `stopPropagation`
3. **`src/pages/Goals.jsx`** — زر "+ إضافة" وزر ✎ أضيف لهم `stopPropagation`
4. **`src/pages/LockScreen.jsx`** — تصميم STC Bank (صناديق PIN مستطيلة، نمباد شفاف)

---

## إرشادات Vercel Deployment

```
1. npm run build
2. git add . && git commit -m "..."
3. git push -u origin claude/app-information-PQYRs
4. انتظر 30-60 ثانية
5. استخدم MCP tool: get_access_to_vercel_url
   على: https://ratebi-app-final-5pzpegp92-hamza00555-3384s-projects.vercel.app
6. الرابط صالح 23 ساعة
```

**Vercel MCP IDs:**
```
Team ID:    team_aOu1DR8cZDOiBThGmJRkyOuC
Project ID: prj_1gJR8Dkw3ZsdTtGn8xrvE8BlWCqc
```
