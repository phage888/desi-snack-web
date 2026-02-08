
import { useState, useEffect } from 'react';
import { MenuItem } from './types';
import { supabase } from './lib/supabase';
import Header from './components/Header';
import MenuCategory from './components/MenuCategory';
import Cart from './components/Cart';
import Checkout from './components/Checkout';
import { Loader2 } from 'lucide-react';

function App() {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

  useEffect(() => {
    fetchMenuItems();
  }, []);

  const fetchMenuItems = async () => {
    try {
      const { data, error } = await supabase
        .from('menu_items')
        .select('*')
        .eq('is_available', true)
        .order('category', { ascending: true });

      if (error) throw error;
      setMenuItems(data || []);
    } catch (error) {
      console.error('Error fetching menu:', error);
    } finally {
      setLoading(false);
    }
  };

  const groupedMenuItems = menuItems.reduce((acc, item) => {
    if (!acc[item.category]) {
      acc[item.category] = [];
    }
    acc[item.category].push(item);
    return acc;
  }, {} as Record<string, MenuItem[]>);

  const categoryOrder = [ 
    'Desi Snacks & Meal',  'Desi Snacks & Meal are only available from 10 AM to 5 PM', 
    'Pav Bhaji Special',
    'Pasta & Chinese',
    'Pizza',
    'Burgers',
    'Sandwiches',
    'Fries & Sides',
    'Momos',
    'Combos',
  ];

  if (isCheckoutOpen) {
    return <Checkout onBack={() => setIsCheckoutOpen(false)} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50">
      <Header onCartClick={() => setIsCartOpen(true)} />

      <Cart
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        onCheckout={() => {
          setIsCartOpen(false);
          setIsCheckoutOpen(true);
        }}
      />

      <main className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
            Our Menu
          </h2>
          <p className="text-gray-600 text-lg">
            Delicious food delivered to your doorstep
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 size={48} className="animate-spin text-orange-500" />
          </div>
        ) : (
          <div>
            {categoryOrder.map((category) => {
              const items = groupedMenuItems[category];
              if (!items || items.length === 0) return null;
              return (
                <MenuCategory key={category} category={category} items={items} />
              );
            })}
          </div>
        )}
      </main>

      <footer className="bg-gray-800 text-white py-8 mt-16">
        <div className="container mx-auto px-4 text-center">
          <h3 className="text-2xl font-bold mb-2">Deepika's Kitchen Diary</h3>
          <p className="text-gray-400 mb-4">Fresh food, made with love</p>
          <p className="text-orange-400 font-semibold">
            Contact: 7248627794 Email: deepikaskitchendiary@gmail.com
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;
