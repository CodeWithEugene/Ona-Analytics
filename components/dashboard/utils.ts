export function calcOccupancy(data: any[]) {
  if (!data || data.length === 0) return null
  const last = data[data.length - 1]
  return last.actual_value !== null ? Math.round(last.actual_value) : Math.round(last.predicted_value)
}

export function calcForecastPeak(data: any[]) {
  if (!data || data.length === 0) return null
  const peaks = data.map(d => d.predicted_value || d.actual_value || 0)
  return Math.round(Math.max(...peaks))
}

export function calcChange(data: any[]) {
  if (!data || data.length < 14) return null
  const recent = data.slice(-7)
  const old = data.slice(-14, -7)
  if (old.length === 0) return null
  const avgRecent = recent.reduce((s, d) => s + (d.actual_value || d.predicted_value || 0), 0) / recent.length
  const avgOld = old.reduce((s, d) => s + (d.actual_value || d.predicted_value || 0), 0) / old.length
  return Math.round(((avgRecent - avgOld) / avgOld) * 100)
}
