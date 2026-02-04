import { MenuItem as MenuItemType } from '../types';
import MenuItem from './MenuItem';

interface MenuCategoryProps {
  category: string;
  items: MenuItemType[];
}

export default function MenuCategory({ category, items }: MenuCategoryProps) {
  return (
    <section className="mb-12">
      <h2 className="text-3xl font-bold text-gray-800 mb-6 pb-2 border-b-4 border-orange-500 inline-block">
        {category}
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
        {items.map((item) => (
          <MenuItem key={item.id} item={item} />
        ))}
      </div>
    </section>
  );
}
