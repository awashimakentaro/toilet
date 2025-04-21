// 予定内容と時間から「うんこ解析」を生成する関数

type PoopAnalysisResult = {
  title: string
  description: string
  emoji: string
  impactLevel: number // 1-5のスケール
}

// ランダムな解析結果を生成する関数
export function generatePoopAnalysis(task: string, startTime?: string, endTime?: string): PoopAnalysisResult {
  // 時間帯に基づく影響
  const timeImpact = getTimeImpact(startTime)

  // タスク内容に基づく影響
  const taskImpact = getTaskImpact(task)

  // 所要時間に基づく影響
  const durationImpact = getDurationImpact(startTime, endTime)

  // 結果を組み合わせて生成
  const impactLevel = Math.min(
    5,
    Math.max(1, Math.round((timeImpact.impact + taskImpact.impact + durationImpact.impact) / 3)),
  )

  // タイトルを生成
  const titles = ["うんこ予報", "排泄影響分析", "うんこ学的考察", "トイレタイム予測", "排便インパクト診断"]

  const title = titles[Math.floor(Math.random() * titles.length)]

  // 説明文を生成
  const description = `${timeImpact.text}${taskImpact.text}${durationImpact.text}${getConclusion(impactLevel)}`

  // 絵文字を選択
  const emoji = getEmojiByImpactLevel(impactLevel)

  return {
    title,
    description,
    emoji,
    impactLevel,
  }
}

// 時間帯に基づく影響を取得
function getTimeImpact(startTime?: string): { text: string; impact: number } {
  if (!startTime) {
    return {
      text: "時間が設定されていないため、排泄リズムへの影響は予測不能です。",
      impact: 3,
    }
  }

  const hour = Number.parseInt(startTime.split(":")[0], 10)

  if (hour >= 5 && hour < 9) {
    return {
      text: "朝の時間帯は腸の活動が活発になる黄金時間です。この予定は朝の排便を促進する効果があります。",
      impact: 5,
    }
  } else if (hour >= 9 && hour < 12) {
    return {
      text: "午前中は消化器系が活発に働く時間帯です。この予定は適度な腸の刺激を与えるでしょう。",
      impact: 4,
    }
  } else if (hour >= 12 && hour < 14) {
    return {
      text: "お昼時は食事の影響で腸が活発になります。この予定は食後の自然な排便を妨げないようにしましょう。",
      impact: 3,
    }
  } else if (hour >= 14 && hour < 18) {
    return {
      text: "午後の時間帯は腸の活動がやや鈍くなります。この予定は水分摂取と組み合わせると良いでしょう。",
      impact: 2,
    }
  } else if (hour >= 18 && hour < 22) {
    return {
      text: "夕方から夜にかけては消化活動が落ち着く時間帯です。この予定は穏やかな腸の動きを促します。",
      impact: 3,
    }
  } else {
    return {
      text: "深夜から早朝は腸が休息モードに入る時間です。この予定は排泄リズムに若干の乱れをもたらす可能性があります。",
      impact: 1,
    }
  }
}

