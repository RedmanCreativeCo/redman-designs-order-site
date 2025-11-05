'use client';

import { use, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import PersonalizationForm from '@/components/PersonalizationForm';
import { Product } from '@/types';

interface OrderPageProps {
  params: Promise<{ productId: string }>;
}

export default function OrderPage({ params }: OrderPageProps) {
  const { productId } = use(params);
  const router = useRouter();
  
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [customizationData, setCustomizationData] = useState<any>(null);
  const [customerInfo, setCustomerInfo] = useState({
    name: '',
    email: '',
    phone: '',
  });
  const [pickupConfirmed, setPickupConfirmed] = useState(false);

  // Fetch product on mount
  useState(() => {
    fetch(`/api/products/${productId}`)
      .then(res => res.json())
      .then(data => {
        setProduct(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!pickupConfirmed) {
      alert('Please confirm you understand this is pickup only.');
      return;
    }
    
    // For now, just show an alert - we'll add Square payment next
    alert('Order functionality coming soon! Will integrate Square payment next.');
    console.log({
      product,
      customizationData,
      customerInfo
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <p className="text-gray-600">Loading...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-4">Product not found</p>
          <Link href="/" className="text-gray-900 underline">
            Back to Collection
          </Link>
        </div>
      </div>
    );
  }

  const imagePath = product.image_filename 
    ? `/images/products/${product.image_filename}`
    : '/images/products/placeholder.jpg';

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-8 py-12">
        {/* Back button */}
        <Link 
          href={`/p/${product.barcode}`}
          className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-8"
        >
          ← Back to Product
        </Link>

        <h1 className="text-3xl font-bold text-gray-900 font-playfair mb-8">
          Complete Your Order
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Order Form */}
          <div className="lg:col-span-3">
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Personalization Section */}
              {product.customization_type !== 'none' && (
                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <PersonalizationForm 
                    product={product}
                    onCustomizationChange={setCustomizationData}
                  />
                </div>
              )}

              {/* Customer Information */}
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Your Information
                </h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Full Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={customerInfo.name}
                      onChange={(e) => setCustomerInfo({...customerInfo, name: e.target.value})}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      value={customerInfo.email}
                      onChange={(e) => setCustomerInfo({...customerInfo, email: e.target.value})}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Phone Number <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      value={customerInfo.phone}
                      onChange={(e) => {
                        // Auto-format phone number as (777) 777-7777
                        let value = e.target.value.replace(/\D/g, '');
                        if (value.length > 0) {
                          if (value.length <= 3) {
                            value = `(${value}`;
                          } else if (value.length <= 6) {
                            value = `(${value.slice(0, 3)}) ${value.slice(3)}`;
                          } else {
                            value = `(${value.slice(0, 3)}) ${value.slice(3, 6)}-${value.slice(6, 10)}`;
                          }
                        }
                        setCustomerInfo({...customerInfo, phone: value});
                      }}
                      placeholder="(555) 123-4567"
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                    />
                  </div>
                </div>
              </div>

              {/* Pickup Information */}
              <div className="bg-yellow-50 border-2 border-yellow-300 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  📍 PICKUP ONLY - Read Carefully
                </h3>
                
                {/* Checkbox First */}
                <div className="flex items-start mb-6 pb-6 border-b-2 border-yellow-300">
                  <input
                    type="checkbox"
                    id="pickupConfirmation"
                    checked={pickupConfirmed}
                    onChange={(e) => setPickupConfirmed(e.target.checked)}
                    required
                    className="mt-1 h-4 w-4 text-gray-900 focus:ring-gray-900 border-gray-300 rounded"
                  />
                  <label htmlFor="pickupConfirmation" className="ml-3 text-sm text-gray-900">
                    <span className="font-semibold">I UNDERSTAND THIS IS NOT SHIPPING. It is for pickup at YB Normal Designs.</span>
                    <span className="text-red-600 ml-1">*</span>
                  </label>
                </div>

                {/* Store Info with Logo */}
                <div className="bg-white rounded-lg p-6 shadow-sm">
                  <div className="flex items-center gap-3 mb-6">
                    <Image
                      src="/YB Normal Logo-black.PNG"
                      alt="YB Normal"
                      width={200}
                      height={200}
                      className="object-contain flex-shrink-0"
                    />
                    <div>
                      <p className="text-xl font-bold text-gray-900 mb-2">
                        YB Normal
                      </p>
                      <p className="text-base text-gray-700">
                        12346 Woodside Ave, Suite I<br />
                        Lakeside, CA 92040
                      </p>
                    </div>
                  </div>
                  
                  <div className="border-t border-gray-200 pt-4">
                    <p className="text-sm font-semibold text-gray-900 mb-2">Store Hours:</p>
                    <div className="text-sm text-gray-700 space-y-1">
                      <p>Monday – Thursday: 10:00 am – 7:00 pm</p>
                      <p>Friday: 10:00 am – 6:00 pm</p>
                      <p>Saturday: Closed</p>
                      <p>Sunday: 11:00 am – 6:00 pm</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full bg-gray-900 text-white py-4 px-8 rounded-lg font-semibold hover:bg-gray-800 transition-colors"
              >
                Continue to Payment
              </button>
            </form>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-2">
            <div className="bg-white border border-gray-200 rounded-lg p-6 sticky top-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Order Summary
              </h3>

              <div className="relative w-full aspect-square rounded-lg overflow-hidden mb-6">
                <Image
                  src={imagePath}
                  alt={product.name}
                  fill
                  unoptimized
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 400px"
                />
              </div>

              <p className="font-medium text-gray-900 mb-2">{product.name}</p>
              
              {customizationData && customizationData.names && customizationData.names.length > 0 && (
                <div className="text-sm text-gray-600 mb-4">
                  <p className="font-medium">Personalization:</p>
                  <p>{customizationData.names.join(', ')}</p>
                </div>
              )}

              <div className="border-t border-gray-200 pt-4 mt-4">
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-gray-900">Total</span>
                  <span className="text-2xl font-bold text-gray-900">
                    ${product.price.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
