import ProductCard from '@/components/ProductCard';
import { createServerClient } from '@/lib/supabase/server';
import { Product } from '@/types';

export default async function CatalogPage() {
  const supabase = createServerClient();
  
  const { data: products, error } = await supabase
    .from('products')
    .select('*')
    .eq('active', true)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching products:', error);
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="pt-8 pr-8 pb-8 pl-8 space-y-16 max-w-7xl mx-auto">
        <h2 className="text-4xl font-medium text-gray-900 tracking-tight font-playfair mb-6">
          Redman Designs Collection
        </h2>

        {products && products.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {products.map((product: Product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>

            <p className="text-sm text-gray-600 mt-8 text-center font-light">
              Hover over cards to reveal product details
            </p>
          </>
        ) : (
          <div className="text-center py-16">
            <p className="text-gray-600 text-lg">
              No products available yet. Check back soon!
            </p>
            <p className="text-sm text-gray-500 mt-4">
              Configure your Supabase connection in .env.local and add products to get started.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
