// Pincode lookup service for India Post API with in-memory & session caching

const pincodeCache = new Map();

export const lookupPincode = async (pincode) => {
  const cleanPin = String(pincode || '').trim();
  if (cleanPin.length !== 6 || !/^\d{6}$/.test(cleanPin)) {
    return { success: false, message: 'Please enter a valid 6-digit PIN code' };
  }

  // Check in-memory cache
  if (pincodeCache.has(cleanPin)) {
    return pincodeCache.get(cleanPin);
  }

  // Check sessionStorage cache
  try {
    const cached = sessionStorage.getItem(`tohay_pin_${cleanPin}`);
    if (cached) {
      const parsed = JSON.parse(cached);
      pincodeCache.set(cleanPin, parsed);
      return parsed;
    }
  } catch (e) {}

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 4000); // 4s timeout

    const res = await fetch(`https://api.postalpincode.in/pincode/${cleanPin}`, {
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    if (!res.ok) {
      throw new Error('Pincode service unreachable');
    }

    const data = await res.json();
    if (!Array.isArray(data) || !data[0] || data[0].Status !== 'Success' || !Array.isArray(data[0].PostOffice)) {
      const failResult = {
        success: false,
        message: 'Invalid PIN code. Please verify your 6-digit code.',
      };
      return failResult;
    }

    const postOffices = data[0].PostOffice;
    const firstPo = postOffices[0];

    const city = firstPo.District || firstPo.Division || firstPo.Circle || '';
    const state = firstPo.State || '';

    // Extract unique locality names
    const localitiesSet = new Set();
    postOffices.forEach((po) => {
      if (po.Name && typeof po.Name === 'string') {
        const cleanName = po.Name.replace(/\s*\(.*?\)\s*/g, '').trim();
        if (cleanName) localitiesSet.add(cleanName);
      }
    });

    const localities = Array.from(localitiesSet);

    const result = {
      success: true,
      city: city.trim(),
      state: state.trim(),
      localities: localities,
      message: `Verified: ${city}, ${state}`,
    };

    // Cache results
    pincodeCache.set(cleanPin, result);
    try {
      sessionStorage.setItem(`tohay_pin_${cleanPin}`, JSON.stringify(result));
    } catch (e) {}

    return result;
  } catch (err) {
    console.warn('Pincode auto-lookup fallback:', err);
    return {
      success: false,
      isNetworkError: true,
      message: 'Could not auto-verify PIN. Please enter City & State manually.',
    };
  }
};
