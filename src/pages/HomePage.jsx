import React from 'react';
import HeroCarouselSection from '../components/home/HeroCarouselSection';
import GenderCategoriesSection from '../components/home/GenderCategoriesSection';
import ShopByAgeSection from '../components/home/ShopByAgeSection';
import BestsellersSection from '../components/home/BestsellersSection';
import OccasionsSection from '../components/home/OccasionsSection';
import TrendingCategoriesSection from '../components/home/TrendingCategoriesSection';
import NewArrivalsSection from '../components/home/NewArrivalsSection';
import DealOfTheDay from '../components/DealOfTheDay';
import CelebrationEditSection from '../components/home/CelebrationEditSection';
import TrustBadgesSection from '../components/home/TrustBadgesSection';
import ParentReviewsSection from '../components/home/ParentReviewsSection';
import InstagramNewsletterSection from '../components/home/InstagramNewsletterSection';
import FaqsAndCouponSection from '../components/home/FaqsAndCouponSection';

export default function HomePage() {
  return (
    <div className="space-y-12 md:space-y-16 pb-12">
      {/* 1. Hero Carousel Banner with Text Overlay & Navigation */}
      <HeroCarouselSection />

      {/* 2. Shop by Gender Section */}
      <GenderCategoriesSection />

      {/* 3. Shop by Age Section */}
      {/* <ShopByAgeSection /> */}

      {/* 4. Explore Our Bestsellers */}
      {/* <BestsellersSection /> */}

      {/* 5. Dress Them for Every Occasion */}
      {/* <OccasionsSection /> */}

      {/* 6. Trending Categories Carousel Slider */}
      {/* <TrendingCategoriesSection /> */}

      {/* 7. New Arrivals Section */}
      <NewArrivalsSection />

      {/* Deal of the Day / Flash Offer Component */}
      {/* <DealOfTheDay /> */}

      {/* 8. The Celebration Edit Banner Section */}
      {/* <CelebrationEditSection /> */}

      {/* 9. Parent Reviews & Testimonials */}
      <ParentReviewsSection />

      {/* 10. Instagram Gallery & Newsletter Row */}
      {/* <InstagramNewsletterSection /> */}

      {/* 11. FAQs Section */}
      <FaqsAndCouponSection />

      {/* 12. Trust Badges & Value Propositions (Premium Quality, Skin Friendly, etc.) */}
      {/* <TrustBadgesSection /> */}
    </div>
  );
}
