import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, Trash2, ShoppingBag, ArrowRight } from 'lucide-react';
import { useShop } from '../context/ShopContext';
import ProductCard from '../components/ProductCard';

export default function WishlistPage() {
  const { wishlist, products } = useShop();

  const savedProducts = products.filter((p) => wishlist.includes(p.id));

  return (
    <div className="max-w-[1600px] mx-auto px-4 py-8 space-y-6">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-pink-100 rounded-full flex items-center justify-center text-pink-600">
          <Heart className="w-5 h-5 fill-pink-600" />
        </div>
        <div>
          <h1 className="font-heading font-black text-2xl md:text-3xl text-gray-900">Your Saved Wishlist</h1>
          <p className="text-xs text-gray-500">Total {savedProducts.length} items saved for later</p>
        </div>
      </div>

      {savedProducts.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {savedProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-3xl p-12 text-center border border-pink-100 max-w-md mx-auto space-y-4">
          <div className="w-16 h-16 bg-pink-50 rounded-full flex items-center justify-center text-pink-300 mx-auto">
            <Heart className="w-8 h-8" />
          </div>
          <h3 className="font-heading font-extrabold text-lg text-gray-800">Your Wishlist is Empty</h3>
          <p className="text-xs text-gray-500">Save outfits you love by clicking the heart icon on any product card!</p>
          <Link
            to="/new-arrivals"
            className="inline-flex items-center gap-2 bg-pink-600 text-white text-xs font-bold px-6 py-3 rounded-full hover:bg-pink-700 transition-colors shadow-md"
          >
            <span>Explore New Arrivals</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      )}
    </div>
  );
}
