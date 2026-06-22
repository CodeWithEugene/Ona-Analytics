export function calcOccupancy(data: any[]) {
  if (!Array.isArray(data) || data.length === 0) return null
  const last = data[data.length - 1]
  if (!last) return null
  
  if (last.actual_value !== null && last.actual_value !== undefined) {
    const val = typeof last.actual_value === "number" ? last.actual_value : parseFloat(last.actual_value)
    if (!isNaN(val)) return val
  }
  
  if (last.predicted_value !== null && last.predicted_value !== undefined) {
    const val = typeof last.predicted_value === "number" ? last.predicted_value : parseFloat(last.predicted_value)
    if (!isNaN(val)) return Math.round(val)
  }
  
  return 0
}

export function calcForecastPeak(data: any[]) {
  if (!Array.isArray(data) || data.length === 0) return null
  const peaks = data.map(d => {
    if (!d) return 0
    const rawVal = d.predicted_value ?? d.actual_value ?? 0
    const val = typeof rawVal === "number" ? rawVal : parseFloat(rawVal)
    return isNaN(val) ? 0 : val
  })
  if (peaks.length === 0) return 0
  return Math.round(Math.max(...peaks))
}

export function calcChange(data: any[]) {
  if (!Array.isArray(data) || data.length < 14) return null
  const recent = data.slice(-7)
  const old = data.slice(-14, -7)
  if (recent.length === 0 || old.length === 0) return null
  
  const sumRecent = recent.reduce((s, d) => {
    if (!d) return s
    const rawVal = d.actual_value ?? d.predicted_value ?? 0
    const val = typeof rawVal === "number" ? rawVal : parseFloat(rawVal)
    return s + (isNaN(val) ? 0 : val)
  }, 0)
  const avgRecent = sumRecent / recent.length

  const sumOld = old.reduce((s, d) => {
    if (!d) return s
    const rawVal = d.actual_value ?? d.predicted_value ?? 0
    const val = typeof rawVal === "number" ? rawVal : parseFloat(rawVal)
    return s + (isNaN(val) ? 0 : val)
  }, 0)
  const avgOld = sumOld / old.length

  if (isNaN(avgRecent) || isNaN(avgOld)) return 0
  if (avgOld === 0) return avgRecent > 0 ? 100 : 0
  const result = ((avgRecent - avgOld) / avgOld) * 100
  return isNaN(result) ? 0 : Math.round(result)
}

