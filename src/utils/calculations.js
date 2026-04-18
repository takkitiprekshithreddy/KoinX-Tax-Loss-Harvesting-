// Round a value to 2 decimal places to eliminate floating-point noise (e.g. 3.469e-17)
const round2 = (value) => Number(value.toFixed(2));

// Calculates Net and Realised Gains for Pre-Harvesting
export const calculatePreHarvesting = (gainsData) => {
  const stcgNet = gainsData.stcg.profits - gainsData.stcg.losses; // Net = profits - losses
  const ltcgNet = gainsData.ltcg.profits - gainsData.ltcg.losses; // Net = profits - losses

  return {
    stcgNet,
    ltcgNet,
    realisedGains: round2(stcgNet + ltcgNet), // Realised Capital Gains = Sum of both net gains
  };
};

// Calculates Updated Gains for Post-Harvesting based on selected holdings.
// NOTE: selectedHoldings must come from the original, unsorted data — never from a sorted display array.
export const calculatePostHarvesting = (baseGains, selectedHoldings) => {
  let updatedStcgProfits = baseGains.stcg.profits;
  let updatedStcgLosses = baseGains.stcg.losses;
  let updatedLtcgProfits = baseGains.ltcg.profits;
  let updatedLtcgLosses = baseGains.ltcg.losses;

  selectedHoldings.forEach((asset) => {
    // Round gains before accumulating to prevent floating-point noise from microscopic holdings
    const stcgGain = round2(asset.stcg.gain);
    const ltcgGain = round2(asset.ltcg.gain);

    // Short Term Calculations
    if (stcgGain > 0) {
      updatedStcgProfits += stcgGain; // If gain > 0, add it to profits
    } else if (stcgGain < 0) {
      updatedStcgLosses += Math.abs(stcgGain); // If gain < 0, add absolute value to losses
    }

    // Long Term Calculations
    if (ltcgGain > 0) {
      updatedLtcgProfits += ltcgGain;
    } else if (ltcgGain < 0) {
      updatedLtcgLosses += Math.abs(ltcgGain);
    }
  });

  const stcgNet = updatedStcgProfits - updatedStcgLosses;
  const ltcgNet = updatedLtcgProfits - updatedLtcgLosses;
  const effectiveGains = round2(stcgNet + ltcgNet);

  return {
    profits: { stcg: updatedStcgProfits, ltcg: updatedLtcgProfits },
    losses: { stcg: updatedStcgLosses, ltcg: updatedLtcgLosses },
    netGains: { stcg: stcgNet, ltcg: ltcgNet },
    effectiveGains,
  };
};