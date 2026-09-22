import { useShop } from '../context/ShopContext';
import { formatImageUrl } from './imageUtils';

export const usePageBanner = (placementSlot, defaultTitle, defaultSubtitle, defaultImage, defaultLink = '/collections', defaultMobileImage = null) => {
  const { banners } = useShop();

  const cleanTarget = (placementSlot || '').replace(/^\d+\.\s*/, '').trim().toLowerCase();

  const matchedBanner = (banners || []).find((b) => {
    if (!b || b.status === 'Inactive' || b.isActive === false) return false;
    const bPlacement = (b.placement || '').replace(/^\d+\.\s*/, '').trim().toLowerCase();
    return bPlacement === cleanTarget || (bPlacement && cleanTarget && bPlacement.includes(cleanTarget));
  });

  if (matchedBanner) {
    const rawImage = matchedBanner.imageUrl || matchedBanner.image;
    const isPlaceholder = !rawImage || rawImage.includes('unsplash') || rawImage.includes('photo-1622290291468');
    const finalImage = isPlaceholder ? defaultImage : (formatImageUrl(rawImage) || defaultImage);

    const rawMobile = matchedBanner.mobileImageUrl || matchedBanner.mobileImage;
    const finalMobileImage = rawMobile ? formatImageUrl(rawMobile) : defaultMobileImage;

    return {
      title: matchedBanner.title || defaultTitle,
      subtitle: matchedBanner.subtitle || defaultSubtitle,
      description: matchedBanner.description || 'Explore the latest festive additions for boys and girls.',
      btnPrimaryText: matchedBanner.btnPrimaryText || 'SHOP GIRLS',
      btnPrimaryLink: matchedBanner.btnPrimaryLink || matchedBanner.link || defaultLink,
      btnSecondaryText: matchedBanner.btnSecondaryText || 'SHOP BOYS',
      btnSecondaryLink: matchedBanner.btnSecondaryLink || '/boys',
      image: finalImage,
      mobileImage: finalMobileImage,
      link: matchedBanner.link || defaultLink,
      additionalImages: matchedBanner.additionalImages || [],
      hasCustomBanner: true
    };
  }

  return {
    title: defaultTitle,
    subtitle: defaultSubtitle,
    description: 'Explore the latest festive additions for boys and girls.',
    btnPrimaryText: 'SHOP GIRLS',
    btnPrimaryLink: defaultLink,
    btnSecondaryText: 'SHOP BOYS',
    btnSecondaryLink: '/boys',
    image: defaultImage,
    mobileImage: defaultMobileImage,
    link: defaultLink,
    hasCustomBanner: false
  };
};
