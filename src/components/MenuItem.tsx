
import { Plus } from 'lucide-react';
import { MenuItem as MenuItemType } from '../types';
import { useCart } from '../context/CartContext';
import { useState } from 'react';

interface MenuItemProps {
  item: MenuItemType;
}

export default function MenuItem({ item }: MenuItemProps) {
  const { addToCart } = useCart();
  const [selectedSize, setSelectedSize] = useState<'half' | 'full'>('full');

  const hasHalfFull = item.half_price !== null && item.full_price !== null;

  const handleAddToCart = () => {
    if (hasHalfFull) {
      addToCart(item, selectedSize);
    } else {
      addToCart(item);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all p-5 border border-gray-100">
      <div className="flex justify-between items-start mb-3">
        <div className="flex-1">
          <h3 className="font-bold text-gray-800 text-lg mb-1">{item.name}</h3>
          {item.description && (
            <p className="text-sm text-gray-600">{item.description}</p>
          )}
        </div>
      </div>

      <div className="flex items-center justify-between mt-4">
        <div>
          {hasHalfFull ? (
            <div className="flex gap-2 items-center">
              <button
                onClick={() => setSelectedSize('half')}
                className={`px-3 py-1 rounded-full text-sm font-semibold transition-all ${
                  selectedSize === 'half'
                    ? 'bg-orange-500 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Half ₹{item.half_price}
              </button>
              <button
                onClick={() => setSelectedSize('full')}
                className={`px-3 py-1 rounded-full text-sm font-semibold transition-all ${
                  selectedSize === 'full'
                    ? 'bg-orange-500 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Full ₹{item.full_price}
              </button>
            </div>
          ) : (
            <span className="text-2xl font-bold text-orange-600">
              ₹{item.price}
            </span>
          )}
        </div>
        <button
          onClick={handleAddToCart}
          className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-full font-semibold flex items-center gap-2 transition-all shadow-md hover:shadow-lg"
        >
          <Plus size={18} />
          Add
        </button>
      </div>
    </div>
  );
}
