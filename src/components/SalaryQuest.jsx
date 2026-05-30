import { useMemo, useState } from 'react'

const monsterStages = [
  {
    max: 24,
    asset: '/assets/ratebi/salary-monster-01.png',
    title: 'الالتزامات وصلت',
    message: 'أنا التزاماتك… لا تحاول تهرب، أنا ساكن في بداية كل شهر.',
  },
  {
    max: 49,
    asset: '/assets/ratebi/salary-monster-02.png',
    title: 'بدأت السيطرة',
    message: 'أوه؟ بدأت تدفع؟ طيب خلينا نشوف آخرتها.',
  },
  {
    max: 74,
    asset: '/assets/ratebi/salary-monster-03.png',
    title: 'ماشي تمام!',
    message: 'واضح إنك ماسك الوضع. كمل بنفس النفس.',
  },
  {
    max: 99,
    asset: '/assets/ratebi/salary-monster-04.png',
    title: 'باقي شوي',
    message: 'باقي شوي وتصير أسطورة الميزانية.',
  },
  {
    max: 100,
    asset: '/assets/ratebi/salary-buddy-05.png',
    title: 'تمت السيطرة',
    message: 'تمت السيطرة. الآن لا تعطي المطاعم وضعية البوس النهائي 😜',
  },
]

function getMonsterStage(percent) {
  return monsterStages.find(stage => percent <= stage.max) || monsterStages[4]
}

