import Image from 'next/image';
import Link from 'next/link';

export default function Header() {
  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-8 py-4">
        <div className="flex items-end justify-between">
          <Link href="/" className="inline-block">
            <Image
              src="/RedmanDesignsLogo-horz-2000x767.png"
              alt="Redman Designs"
              width={300}
              height={115}
              priority
              className="h-auto w-auto max-h-20"
            />
          </Link>
          <p className="text-lg md:text-xl text-gray-700 font-geist font-light tracking-wide hidden sm:block">
            Beautifully Personalized, Uniquely Yours
          </p>
        </div>
      </div>
    </header>
  );
}
