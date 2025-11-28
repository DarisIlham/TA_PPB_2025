// src/utils/goalUtils.js

export const calculateProgress = (start, current, target, type) => {
  const startVal = parseFloat(start || 0);
  const currentVal = parseFloat(current || 0);
  const targetVal = parseFloat(target || 0);

  let percentage = 0;

  if (type === 'descending') {
    // Logika Weight Loss/Hutang (Makin kecil makin baik)
    const totalToLose = startVal - targetVal;
    const lostSoFar = startVal - currentVal;
    
    if (totalToLose <= 0) return 100; // Prevent error divide by zero
    
    percentage = (lostSoFar / totalToLose) * 100;
  } else {
    // Logika Saving/Otot (Makin besar makin baik)
    const totalToGain = targetVal - startVal;
    const gainedSoFar = currentVal - startVal;
    
    if (startVal === 0 && targetVal > 0) {
        percentage = (currentVal / targetVal) * 100;
    } else if (totalToGain > 0) {
        percentage = (gainedSoFar / totalToGain) * 100;
    }
  }

  // Pastikan hasil di antara 0 - 100
  return Math.min(100, Math.max(0, percentage));
};