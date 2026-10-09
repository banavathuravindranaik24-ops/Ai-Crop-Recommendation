// Agronomic benchmarks per acre for all 23 crops
const CROP_METRICS = {
  chilli: {
    yieldPerAcre: '18 - 25 quintals (dry) / 60 - 80 quintals (green)',
    fertilizerDosePerAcre: '100 - 120 kg NPK (approx 2.5 bags) + Potassium Nitrate',
    seedPerAcre: '1.0 - 1.5 kg seeds',
    waterRequirement: '500 - 600 mm total irrigation'
  },
  rice: {
    yieldPerAcre: '22 - 30 quintals',
    fertilizerDosePerAcre: '120 - 150 kg (approx 3 bags Urea & DAP)',
    seedPerAcre: '15 - 20 kg seeds (transplanting)',
    waterRequirement: '1200 - 1400 mm standing water'
  },
  maize: {
    yieldPerAcre: '25 - 35 quintals',
    fertilizerDosePerAcre: '100 - 120 kg NPK 20-20-0 (approx 2.5 bags)',
    seedPerAcre: '7 - 8 kg seeds',
    waterRequirement: '500 - 600 mm'
  },
  chickpea: {
    yieldPerAcre: '10 - 16 quintals',
    fertilizerDosePerAcre: '50 - 60 kg DAP (approx 1 bag)',
    seedPerAcre: '25 - 30 kg seeds',
    waterRequirement: '300 - 400 mm'
  },
  kidneybeans: {
    yieldPerAcre: '12 - 18 quintals',
    fertilizerDosePerAcre: '60 - 75 kg Compost & NPK (approx 1.5 bags)',
    seedPerAcre: '30 - 35 kg seeds',
    waterRequirement: '400 - 500 mm'
  },
  pigeonpeas: {
    yieldPerAcre: '8 - 14 quintals',
    fertilizerDosePerAcre: '50 - 60 kg NPK (approx 1 bag)',
    seedPerAcre: '6 - 8 kg seeds',
    waterRequirement: '450 - 550 mm'
  },
  mothbeans: {
    yieldPerAcre: '5 - 9 quintals',
    fertilizerDosePerAcre: '30 - 40 kg Organic Manure',
    seedPerAcre: '4 - 6 kg seeds',
    waterRequirement: '250 - 350 mm'
  },
  mungbean: {
    yieldPerAcre: '6 - 10 quintals',
    fertilizerDosePerAcre: '40 - 50 kg DAP / Rhizobium culture',
    seedPerAcre: '8 - 10 kg seeds',
    waterRequirement: '300 - 380 mm'
  },
  blackgram: {
    yieldPerAcre: '6 - 11 quintals',
    fertilizerDosePerAcre: '45 - 55 kg Super Phosphate',
    seedPerAcre: '8 - 10 kg seeds',
    waterRequirement: '350 - 420 mm'
  },
  lentil: {
    yieldPerAcre: '7 - 12 quintals',
    fertilizerDosePerAcre: '40 - 50 kg DAP',
    seedPerAcre: '12 - 15 kg seeds',
    waterRequirement: '250 - 320 mm'
  },
  pomegranate: {
    yieldPerAcre: '4 - 6 tons',
    fertilizerDosePerAcre: '150 - 180 kg Potash & Organic compost',
    seedPerAcre: '280 - 300 saplings',
    waterRequirement: '600 - 700 mm drip irrigation'
  },
  banana: {
    yieldPerAcre: '25 - 35 tons',
    fertilizerDosePerAcre: '220 - 260 kg NPK 10-10-10 (approx 5 bags)',
    seedPerAcre: '1,000 - 1,200 tissue culture plantlets',
    waterRequirement: '1500 - 1800 mm regular drip'
  },
  mango: {
    yieldPerAcre: '3 - 5 tons (mature orchard)',
    fertilizerDosePerAcre: '100 - 150 kg Organic compost & Micronutrients',
    seedPerAcre: '40 - 50 grafted grafts/trees',
    waterRequirement: '700 - 900 mm'
  },
  grapes: {
    yieldPerAcre: '8 - 14 tons',
    fertilizerDosePerAcre: '180 - 220 kg Potash fertilizer (approx 4 bags)',
    seedPerAcre: '800 - 1,000 rooted cuttings',
    waterRequirement: '600 - 800 mm drip irrigation'
  },
  watermelon: {
    yieldPerAcre: '15 - 22 tons',
    fertilizerDosePerAcre: '90 - 110 kg NPK fertilizer (approx 2 bags)',
    seedPerAcre: '1.5 - 2.0 kg hybrid seeds',
    waterRequirement: '400 - 500 mm'
  },
  muskmelon: {
    yieldPerAcre: '10 - 16 tons',
    fertilizerDosePerAcre: '80 - 100 kg Compost manure & NPK',
    seedPerAcre: '1.0 - 1.5 kg seeds',
    waterRequirement: '350 - 450 mm'
  },
  apple: {
    yieldPerAcre: '6 - 10 tons (high density)',
    fertilizerDosePerAcre: '120 - 160 kg Nitrogen fertilizer & Boron',
    seedPerAcre: '200 - 400 rootstock plants',
    waterRequirement: '800 - 1000 mm'
  },
  orange: {
    yieldPerAcre: '8 - 12 tons',
    fertilizerDosePerAcre: '140 - 170 kg NPK fertilizer',
    seedPerAcre: '180 - 220 budded trees',
    waterRequirement: '900 - 1100 mm'
  },
  papaya: {
    yieldPerAcre: '25 - 40 tons',
    fertilizerDosePerAcre: '150 - 200 kg Compost & Ammonium Phosphate',
    seedPerAcre: '900 - 1,000 seedlings',
    waterRequirement: '1000 - 1200 mm'
  },
  coconut: {
    yieldPerAcre: '5,000 - 7,000 nuts per year',
    fertilizerDosePerAcre: '120 - 160 kg Potassium fertilizer',
    seedPerAcre: '60 - 70 seedlings',
    waterRequirement: '1200 - 1500 mm'
  },
  cotton: {
    yieldPerAcre: '12 - 18 quintals',
    fertilizerDosePerAcre: '100 - 130 kg NPK 30-10-10 (approx 2.5 bags)',
    seedPerAcre: '1.5 - 2.0 kg Bt Cotton packets',
    waterRequirement: '600 - 750 mm'
  },
  jute: {
    yieldPerAcre: '14 - 20 quintals fiber',
    fertilizerDosePerAcre: '90 - 110 kg Nitrogen fertilizer (approx 2 bags)',
    seedPerAcre: '3 - 4 kg seeds',
    waterRequirement: '1000 - 1200 mm'
  },
  coffee: {
    yieldPerAcre: '700 - 1,000 kg cured beans',
    fertilizerDosePerAcre: '130 - 170 kg Organic compost & NPK',
    seedPerAcre: '450 - 550 plants',
    waterRequirement: '1200 - 1600 mm'
  }
};

