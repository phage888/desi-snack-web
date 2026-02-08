import { MenuItem as MenuItemType } from '../types';
import MenuItem from './MenuItem';

interface MenuCategoryProps {
  category: string;
  items: MenuItemType[];
}

export default function MenuCategory({ category, items }: MenuCategoryProps) {
  return (
    <section className="mb-16">
      <h2 className="text-4xl font-bold text-gray-900 mb-4 pb-3 border-b-4 border-orange-500 inline-block">
        {category}
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
        {items.map((item) => (
          <MenuItem key={item.id} item={item} />
        ))}
      </div>
    </section>
  );
}
