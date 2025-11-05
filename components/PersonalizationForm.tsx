'use client';

import { useState } from 'react';
import { Product } from '@/types';

interface PersonalizationFormProps {
  product: Product;
  onCustomizationChange: (data: any) => void;
}

export default function PersonalizationForm({ product, onCustomizationChange }: PersonalizationFormProps) {
  const rules = product.customization_rules;
  const maxNames = rules?.max_names || 1;
  const maxChars = rules?.max_chars_per_name || 20;
  const placeholder = rules?.placeholder || 'Enter name';

  const [names, setNames] = useState<string[]>(Array(maxNames).fill(''));
  const [selectedFont, setSelectedFont] = useState<string>('Dancing Script');
  
  const fontOptions = [
    { name: 'Dancing Script', value: 'Dancing Script' },
    { name: 'Great Vibes', value: 'Great Vibes' },
    { name: 'Pacifico', value: 'Pacifico' }
  ];

  const handleNameChange = (index: number, value: string) => {
    const newNames = [...names];
    newNames[index] = value.slice(0, maxChars); // Enforce character limit
    setNames(newNames);
    
    // Send back only non-empty names
    const validNames = newNames.filter(name => name.trim() !== '');
    onCustomizationChange({ names: validNames, font: selectedFont });
  };

  if (product.customization_type === 'none') {
    return null;
  }

  if (product.customization_type === 'names') {
    return (
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Personalize Your {product.name}
          </h3>
          <p className="text-sm text-gray-600 mb-4">
            {maxNames === 1 
              ? `Enter a name (max ${maxChars} characters)`
              : `Enter up to ${maxNames} names (max ${maxChars} characters each)`
            }
          </p>
        </div>

        {/* Font Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Choose Engraving Font <span className="text-red-500">*</span>
          </label>
          <div className="grid grid-cols-1 gap-3">
            {fontOptions.map((font) => (
              <label
                key={font.value}
                className={`relative flex items-center p-4 border-2 rounded-lg cursor-pointer transition-all ${
                  selectedFont === font.value
                    ? 'border-gray-900 bg-gray-50'
                    : 'border-gray-300 hover:border-gray-400'
                }`}
              >
                <input
                  type="radio"
                  name="font"
                  value={font.value}
                  checked={selectedFont === font.value}
                  onChange={(e) => {
                    setSelectedFont(e.target.value);
                    const validNames = names.filter(name => name.trim() !== '');
                    onCustomizationChange({ names: validNames, font: e.target.value });
                  }}
                  className="sr-only"
                />
                <span
                  className="text-2xl"
                  style={{ fontFamily: font.value }}
                >
                  {font.name}
                </span>
                {selectedFont === font.value && (
                  <span className="ml-auto text-gray-900 font-semibold">✓</span>
                )}
              </label>
            ))}
          </div>
        </div>

        <div className="space-y-3">
          {Array.from({ length: maxNames }).map((_, index) => (
            <div key={index}>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {maxNames === 1 ? 'Name' : `Name ${index + 1}`}
                {index === 0 && <span className="text-red-500 ml-1">*</span>}
              </label>
              <input
                type="text"
                value={names[index]}
                onChange={(e) => handleNameChange(index, e.target.value)}
                placeholder={placeholder}
                required={index === 0}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
              />
              <p className="text-xs text-gray-500 mt-1">
                {names[index].length}/{maxChars} characters
              </p>
            </div>
          ))}
        </div>

        {names.filter(n => n.trim()).length > 0 && (
          <div className="bg-gray-50 rounded-lg p-6 border-2 border-gray-200">
            <p className="text-sm font-medium text-gray-700 mb-3">Preview:</p>
            <p 
              className="text-3xl text-gray-900"
              style={{ fontFamily: selectedFont }}
            >
              {names.filter(n => n.trim()).join(', ')}
            </p>
            <p className="text-xs text-gray-500 mt-2">Font: {selectedFont}</p>
          </div>
        )}
      </div>
    );
  }

  if (product.customization_type === 'text') {
    const maxTextChars = rules?.max_chars || 50;
    const [text, setText] = useState('');

    return (
      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Personalize Your {product.name}
          </h3>
          <p className="text-sm text-gray-600 mb-4">
            Enter your custom text (max {maxTextChars} characters)
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Custom Text <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={text}
            onChange={(e) => {
              const value = e.target.value.slice(0, maxTextChars);
              setText(value);
              onCustomizationChange({ text: value });
            }}
            placeholder={placeholder}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
          />
          <p className="text-xs text-gray-500 mt-1">
            {text.length}/{maxTextChars} characters
          </p>
        </div>
      </div>
    );
  }

  return null;
}