// タスク内容に基づく影響を取得
function getTaskImpact(task: string): { text: string; impact: number } {
  const lowerTask = task.toLowerCase()

  // 運動関連
  if (
    lowerTask.includes("運動") ||
    lowerTask.includes("トレーニング") ||
    lowerTask.includes("ジム") ||
    lowerTask.includes("ウォーキング") ||
    lowerTask.includes("ランニング") ||
    lowerTask.includes("筋トレ")
  ) {
    return {
      text: "運動は腸の蠕動運動を活発にします。この予定は排便を促進し、より健康的なうんこを生み出すでしょう。",
      impact: 5,
    }
  }

  // 食事関連
  if (
    lowerTask.includes("食事") ||
    lowerTask.includes("ランチ") ||
    lowerTask.includes("ディナー") ||
    lowerTask.includes("朝食") ||
    lowerTask.includes("昼食") ||
    lowerTask.includes("夕食") ||
    lowerTask.includes("飲み会") ||
    lowerTask.includes("カフェ")
  ) {
    return {
      text: "食事は消化器系に直接影響します。この予定は食物繊維の摂取次第で、排便の質と量に大きく影響するでしょう。",
      impact: 4,
    }
  }

  // 仕事・会議関連
  if (
    lowerTask.includes("会議") ||
    lowerTask.includes("ミーティング") ||
    lowerTask.includes("仕事") ||
    lowerTask.includes("プレゼン") ||
    lowerTask.includes("打ち合わせ")
  ) {
    return {
      text: "長時間の会議やデスクワークは腸の動きを鈍らせます。この予定中は適度に立ち上がり、腸に刺激を与えることをお勧めします。",
      impact: 2,
    }
  }

  // リラックス関連
  if (
    lowerTask.includes("休憩") ||
    lowerTask.includes("リラックス") ||
    lowerTask.includes("昼寝") ||
    lowerTask.includes("マッサージ") ||
    lowerTask.includes("瞑想") ||
    lowerTask.includes("ヨガ")
  ) {
    return {
      text: "リラックスすることでストレスが軽減され、腸の健康に良い影響を与えます。この予定は穏やかで滑らかな排便を促すでしょう。",
      impact: 4,
    }
  }

  // 勉強・読書関連
  if (
    lowerTask.includes("勉強") ||
    lowerTask.includes("読書") ||
    lowerTask.includes("学習") ||
    lowerTask.includes("研究") ||
    lowerTask.includes("テスト")
  ) {
    return {
      text: "集中して頭を使う活動は、時に腸の動きを忘れがちになります。この予定中も水分摂取を忘れずに。",
      impact: 2,
    }
  }

  // 移動関連
  if (
    lowerTask.includes("移動") ||
    lowerTask.includes("通勤") ||
    lowerTask.includes("通学") ||
    lowerTask.includes("電車") ||
    lowerTask.includes("バス") ||
    lowerTask.includes("車")
  ) {
    return {
      text: "移動中は腸の動きが不規則になりがちです。この予定の前後には、トイレに行く時間を確保しておくと安心です。",
      impact: 3,
    }
  }

  // デフォルト
  return {
    text: "この予定の内容は排泄活動に中程度の影響を与えるでしょう。水分をしっかり摂って、自然な腸の動きを促しましょう。",
    impact: 3,
  }
}

// 所要時間に基づく影響を取得
function getDurationImpact(startTime?: string, endTime?: string): { text: string; impact: number } {
  if (!startTime || !endTime) {
    return {
      text: "予定の所要時間が不明なため、排泄タイミングへの影響は計算できません。",
      impact: 3,
    }
  }

  const start = new Date(`2000-01-01T${startTime}`)
  const end = new Date(`2000-01-01T${endTime}`)
  const durationMinutes = (end.getTime() - start.getTime()) / (1000 * 60)

  if (durationMinutes <= 30) {
    return {
      text: "短時間の予定なので、排泄リズムへの影響は最小限です。前後に余裕を持ってトイレタイムを確保できるでしょう。",
      impact: 4,
    }
  } else if (durationMinutes <= 60) {
    return {
      text: "1時間程度の予定は、ちょうど良い間隔で腸に適度な刺激を与えます。予定後のトイレタイムを意識しておくと良いでしょう。",
      impact: 3,
    }
  } else if (durationMinutes <= 120) {
    return {
      text: "2時間程度の予定は、腸の動きが鈍くなる可能性があります。予定の途中で軽く体を動かすことをお勧めします。",
      impact: 2,
    }
  } else {
    return {
      text: "長時間の予定は腸の動きを抑制する可能性があります。予定中にトイレ休憩を取ることを忘れないようにしましょう。",
      impact: 1,
    }
  }
}

// 影響レベルに基づく結論を取得
function getConclusion(impactLevel: number): string {
  switch (impactLevel) {
    case 1:
      return "総合的に見て、この予定はあなたの排泄リズムに悪影響を及ぼす可能性があります。意識的にトイレ休憩を取りましょう。"
    case 2:
      return "総合的に見て、この予定はあなたの排泄活動をやや抑制するでしょう。水分摂取を心がけてください。"
    case 3:
      return "総合的に見て、この予定はあなたの排泄活動に中立的な影響を与えるでしょう。通常通りの排泄習慣を維持できます。"
    case 4:
      return "総合的に見て、この予定はあなたの排泄活動に良い影響を与えるでしょう。健康的で満足度の高いうんこが期待できます。"
    case 5:
      return "総合的に見て、この予定はあなたの排泄活動を最適化するでしょう。黄金のようなうんこタイムが訪れる予感です！"
    default:
      return "予定の影響は不明です。自分の体調に合わせて排泄リズムを整えましょう。"
  }
}

// 影響レベルに基づく絵文字を取得
function getEmojiByImpactLevel(impactLevel: number): string {
  switch (impactLevel) {
    case 1:
      return "💩😖"
    case 2:
      return "💩😕"
    case 3:
      return "💩😐"
    case 4:
      return "💩😊"
    case 5:
      return "💩🤩"
    default:
      return "💩❓"
  }
}
