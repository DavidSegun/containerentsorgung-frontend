import { ShoppingCart } from '@/components/sections/ShoppingCart/ShoppingCart';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Warenkorb',
  description: 'Ihr Warenkorb - Container Entsorgung Shop',
};

export default function CartPage() {
  return (
    <main>
      <ShoppingCart />
    </main>
  );
}
