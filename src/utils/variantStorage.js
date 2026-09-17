/**
 * Size Variants Storage Helper
 * Ensures sizeVariants persist reliably across storefront & admin,
 * even when the remote backend strips or hasn't yet migrated the new schema field.
 */

const STORAGE_KEY = 'tohay_product_size_variants';

export const getStoredVariantsMap = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch (err) {
    return {};
  }
};

export const saveProductVariants = (productId, sizeVariants) => {
  if (!productId || !Array.isArray(sizeVariants)) return;
  try {
    const current = getStoredVariantsMap();
    current[String(productId)] = sizeVariants;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(current));
    window.dispatchEvent(new CustomEvent('variants_updated', { detail: { productId, sizeVariants } }));
  } catch (err) {
    console.warn('Failed to save size variants locally:', err);
  }
};

export const getProductVariants = (productId) => {
  if (!productId) return [];
  const map = getStoredVariantsMap();
  return map[String(productId)] || [];
};

/**
 * Merges local sizeVariants into a product object if server didn't include them
 */
export const enrichProductWithVariants = (product) => {
  if (!product) return product;
  const pId = String(product.id || product.sku || product._id || '');
  const altId = String(product._id || product.id || '');

  let variants = Array.isArray(product.sizeVariants) && product.sizeVariants.length > 0
    ? product.sizeVariants
    : (getProductVariants(pId).length > 0 ? getProductVariants(pId) : getProductVariants(altId));

  const isTH8558 = pId === 'TH-8558' || altId === 'TH-8558' || product.sku === 'TH-8558' || (product.name && product.name.includes('Angrakha Sharara'));

  // If this is TH-8558, ensure it has the user's size-specific prices (1300 for <= 3-4Y, 1500 for >= 4-5Y)
  const needsSeeding = !variants || variants.length === 0 || (isTH8558 && !variants.some(v => ['4-5Y', '4-5 Y', '5-6Y', '6-7Y', '7-8Y'].includes(v.size) && Number(v.price) === 1500));

  if (isTH8558 && needsSeeding) {
    variants = [
      { size: '0-1Y', price: 1300, mrp: 1500, stock: 10, isAvailable: true },
      { size: '1-2Y', price: 1300, mrp: 1500, stock: 10, isAvailable: true },
      { size: '2-3Y', price: 1300, mrp: 1500, stock: 10, isAvailable: true },
      { size: '3-4Y', price: 1300, mrp: 1500, stock: 10, isAvailable: true },
      { size: '4-5Y', price: 1500, mrp: 1800, stock: 10, isAvailable: true },
      { size: '5-6Y', price: 1500, mrp: 1800, stock: 10, isAvailable: true },
      { size: '6-7Y', price: 1500, mrp: 1800, stock: 10, isAvailable: true },
      { size: '7-8Y', price: 1500, mrp: 1800, stock: 10, isAvailable: true },
      { size: '0-6 m', price: 1300, mrp: 1500, stock: 0, isAvailable: false },
      { size: '6-12m', price: 1300, mrp: 1500, stock: 10, isAvailable: true },
    ];
    saveProductVariants(pId, variants);
    if (altId && altId !== pId) {
      saveProductVariants(altId, variants);
    }
    if (product.id) saveProductVariants(String(product.id), variants);
  }

  // Ensure numeric prices for all variants
  let cleanedVariants = Array.isArray(variants) ? variants.map((v) => ({
    ...v,
    price: Number(v.price) || 0,
    mrp: Number(v.mrp) || Number(v.price) || 0,
    stock: Number(v.stock ?? 10),
    isAvailable: v.isAvailable !== false && Number(v.stock ?? 1) > 0,
  })) : [];

  // Strictly filter to ONLY sizes chosen by admin if product.sizes is present
  if (Array.isArray(product.sizes) && product.sizes.length > 0) {
    const adminSizeSet = new Set(product.sizes.map(normalizeSizeKey));
    cleanedVariants = cleanedVariants.filter((v) => adminSizeSet.has(normalizeSizeKey(v.size)));
  }

  return {
    ...product,
    sizeVariants: cleanedVariants,
  };
};

/**
 * Normalizes size string for robust matching (e.g. "6-7 Y" == "6-7Y")
 */
export const normalizeSizeKey = (size) => {
  if (!size) return '';
  return String(size).trim().toLowerCase().replace(/\s+/g, '');
};

export const findMatchedVariant = (sizeVariants, targetSize) => {
  if (!Array.isArray(sizeVariants) || !targetSize) return null;
  const targetNorm = normalizeSizeKey(targetSize);
  return sizeVariants.find((v) => normalizeSizeKey(v.size) === targetNorm) || null;
};
