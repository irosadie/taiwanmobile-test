export function formatCurrency(amount: number) { return `NT$ ${new Intl.NumberFormat("zh-TW", { maximumFractionDigits: 0 }).format(amount)}`; }
