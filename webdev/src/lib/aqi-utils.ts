export function calculatePollutionScore(o3: number, no2: number) {
  // CPCB Breakpoints (approximate/simplified for scoring)
  // NO2 (24h): 0-40 (Good), 41-80 (Sat), 81-180 (Mod), 181-280 (Poor), 281-400 (Very Poor), >400 (Severe)
  // O3 (8h): 0-50 (Good), 51-100 (Sat), 101-168 (Mod), 169-208 (Poor), 209-748 (Very Poor), >748 (Severe)

  // We need to map these to a unified "Score" and "Category"
  // Let's use a simple max-sub-index method like AQI.

  // Helper to get sub-index
  const getSubIndex = (val: number, breakpoints: number[]) => {
    // breakpoints: [Good, Sat, Mod, Poor, Very Poor, Severe]
    // e.g. [40, 80, 180, 280, 400]
    if (val <= breakpoints[0]) return { idx: 0, cat: "Good" };
    if (val <= breakpoints[1]) return { idx: 1, cat: "Satisfactory" };
    if (val <= breakpoints[2]) return { idx: 2, cat: "Moderate" };
    if (val <= breakpoints[3]) return { idx: 3, cat: "Poor" };
    if (val <= breakpoints[4]) return { idx: 4, cat: "Very Poor" };
    return { idx: 5, cat: "Severe" };
  };

  const no2Status = getSubIndex(no2, [40, 80, 180, 280, 400]);
  const o3Status = getSubIndex(o3, [50, 100, 168, 208, 748]);

  // Determine dominant pollutant
  let dominant = "NO2";
  let maxIdx = no2Status.idx;
  let category = no2Status.cat;

  if (o3Status.idx > maxIdx) {
    dominant = "O3";
    maxIdx = o3Status.idx;
    category = o3Status.cat;
  } else if (o3Status.idx === maxIdx) {
    // Tie-breaking or just pick one. Let's say O3 is more critical if equal index?
    // Or just keep NO2.
    if (o3 > no2) dominant = "O3"; // Very rough tie break
  }

  // Map to Low/High/Severe as requested
  // Low: Good, Satisfactory
  // High: Moderate, Poor
  // Severe: Very Poor, Severe
  let simplifiedCategory = "Low";
  if (maxIdx >= 4) simplifiedCategory = "Severe";
  else if (maxIdx >= 2) simplifiedCategory = "High";

  return {
    score: Math.max(no2, o3), // Raw max concentration as a simple score, or we could calculate actual AQI
    category: simplifiedCategory, // Low, High, Severe
    fullCategory: category, // Good, Satisfactory, etc.
    dominantPollutant: dominant,
    details: {
      NO2: { val: no2, cat: no2Status.cat },
      O3: { val: o3, cat: o3Status.cat },
    },
  };
}
