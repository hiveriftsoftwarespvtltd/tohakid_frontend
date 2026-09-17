/**
 * Unified Filter Utilities for Tohay Kids E-Commerce Storefront
 */

/**
 * Flexible Category Matching for Storefront Pages
 */
export const isCategoryMatch = (expectedCategory, productCategory) => {
  if (!expectedCategory || !productCategory) return false;
  const exp = String(expectedCategory).toLowerCase().trim();
  const prod = String(productCategory).toLowerCase().trim();

  if (exp === prod) return true;

  if (exp === 'girls' || exp.includes('girl')) {
    return prod.includes('girl');
  }
  if (exp === 'boys' || exp.includes('boy')) {
    return prod.includes('boy');
  }
  if (exp === 'siblings' || exp.includes('sibling')) {
    return prod.includes('sibling');
  }
  if (exp === 'infants' || exp.includes('infant') || exp.includes('baby')) {
    return prod.includes('infant') || prod.includes('baby');
  }

  return prod.includes(exp) || exp.includes(prod);
};

/**
 * Matches a filter subcategory against product subcategory and name
 */
export const isSubcategoryMatch = (filterSubcat, prodSubcat, prodName = '') => {

  if (!filterSubcat) return false;
  const f = String(filterSubcat).toLowerCase().trim();
  const pSub = String(prodSubcat || '').toLowerCase().trim();
  const pName = String(prodName || '').toLowerCase().trim();

  if (!pSub && !pName) return false;

  // Direct exact match
  if (pSub === f) return true;

  // Strict keyword matching rules
  if (f.includes('dhoti')) {
    return pSub.includes('dhoti') || pName.includes('dhoti');
  }

  if (f.includes('nehru')) {
    return pSub.includes('nehru') || pSub.includes('jacket') || pName.includes('nehru') || pName.includes('jacket');
  }

  if (f.includes('sherwani')) {
    return pSub.includes('sherwani') || pName.includes('sherwani');
  }

  if (f.includes('indo')) {
    return pSub.includes('indo') || pName.includes('indo');
  }

  if (f.includes('lehenga')) {
    return pSub.includes('lehenga') || pName.includes('lehenga');
  }

  if (f.includes('gown') || f.includes('dress')) {
    return pSub.includes('gown') || pSub.includes('dress') || pName.includes('gown') || pName.includes('dress');
  }

  if (f.includes('sharara')) {
    return pSub.includes('sharara') || pName.includes('sharara');
  }

  if (f.includes('anarkali')) {
    return pSub.includes('anarkali') || pName.includes('anarkali');
  }

  if (f.includes('kurta') || f.includes('kurti')) {
    if (pSub.includes('dhoti') && !f.includes('dhoti')) return false;
    return pSub.includes('kurta') || pSub.includes('kurti') || pName.includes('kurta') || pName.includes('kurti');
  }

  if (f.includes('brother') && f.includes('sister')) {
    return pSub.includes('brother & sister') || pName.includes('brother & sister');
  }
  if (f.includes('sister') && f.includes('sister')) {
    return pSub.includes('sister & sister') || pName.includes('sister & sister');
  }
  if (f.includes('brother') && f.includes('brother')) {
    return pSub.includes('brother & brother') || pName.includes('brother & brother');
  }

  return pSub.includes(f) || f.includes(pSub) || pName.includes(f);
};

/**
 * Matches an age range filter against product age range and sizes
 */
export const isAgeMatch = (ageVal, prodAgeRange, prodSizes = [], prodAgeGroup = '') => {
  if (!ageVal) return true;
  if (prodAgeRange === ageVal || prodAgeGroup === ageVal) return true;

  if (Array.isArray(prodSizes)) {
    if (ageVal === '0-8' && prodSizes.some((s) => /0|1|2|3|4|5|6|7|8/.test(s))) return true;
    if (ageVal === '9-12' && prodSizes.some((s) => /9|10|11|12|7-8/.test(s))) return true;
    if (ageVal === '13-16' && prodSizes.some((s) => /13|14|15|16/.test(s))) return true;
  }
  return false;
};

/**
 * Matches color filter against product colors array
 */
export const isColorMatch = (selectedColors = [], prodColors = []) => {
  if (!selectedColors || selectedColors.length === 0) return true;
  if (!prodColors || prodColors.length === 0) return false;

  return prodColors.some((c) => {
    const colorName = typeof c === 'string' ? c : c?.name || '';
    return selectedColors.some(
      (sel) => sel.toLowerCase() === colorName.toLowerCase() || colorName.toLowerCase().includes(sel.toLowerCase()) || sel.toLowerCase().includes(colorName.toLowerCase())
    );
  });
};
