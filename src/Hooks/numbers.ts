export const useNumbers = () => {
  function formatNumber(number?: number) {
    if (!number) return;
    const suffixes = ["", "K", "M", "B", "T"];
    let suffixIndex = 0;

    while (number >= 1000) {
      number /= 1000;
      suffixIndex++;
    }

    return number.toFixed(1).replace(/\.0$/, "") + suffixes[suffixIndex];
  }

  return {
    formatNumber,
  };
};
