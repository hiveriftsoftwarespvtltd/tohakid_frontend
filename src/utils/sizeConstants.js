import { normalizeSizeKey } from './variantStorage.js';

/**
 * Standard Kids Ethnic Wear Size to Age Mapping
 * Order:
 * Size 14 = 3 to 6 Months
 * Size 16 = 6 to 12 Months
 * Size 18 = 1 to 2 Years
 * Size 20 = 2 to 3 Years
 * Size 22 = 3 to 4 Years
 * Size 24 = 4 to 5 Years
 * Size 26 = 5 to 6 Years
 * Size 28 = 6 to 7 Years
 * Size 30 = 8 to 9 Years
 * Size 32 = 10 to 11 Years
 * Size 34 = 12 to 13 Years
 * Size 36 = 14 to 15 Years
 * Size 38 = 15 to 16 Years
 */

export const STANDARD_YEAR_SIZES = [
  '0-1Y', '1-2Y', '2-3Y', '3-4Y', '4-5Y', '5-6Y', '6-7Y', '7-8Y',
  '8-9Y', '9-10Y', '10-11Y', '11-12Y', '12-13Y', '13-14Y', '14-15Y', '15-16Y',
];

export const STANDARD_TWO_YEAR_SIZES = [
  '0-2Y', '2-4Y', '4-6Y', '6-8Y', '8-10Y', '10-12Y', '12-14Y', '14-16Y',
];

export const ADMIN_YEAR_SIZES = [
  ...STANDARD_YEAR_SIZES,
  ...STANDARD_TWO_YEAR_SIZES,
];

export const STANDARD_NUMERIC_SIZES = [
  '14', '16', '18', '20', '22', '24', '26', '28', '30', '32', '34', '36', '38',
];

export const STANDARD_APPAREL_SIZES = ['S', 'M', 'L', 'XL'];

/**
 * Expands a product's configured sizes to include the full standard chart range
 * so unavailable sizes remain visible (crossed out & unselectable) on the detail page.
 */
export const getFullProductSizeList = (product) => {
  if (!product) return [];
  const rawSizes =
    Array.isArray(product.sizes) && product.sizes.length > 0
      ? product.sizes
      : Array.isArray(product.sizeVariants)
        ? product.sizeVariants.map((v) => v.size)
        : [];

  if (rawSizes.length === 0) return [];

  const exactByNorm = new Map();
  rawSizes.forEach((sz) => {
    const k = normalizeSizeKey(sz);
    if (k && !exactByNorm.has(k)) exactByNorm.set(k, sz);
  });

  const hasSingleYearRange = rawSizes.some((sz) => {
    const m = String(sz).trim().match(/^(\d+)\s*-\s*(\d+)\s*Y$/i);
    return m && Number(m[2]) - Number(m[1]) === 1;
  });

  const twoYearSet = new Set([...STANDARD_TWO_YEAR_SIZES, '9-12Y', '13-16Y'].map(normalizeSizeKey));
  const hasTwoYearRange = rawSizes.some((sz) => twoYearSet.has(normalizeSizeKey(sz)));

  const numericSet = new Set(STANDARD_NUMERIC_SIZES.map(normalizeSizeKey));
  const hasNumericRange = rawSizes.some((sz) => numericSet.has(normalizeSizeKey(sz)));

  const apparelSet = new Set(STANDARD_APPAREL_SIZES.map(normalizeSizeKey));
  const hasApparelRange = rawSizes.some((sz) => apparelSet.has(normalizeSizeKey(sz)));

  let masterList = [];
  if (hasSingleYearRange) {
    masterList = STANDARD_YEAR_SIZES;
  } else if (hasNumericRange) {
    masterList = STANDARD_NUMERIC_SIZES;
  } else if (hasTwoYearRange) {
    const usesLegacyBands = rawSizes.some((sz) => ['9-12y', '13-16y'].includes(normalizeSizeKey(sz)));
    masterList = usesLegacyBands
      ? ['0-2Y', '2-4Y', '4-6Y', '6-8Y', '9-12Y', '13-16Y']
      : STANDARD_TWO_YEAR_SIZES;
  } else if (hasApparelRange) {
    masterList = STANDARD_APPAREL_SIZES;
  }

  const result = [];
  const seen = new Set();

  masterList.forEach((stdSize) => {
    const k = normalizeSizeKey(stdSize);
    if (!seen.has(k)) {
      seen.add(k);
      result.push(exactByNorm.get(k) || stdSize);
    }
  });

  rawSizes.forEach((sz) => {
    const k = normalizeSizeKey(sz);
    if (k && !seen.has(k)) {
      seen.add(k);
      result.push(sz);
    }
  });

  return result;
};

export const SIZE_AGE_MAP = {
  '14': '3 to 6 Months',
  '16': '6 to 12 Months',
  '18': '1 to 2 Years',
  '20': '2 to 3 Years',
  '22': '3 to 4 Years',
  '24': '4 to 5 Years',
  '26': '5 to 6 Years',
  '28': '6 to 7 Years',
  '30': '8 to 9 Years',
  '32': '10 to 11 Years',
  '34': '12 to 13 Years',
  '36': '14 to 15 Years',
  '38': '15 to 16 Years',
};

