import Image from 'next/image';
import Link from 'next/link';
import { Product } from '@/types';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const imagePath = product.image_filename 
    ? `/images/products/${product.image_filename}`
    : '/images/products/placeholder.jpg';
  
  const needsCustomization = product.customization_type !== 'none';

  return (
    <Link href={`/p/${product.barcode}`}>
      <div className="card group relative overflow-hidden cursor-pointer transition-all duration-[600ms] hover:rotate-[-5deg] hover:scale-110 hover:shadow-[0_10px_20px_rgba(0,0,0,0.2)] w-full h-64 md:h-72 rounded-xl">
        {/* Product Image */}
        <Image
          src={imagePath}
          alt={product.name}
          fill
          unoptimized
          className="card__image object-cover transition-all duration-[600ms] group-hover:scale-110 group-hover:opacity-30"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
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
              Personalize & Order
            </button>
          )}
        </div>
      </div>
    </Link>
  );
}
