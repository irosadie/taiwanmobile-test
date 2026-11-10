export function formatCurrency(amount: number, locale = "zh-TW") { return `NT$ ${new Intl.NumberFormat(locale, { maximumFractionDigits: 0 }).format(amount)}`; }