// Compact badge label (e.g. "3-6M", "1-2Y")
export const SIZE_COMPACT_AGE_MAP = {
  '14': '3-6M',
  '16': '6-12M',
  '18': '1-2Y',
  '20': '2-3Y',
  '22': '3-4Y',
  '24': '4-5Y',
  '26': '5-6Y',
  '28': '6-7Y',
  '30': '8-9Y',
  '32': '10-11Y',
  '34': '12-13Y',
  '36': '14-15Y',
  '38': '15-16Y',
};

/**
 * Returns full age label for a size (e.g. "1 to 2 Years")
 */
export const getSizeAgeLabel = (size) => {
  if (!size) return '';
  const clean = String(size).trim();
  if (SIZE_AGE_MAP[clean]) {
    return SIZE_AGE_MAP[clean];
  }
  const match = clean.match(/^\s*(?:size\s*)?(\d+)\s*$/i);
  if (match && SIZE_AGE_MAP[match[1]]) {
    return SIZE_AGE_MAP[match[1]];
  }
  return '';
};

/**
 * Returns compact badge label for a size (e.g. "1-2Y")
 */
export const getSizeCompactLabel = (size) => {
  if (!size) return '';
  const clean = String(size).trim();
  if (SIZE_COMPACT_AGE_MAP[clean]) {
    return SIZE_COMPACT_AGE_MAP[clean];
  }
  const match = clean.match(/^\s*(?:size\s*)?(\d+)\s*$/i);
  if (match && SIZE_COMPACT_AGE_MAP[match[1]]) {
    return SIZE_COMPACT_AGE_MAP[match[1]];
  }
  return '';
};

// Girls Alia Kurti with Afgani Size Chart Data
export const GIRLS_KURTI_AFGANI_DATA = [
  { size: '14', age: '3 to 6 Months', chest: 20.5, length: 16.5, sleeve: 10.5, pants: 14, waist: 14, hip: 21 },
  { size: '16', age: '6 to 12 Months', chest: 20.5, length: 18, sleeve: 10.5, pants: 16, waist: 15, hip: 23 },
  { size: '18', age: '1 to 2 Years', chest: 21, length: 19.25, sleeve: 11, pants: 18, waist: 16, hip: 25 },
  { size: '20', age: '2 to 3 Years', chest: 22, length: 20.25, sleeve: 11, pants: 20, waist: 17, hip: 26.5 },
  { size: '22', age: '3 to 4 Years', chest: 23, length: 22, sleeve: 11.5, pants: 22, waist: 18, hip: 27 },
  { size: '24', age: '4 to 5 Years', chest: 24, length: 23.5, sleeve: 12, pants: 24, waist: 19, hip: 31 },
  { size: '26', age: '5 to 6 Years', chest: 26, length: 25, sleeve: 12.5, pants: 26, waist: 20, hip: 32 },
  { size: '28', age: '6 to 7 Years', chest: 28, length: 27, sleeve: 13, pants: 28, waist: 21, hip: 32 },
  { size: '30', age: '8 to 9 Years', chest: 30, length: 29, sleeve: 13.5, pants: 30, waist: 22, hip: 34 },
  { size: '32', age: '10 to 11 Years', chest: 32, length: 31, sleeve: 14, pants: 32, waist: 23, hip: 36 },
  { size: '34', age: '12 to 13 Years', chest: 34, length: 33, sleeve: 14.5, pants: 34, waist: 24, hip: 38 },
  { size: '36', age: '14 to 15 Years', chest: 36, length: 35.5, sleeve: 16.5, pants: 36, waist: 25, hip: 40 },
  { size: '38', age: '15 to 16 Years', chest: 38, length: 37.5, sleeve: 17, pants: 38, waist: 26, hip: 42 },
];

// Boys Kurta & Pajama Size Chart Data
export const BOYS_KURTA_PAJAMA_DATA = [
  { size: '14', age: '3 to 6 Months', chest: 20.5, length: 15.5, sleeve: 11, pajama: 15 },
  { size: '16', age: '6 to 12 Months', chest: 20.5, length: 17, sleeve: 12, pajama: 16.5 },
  { size: '18', age: '1 to 2 Years', chest: 21, length: 18.5, sleeve: 13, pajama: 18.5 },
  { size: '20', age: '2 to 3 Years', chest: 22, length: 20, sleeve: 13.5, pajama: 20.5 },
  { size: '22', age: '3 to 4 Years', chest: 23, length: 21.5, sleeve: 14.5, pajama: 22.5 },
  { size: '24', age: '4 to 5 Years', chest: 24, length: 22.5, sleeve: 15, pajama: 24.5 },
  { size: '26', age: '5 to 6 Years', chest: 26, length: 24.5, sleeve: 16, pajama: 26.5 },
  { size: '28', age: '6 to 7 Years', chest: 28, length: 26, sleeve: 17, pajama: 28.5 },
  { size: '30', age: '8 to 9 Years', chest: 30, length: 28, sleeve: 17.5, pajama: 30.5 },
  { size: '32', age: '10 to 11 Years', chest: 32, length: 29.5, sleeve: 18.5, pajama: 32.5 },
  { size: '34', age: '12 to 13 Years', chest: 34, length: 30.5, sleeve: 20, pajama: 34.5 },
  { size: '36', age: '14 to 15 Years', chest: 36, length: 34, sleeve: 21, pajama: 36.5 },
];