export default function SalaryQuest({
  salary = 0,
  commitments = [],
  goals = [],
  fmt,
  onStart,
  onGoSummary,
  onPayCommitment,
}) {
  const [started, setStarted] = useState(false)
  const [showSummary, setShowSummary] = useState(false)

  const activeCommitments = useMemo(
    () => commitments.filter(c => c.active !== false),
    [commitments]
  )
  const paidCommitments = useMemo(
    () => activeCommitments.filter(c => c.paidThisMonth),
    [activeCommitments]
  )
  const paidPercent = activeCommitments.length
    ? Math.round((paidCommitments.length / activeCommitments.length) * 100)
    : 100

  const stage = getMonsterStage(paidPercent)

  const commitmentsTotal = activeCommitments.reduce(
    (sum, item) => sum + Number(item.amount || 0),
    0
  )
  const goalsTotal = goals.reduce(
    (sum, item) => sum + Number(item.monthlyContribution || 0),
    0
  )
  const remaining = Number(salary || 0) - commitmentsTotal - goalsTotal

  const format = typeof fmt === 'function'
    ? fmt
    : (n) => Number(n || 0).toLocaleString('en-US')

  if (!started) {
    return (
      <section className="salary-quest salary-quest-hero anim-fadeup">
        <div className="salary-quest-topline">راتبي</div>
        <h1>سيطر على الشهر</h1>
        <p className="salary-quest-sub">
          الراتب وصل 🎉 حان وقت تنظيمه والسيطرة على شهرك.
        </p>
        <div className="salary-quest-monster-wrap">
          <img
            className="salary-quest-monster salary-quest-monster-large"
            src="/assets/ratebi/salary-monster-01.png"
            alt=""
            onError={(e) => { e.currentTarget.style.display = 'none' }}
          />
        </div>
        <div className="salary-quest-salary-card">
          <span>الراتب الشهري</span>
          <strong>
            <span className="num">{format(salary)}</span> ريال
          </strong>
        </div>
        <button
          className="btn btn-primary salary-quest-btn"
          type="button"
          onClick={() => {
            setStarted(true)
            if (onStart) onStart()
          }}
        >
          ابدأ المهمة
        </button>
      </section>
    )
  }

  if (showSummary) {
    return (
      <section className="salary-quest anim-fadeup">
        <div className="salary-quest-header">
          <div>
            <span className="salary-quest-topline">راتبي</span>
            <h2>ملخص الشهر</h2>
            <p>نظرة سريعة على أدائك المالي.</p>
          </div>
        </div>
        <div className="salary-quest-summary">
          <SummaryRow label="الراتب" value={salary} icon="💳" format={format} />
          <SummaryRow label="الالتزامات" value={-commitmentsTotal} icon="📋" format={format} />
          <SummaryRow label="الادخار" value={-goalsTotal} icon="🎯" format={format} />
          <SummaryRow label="المتبقي" value={remaining} icon="👛" format={format} highlight />
        </div>
        <div className="salary-quest-status">
          <span>حالة الشهر</span>
          <strong>{remaining > 0 ? 'سيد الشهر 👑' : 'الشهر يحتاج ضبط'}</strong>
          <small>{remaining > 0 ? 'سيطرة ممتازة!' : 'راجع المصاريف بهدوء.'}</small>
        </div>
        <div className="salary-quest-advice">
          <img
            src="/assets/ratebi/salary-buddy-05.png"
            alt=""
            onError={(e) => { e.currentTarget.style.display = 'none' }}
          />
          <p>لا تعطي المطاعم وضعية البوس النهائي 😜</p>
        </div>
      </section>
    )
  }

  return (
    <section className="salary-quest anim-fadeup">
      <div className="salary-quest-header">
        <div>
          <span className="salary-quest-topline">راتبي</span>
          <h2>{stage.title}</h2>
          <p>خلّنا نخلص الالتزامات الأساسية ونخفف الضغط عن الوحش.</p>
        </div>
      </div>
      <div className="salary-quest-monster-card">
        <div className="salary-quest-speech">{stage.message}</div>
        <img
          className="salary-quest-monster"
          src={stage.asset}
          alt=""
          onError={(e) => { e.currentTarget.style.display = 'none' }}
        />
        <div className="salary-quest-progress-head">
          <span>تقدم السيطرة</span>
          <strong><span className="num">{paidPercent}</span>%</strong>
        </div>
        <div className="salary-quest-progress">
          <span style={{ width: `${paidPercent}%` }} />
        </div>
      </div>
      <div className="salary-quest-list">
        {activeCommitments.map(item => (
          <button
            key={item.id}
            type="button"
            className={`salary-quest-item ${item.paidThisMonth ? 'is-paid' : ''}`}
            onClick={() => {
              if (onPayCommitment) {
                onPayCommitment({ ...item, paidThisMonth: !item.paidThisMonth })
              }
            }}
          >
            <span className="salary-quest-check">
              {item.paidThisMonth ? '✓' : ''}
            </span>
            <span className="salary-quest-item-name">{item.name}</span>
            <strong>
              <span className="num">{format(item.amount)}</span>
            </strong>
          </button>
        ))}
      </div>
      {paidPercent === 100 ? (
        <div className="salary-quest-reward">
          <img
            src="/assets/ratebi/reward-chest.png"
            alt=""
            onError={(e) => { e.currentTarget.style.display = 'none' }}
          />
          <h3>تمت السيطرة 🎉</h3>
          <p>أحسنت! كل الالتزامات الأساسية تمت بنجاح.</p>
          <div className="salary-quest-badge">
            🛡️ سيطرت على الشهر
          </div>
          <div className="salary-quest-streak">
            <span>🔥</span>
            <div>
              <strong><span className="num">3</span> أشهر متتالية</strong>
              <p>استمر على هذا النمط الرائع!</p>
            </div>
          </div>
          <button
            className="btn btn-primary salary-quest-btn"
            type="button"
            onClick={() => {
              setShowSummary(true)
              if (onGoSummary) onGoSummary()
            }}
          >
            الذهاب إلى الملخص
          </button>
        </div>
      ) : (
        <button
          className="btn btn-primary salary-quest-btn"
          type="button"
          onClick={() => {}}
        >
          استمر 💪
        </button>
      )}
    </section>
  )
}

function SummaryRow({ label, value, icon, format, highlight }) {
  const isNegative = Number(value) < 0
  return (
    <div className={`salary-quest-summary-row ${highlight ? 'is-highlight' : ''}`}>
      <span className="salary-quest-summary-icon">{icon}</span>
      <strong>{label}</strong>
      <em className={isNegative ? 'amount-negative' : highlight ? 'amount-positive' : ''}>
        <span className="num">{format(value)}</span> ريال
      </em>
    </div>
  )
}
