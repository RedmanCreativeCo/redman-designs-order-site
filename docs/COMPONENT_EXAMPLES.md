# Component Examples

## Product Card Component (Based on your design)

This adapts your fashion gallery card design for the product catalog.

### ProductCard.tsx

```tsx
import Image from 'next/image';
import Link from 'next/link';

interface Product {
  id: string;
  barcode: string;
  name: string;
  description: string;
  price: number;
  image_filename: string;
  customization_type: 'names' | 'text' | 'none';
  active: boolean;
}

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const imagePath = `/images/products/${product.image_filename}`;
  const needsCustomization = product.customization_type !== 'none';

  return (
    <Link href={`/p/${product.barcode}`}>
      <div className="card group relative overflow-hidden cursor-pointer transition-all duration-[600ms] hover:rotate-[-5deg] hover:scale-110 hover:shadow-[0_10px_20px_rgba(0,0,0,0.2)] w-full h-64 md:h-72 rounded-xl">
        {/* Product Image */}
        <Image
          src={imagePath}
          alt={product.name}
          fill
          className="card__image object-cover transition-all duration-[600ms] group-hover:scale-110 group-hover:opacity-30"
        />

        {/* Hover Content */}
        <div className="card__content absolute top-0 left-0 w-full h-full p-5 bg-white opacity-0 group-hover:opacity-100 transition-all duration-[600ms] flex flex-col justify-center">
          <p className="text-xl text-gray-800 m-0 font-semibold">
            {product.name}
          </p>
          
          <p className="text-sm text-gray-600 mt-3 leading-relaxed font-light line-clamp-3">
            {product.description}
          </p>
          
          <div className="mt-4">
            <span className="text-lg font-semibold text-gray-900">
              ${product.price.toFixed(2)}
            </span>
            {needsCustomization && (
              <span className="text-sm text-gray-500 ml-2 font-light">
                Customizable
              </span>
            )}
          </div>

          {needsCustomization && (
            <button className="mt-4 px-4 py-2 bg-gray-900 text-white text-sm rounded-lg hover:bg-gray-800 transition-colors">
              Customize & Order
            </button>
          )}
        </div>
      </div>
    </Link>
  );
}
```

### Product Catalog Page (app/page.tsx)

```tsx
import ProductCard from '@/components/ProductCard';
import { createClient } from '@/lib/supabase';

export default async function CatalogPage() {
  const supabase = createClient();
  
  const { data: products } = await supabase
    .from('products')
    .select('*')
    .eq('active', true)
    .order('created_at', { ascending: false });

  return (
    <div className="pt-8 pr-8 pb-8 pl-8 space-y-16 max-w-7xl mx-auto">
      <h2 className="text-4xl font-medium text-gray-900 tracking-tight mb-6">
        Redman Designs Collection
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {products?.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      <p className="text-sm text-gray-600 mt-8 text-center font-light">
        Hover over cards to reveal product details
      </p>
    </div>
  );
}
```

---

## Alternative: Simpler Card (No Hover Overlay)

If you prefer a cleaner approach without the opacity overlay:

```tsx
export default function SimpleProductCard({ product }: ProductCardProps) {
  return (
    <Link href={`/p/${product.barcode}`}>
      <div className="group cursor-pointer transition-transform hover:scale-105">
        {/* Image Container */}
        <div className="relative w-full h-64 rounded-xl overflow-hidden mb-4">
          <Image
            src={`/images/products/${product.image_filename}`}
            alt={product.name}
            fill
            className="object-cover"
          />
        </div>

        {/* Product Info */}
        <div className="space-y-2">
          <h3 className="text-lg font-semibold text-gray-900">
            {product.name}
          </h3>
          
          <p className="text-sm text-gray-600 line-clamp-2">
            {product.description}
          </p>
          
          <div className="flex items-center justify-between">
            <span className="text-xl font-bold text-gray-900">
              ${product.price.toFixed(2)}
            </span>
            
            {product.customization_type !== 'none' && (
              <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                Customizable
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
```

---

## Fonts Setup (tailwind.config.ts)

Based on your code using Playfair and Geist fonts:

```typescript
import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        playfair: ['Playfair Display', 'serif'],
        geist: ['Geist', 'sans-serif'],
        sans: ['Geist', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};

export default config;
```

### Add to app/layout.tsx:

```tsx
import { Playfair_Display } from 'next/font/google';
import localFont from 'next/font/local';

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
});

const geist = localFont({
  src: './fonts/GeistVF.woff',
  variable: '--font-geist',
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${playfair.variable} ${geist.variable}`}>
      <body className="font-geist">{children}</body>
    </html>
  );
}
```

---

## Color Palette (from your design)

```css
/* Primary colors used */
--gray-900: #111827
--gray-800: #1f2937
--gray-600: #4b5563
--gray-500: #6b7280
--white: #ffffff

/* Card shadows */
hover:shadow-[0_10px_20px_rgba(0,0,0,0.2)]
```

---

## Next Steps

1. Use the `.env.local.example` as a template
2. Add sample products to Supabase using SQL from `SAMPLE_PRODUCTS.md`
3. Place placeholder images in `/public/images/products/`
4. Implement `ProductCard` component with your preferred style
5. Test catalog page with 3 sample products

Ready to initialize the Next.js project when you are!
