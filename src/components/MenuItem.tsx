
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
    <div className="bg-white rounded-lg shadow-sm hover:shadow-md transition-all p-6 border border-gray-100">
      <div className="mb-4">
        <h3 className="font-bold text-gray-900 text-xl mb-2">{item.name}</h3>
        {item.description && (
          <p className="text-sm text-gray-600">{item.description}</p>
        )}
      </div>

      <div className="flex items-end justify-between mt-6">
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
          className="bg-orange-500 hover:bg-orange-600 text-white px-5 py-2 rounded-full font-semibold flex items-center gap-2 transition-all shadow-md hover:shadow-lg"
        >
          <Plus size={18} />
          Add
        </button>
      </div>
    </div>
  );
}
