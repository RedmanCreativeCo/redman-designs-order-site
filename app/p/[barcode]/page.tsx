import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { createServerClient } from '@/lib/supabase/server';
import { Product } from '@/types';

interface ProductPageProps {
  params: Promise<{ barcode: string }>;
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { barcode } = await params;
  const supabase = createServerClient();
  
  const { data: product, error } = await supabase
    .from('products')
    .select('*')
    .eq('barcode', barcode)
    .eq('active', true)
    .single();

  if (error || !product) {
    notFound();
  }

  const imagePath = product.image_filename 
    ? `/images/products/${product.image_filename}`
    : '/images/products/placeholder.jpg';
  
  const needsCustomization = product.customization_type !== 'none';

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-8 py-12">
        {/* Back to catalog */}
        <Link 
          href="/" 
          className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-8"
        >
          ← Back to Collection
        </Link>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Product Image */}
          <div className="relative aspect-[3/2] rounded-2xl overflow-hidden">
            <Image
              src={imagePath}
              alt={product.name}
              fill
              unoptimized
              className="object-cover"
              priority
            />
          </div>

          {/* Product Details */}
          <div className="flex flex-col">
            <h1 className="text-4xl font-bold text-gray-900 font-playfair mb-4">
              {product.name}
            </h1>
            
            <p className="text-3xl font-semibold text-gray-900 mb-6">
              ${product.price.toFixed(2)}
            </p>

            <p className="text-lg text-gray-600 leading-relaxed mb-8">
              {product.description}
            </p>

            {needsCustomization && (
              <div className="bg-gray-50 rounded-lg p-6 mb-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  ✨ Personalizable Product
                </h3>
                <p className="text-gray-600">
                  {product.customization_type === 'names' 
                    ? 'Add names to make it yours'
                    : 'Add your custom text'}
                </p>
              </div>
            )}

            {/* Order Button */}
            <Link
              href={`/order/new/${product.id}`}
              className="w-full bg-gray-900 text-white py-4 px-8 rounded-lg text-center font-semibold hover:bg-gray-800 transition-colors"
            >
              {needsCustomization ? 'Personalize & Order' : 'Order Now'}
            </Link>

            {/* Pickup Info */}
            <div className="mt-8 pt-8 border-t border-gray-200">
              <h3 className="font-semibold text-gray-900 mb-2">
                📍 Pickup Only
              </h3>
              <p className="text-sm text-gray-600">
                Orders are available for pickup at our shop location.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