function scaleRangeText(text, multiplier) {
  if (!text || multiplier === 1) return text;
  return text
    .replace(/(\d+(?:,\d+)?(?:\.\d+)?)\s*-\s*(\d+(?:,\d+)?(?:\.\d+)?)/g, (match, minStr, maxStr) => {
      const min = parseFloat(minStr.replace(/,/g, ''));
      const max = parseFloat(maxStr.replace(/,/g, ''));
      if (isNaN(min) || isNaN(max)) return match;
      const scaledMin = (min * multiplier).toFixed(1).replace(/\.0$/, '');
      const scaledMax = (max * multiplier).toFixed(1).replace(/\.0$/, '');
      return `${scaledMin} - ${scaledMax}`;
    })
    .replace(/(approx\s*)(\d+(?:\.\d+)?)\s*(bags?)/gi, (match, prefix, bagsStr, suffix) => {
      const bags = parseFloat(bagsStr);
      if (isNaN(bags)) return match;
      const scaledBags = (bags * multiplier).toFixed(1).replace(/\.0$/, '');
      return `${prefix}${scaledBags} ${suffix}`;
    });
}

function calculateAreaMetrics(cropName, areaInput = 1, unit = 'acres') {
  const crop = (cropName || '').toLowerCase().trim();
  const benchmark = CROP_METRICS[crop] || {
    yieldPerAcre: 'Standard commercial harvest',
    fertilizerDosePerAcre: '100 kg standard NPK formulation',
    seedPerAcre: 'Standard regional seed rate',
    waterRequirement: '500 - 700 mm'
  };

  const rawArea = parseFloat(areaInput) > 0 ? parseFloat(areaInput) : 1;
  const isHectare = (unit || '').toLowerCase().includes('hectare');
  const acres = isHectare ? rawArea * 2.47105 : rawArea;
  const multiplier = Number(acres.toFixed(2));
  const unitLabel = isHectare ? `${rawArea} hectare(s)` : `${rawArea} acre(s)`;

  const scaledYield = scaleRangeText(benchmark.yieldPerAcre, multiplier);
  const scaledFert = scaleRangeText(benchmark.fertilizerDosePerAcre, multiplier);
  const scaledSeed = scaleRangeText(benchmark.seedPerAcre, multiplier);

  return {
    area: rawArea,
    areaUnit: isHectare ? 'hectares' : 'acres',
    normalizedAcres: multiplier,
    areaLabel: unitLabel,
    yieldEstimate: multiplier === 1 ? benchmark.yieldPerAcre : `${scaledYield} (for ${unitLabel})`,
    fertilizerDose: multiplier === 1 ? benchmark.fertilizerDosePerAcre : `${scaledFert} (for ${unitLabel})`,
    fertilizerQuantity: multiplier === 1 ? benchmark.fertilizerDosePerAcre : `${scaledFert} (for ${unitLabel})`,
    seedRequirement: multiplier === 1 ? benchmark.seedPerAcre : `${scaledSeed} (for ${unitLabel})`,
    waterRequirement: benchmark.waterRequirement
  };
}

module.exports = {
  CROP_METRICS,
  calculateAreaMetrics
};
