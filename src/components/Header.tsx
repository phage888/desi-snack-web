import { ShoppingCart, Phone } from 'lucide-react';
import { useCart } from '../context/CartContext';

interface HeaderProps {
  onCartClick: () => void;
}

export default function Header({ onCartClick }: HeaderProps) {
  const { cart } = useCart();
  const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <header className="bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold">Deepika's Kitchen Diary</h1>
            <p className="text-sm md:text-base text-orange-100 flex items-center gap-2 mt-1">
              <Phone size={16} />
              7599172232
            </p>
          </div>
          <button
            onClick={onCartClick}
            className="relative bg-white text-orange-600 px-4 py-2 md:px-6 md:py-3 rounded-full font-semibold hover:bg-orange-50 transition-all shadow-lg hover:shadow-xl flex items-center gap-2"
          >
            <ShoppingCart size={20} />
            <span className="hidden md:inline">Cart</span>
            {itemCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">
                {itemCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
}
