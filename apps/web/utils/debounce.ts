export function debounce<Args extends unknown[]>(callback: (...args: Args) => void, delay: number) {
  let timer: ReturnType<typeof setTimeout> | undefined;
  const debounced = (...args: Args) => { clearTimeout(timer); timer = setTimeout(() => callback(...args), delay); };
  debounced.cancel = () => clearTimeout(timer);
  return debounced;
}
