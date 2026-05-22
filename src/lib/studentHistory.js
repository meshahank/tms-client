export function getHistoryWindow(history = [], months = 12) {
  if (months >= 12) return history

  const cutoff = new Date()
  cutoff.setMonth(cutoff.getMonth() - months)
  return history.filter((entry) => new Date(entry.date) >= cutoff)
}

export function buildHistoryRows(history = []) {
  return history.map((entry) => {
    const counts = entry.items.reduce(
      (acc, item) => {
        if (item.name === 'Coffee') acc.coffee += 1
        if (item.name === 'Tea') acc.tea += 1
        if (item.name === 'Snack' && item.price === 5) acc.snack5 += 1
        if (item.name === 'Snack' && item.price === 10) acc.snack10 += 1
        if (item.name === 'Snack' && item.price === 15) acc.snack15 += 1
        return acc
      },
      { coffee: 0, tea: 0, snack5: 0, snack10: 0, snack15: 0 },
    )

    return {
      id: entry._id ?? entry.date,
      date: entry.date,
      total: entry.total,
      ...counts,
    }
  })
}
