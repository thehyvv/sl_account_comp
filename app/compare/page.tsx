'use client';

import { useState } from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { getProductsWithBanks } from '@/lib/mock-data';
import { Product, Bank } from '@/types';
import {
  Scale, X, Plus, Check, Minus, ChevronDown, Info,
  AlertTriangle, PiggyBank, TrendingUp, Coins, ArrowRightLeft,
  Building2, Globe, Users, Star
} from 'lucide-react';
import { cn, formatPercentage, formatCurrency } from '@/lib/utils';

interface ComparisonRow {
  label: string;
  key: keyof Product | string;
  type: 'text' | 'number' | 'boolean' | 'currency' | 'percent';
  tooltip?: string;
}

const comparisonRows: ComparisonRow[] = [
  { label: 'Bank', key: 'bank', type: 'text' },
  { label: 'Category', key: 'category', type: 'text' },
  { label: 'Interest Rate (Regular)', key: 'interestRateRegular', type: 'percent', tooltip: 'Annual interest rate for regular customers' },
  { label: 'Interest Rate (Senior)', key: 'interestRateSenior', type: 'percent', tooltip: 'Annual interest rate for senior citizens (55+)' },
  { label: 'Min Deposit', key: 'minDepositLkr', type: 'currency' },
  { label: 'Min Balance', key: 'minBalanceLkr', type: 'currency' },
  { label: 'Monthly Fee', key: 'monthlyFeeLkr', type: 'currency' },
  { label: 'FD Min Tenure', key: 'fdTenureMinMonths', type: 'number' },
  { label: 'FD Max Tenure', key: 'fdTenureMaxMonths', type: 'number' },
  { label: 'Online Banking', key: 'onlineBanking', type: 'boolean' },
  { label: 'Mobile App', key: 'mobileApp', type: 'boolean' },
  { label: 'ATM Card', key: 'atmCard', type: 'text' },
  { label: 'Cheque Book', key: 'chequeBook', type: 'boolean' },
  { label: 'Foreign Currency', key: 'foreignCurrency', type: 'boolean' },
  { label: 'Standing Orders', key: 'standingOrders', type: 'boolean' },
];

const categoryFilters = [
  { value: 'all', label: 'All Types', icon: Building2 },
  { value: 'fixed_deposit', label: 'Fixed Deposits', icon: TrendingUp },
  { value: 'savings', label: 'Savings', icon: PiggyBank },
  { value: 'foreign_currency', label: 'Foreign Currency', icon: Coins },
  { value: 'remittance', label: 'Remittance', icon: ArrowRightLeft },
];

// Mock comparison state
const initialCompareIds = ['1', '2'];

function getValue(product: Product, key: string): string | boolean | number | null {
  if (key === 'bank') return (product as Product & { bank: Bank }).bank?.name || 'N/A';
  if (key.startsWith('features.')) {
    const featureKey = key.replace('features.', '');
    return ((product.features as unknown) as Record<string, unknown>)[featureKey] as string | boolean | number | null;
  }
  return (product as Record<string, unknown>)[key] as string | boolean | number | null;
}

function formatValue(value: unknown, type: string): string {
  if (value === null || value === undefined) return 'N/A';

  switch (type) {
    case 'percent':
      return typeof value === 'number' ? formatPercentage(value) : 'N/A';
    case 'currency':
      return typeof value === 'number' ? formatCurrency(value) : 'N/A';
    case 'boolean':
      return value ? 'Yes' : 'No';
    case 'number':
      return typeof value === 'number' ? value.toString() : 'N/A';
    default:
      return String(value);
  }
}

function ProductSelector({
  selectedIds,
  onSelect,
  onRemove,
  selectedCategory,
  onCategoryChange,
  allowMixedCategories,
  onToggleMixed,
  currentProductsCategories,
}: {
  selectedIds: string[];
  onSelect: (id: string) => void;
  onRemove: (id: string) => void;
  selectedCategory: string;
  onCategoryChange: (cat: string) => void;
  allowMixedCategories: boolean;
  onToggleMixed: () => void;
  currentProductsCategories: string[];
}) {
  const allProducts = getProductsWithBanks();
  const [isOpen, setIsOpen] = useState(false);

  const filteredProducts = allProducts.filter((product) => {
    if (allowMixedCategories) return true;
    if (selectedIds.length === 0) return true;
    if (selectedCategory === 'all') return true;
    return product.category === selectedCategory;
  });

  return (
    <div className="space-y-3">
      {/* Category Filter */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-sm text-stone-600 mr-2">Filter by type:</span>
        {categoryFilters.map((filter) => (
          <button
            key={filter.value}
            onClick={() => onCategoryChange(filter.value)}
            disabled={!allowMixedCategories && selectedIds.length > 0 && selectedCategory !== filter.value}
            className={cn(
              "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all",
              selectedCategory === filter.value
                ? "bg-emerald-600 text-white"
                : "bg-stone-100 text-stone-600 hover:bg-stone-200",
              !allowMixedCategories && selectedIds.length > 0 && selectedCategory !== filter.value && "opacity-50 cursor-not-allowed"
            )}
            aria-pressed={selectedCategory === filter.value}
          >
            <filter.icon className="w-4 h-4" />
            <span>{filter.label}</span>
          </button>
        ))}
      </div>

      {/* Mixed Category Toggle */}
      {selectedIds.length > 0 && (
        <div className="flex items-center gap-3 p-3 bg-amber-50 rounded-lg border border-amber-200">
          <input
            type="checkbox"
            id="allowMixed"
            checked={allowMixedCategories}
            onChange={onToggleMixed}
            className="w-4 h-4 text-emerald-600 rounded border-stone-300 focus:ring-emerald-500"
            aria-label="Allow comparing different product types"
          />
          <label htmlFor="allowMixed" className="flex-1 text-sm text-amber-800">
            <span className="font-medium">Advanced Compare:</span> Allow different product types
          </label>
          {allowMixedCategories && currentProductsCategories.length > 1 && (
            <span className="flex items-center gap-1 text-xs text-amber-700">
              <AlertTriangle className="w-3 h-3" />
              Mixed types
            </span>
          )}
        </div>
      )}

      {/* Product Dropdown */}
      <div className="relative">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-full bg-white border border-stone-200 rounded-xl p-4 flex items-center justify-between hover:border-emerald-300 transition-colors"
          aria-expanded={isOpen}
          aria-haspopup="listbox"
        >
          <div className="flex items-center gap-2">
            <Plus className="w-5 h-5 text-emerald-600" aria-hidden="true" />
            <span className="font-medium text-stone-700">Add Product to Compare</span>
            {selectedCategory !== 'all' && (
              <span className="text-xs text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                {categoryFilters.find(c => c.value === selectedCategory)?.label}
              </span>
            )}
          </div>
          <ChevronDown className={cn("w-5 h-5 text-stone-400 transition-transform", isOpen && "rotate-180")} aria-hidden="true" />
        </button>

        {isOpen && (
          <div
            className="absolute top-full left-0 right-0 mt-2 bg-white border border-stone-200 rounded-xl shadow-xl max-h-96 overflow-y-auto z-50"
            role="listbox"
          >
            <div className="p-2">
              {filteredProducts.length === 0 ? (
                <div className="px-4 py-3 text-sm text-stone-500">
                  No products available in this category
                </div>
              ) : (
                filteredProducts.map((product) => {
                  const isSelected = selectedIds.includes(product.id);
                  const bank = (product as Product & { bank: Bank }).bank;
                  return (
                    <button
                      key={product.id}
                      onClick={() => {
                        if (isSelected) {
                          onRemove(product.id);
                        } else {
                          onSelect(product.id);
                        }
                      }}
                      className={cn(
                        "w-full text-left px-4 py-3 rounded-lg flex items-center justify-between transition-colors",
                        isSelected ? "bg-emerald-50" : "hover:bg-stone-50"
                      )}
                      role="option"
                      aria-selected={isSelected}
                    >
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="font-medium text-stone-900 truncate">{product.name}</p>
                          {product.targetAudience.includes('expats') && (
                            <span className="text-xs bg-purple-100 text-purple-700 px-1.5 py-0.5 rounded" title="Expat-friendly">
                              <Globe className="w-3 h-3 inline" aria-label="Expat-friendly" />
                            </span>
                          )}
                          {product.targetAudience.includes('seniors') && (
                            <span className="text-xs bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded" title="Senior benefits">
                              <Users className="w-3 h-3 inline" aria-label="Senior benefits" />
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-stone-500">
                          {bank?.name} • {formatPercentage(product.interestRateRegular)}
                        </p>
                        <p className="text-xs text-stone-400 capitalize mt-0.5">
                          {product.category.replace('_', ' ')}
                        </p>
                      </div>
                      {isSelected && <Check className="w-5 h-5 text-emerald-600 shrink-0" aria-hidden="true" />}
                    </button>
                  );
                })
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function ComparePage() {
  const [compareIds, setCompareIds] = useState<string[]>(initialCompareIds);
  const [selectedCategory, setSelectedCategory] = useState('fixed_deposit');
  const [allowMixedCategories, setAllowMixedCategories] = useState(false);
  const allProducts = getProductsWithBanks();
  const productsToCompare = allProducts.filter((p) => compareIds.includes(p.id));

  // Check for mixed categories
  const currentCategories = [...new Set(productsToCompare.map((p) => p.category))];
  const isMixedCategories = currentCategories.length > 1;

  const addProduct = (id: string) => {
    if (compareIds.length < 4) {
      setCompareIds([...compareIds, id]);
    }
  };

  const removeProduct = (id: string) => {
    const newIds = compareIds.filter((pid) => pid !== id);
    setCompareIds(newIds);

    // Reset to default category if empty
    if (newIds.length === 0) {
      setSelectedCategory('fixed_deposit');
    }
  };

  // Expat-specific features display
  const hasExpatProduct = productsToCompare.some(p => p.targetAudience.includes('expats'));

  return (
    <div className="min-h-screen bg-stone-50">
      <Header />

      <main className="pt-8 pb-16">
        {/* Hero */}
        <div className="container-custom mb-8">
          <div className="text-center max-w-2xl mx-auto">
            <div className="flex items-center justify-center gap-2 mb-3">
              <Scale className="w-5 h-5 text-emerald-600" aria-hidden="true" />
              <span className="text-sm font-medium text-emerald-700 uppercase tracking-wide">Compare Products</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold text-stone-900 mb-3 font-display">
              Side-by-Side Comparison
            </h1>
            <p className="text-stone-600">
              Compare up to 4 banking products across rates, fees, and features to find your best match.
            </p>
          </div>
        </div>

        {/* Comparison Controls */}
        <div className="container-custom mb-8">
          <div className="bg-white rounded-xl border border-stone-200 p-4 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <span className="text-sm text-stone-500">Comparing:</span>
                <span className="font-medium text-stone-900">{compareIds.length}/4 products</span>
              </div>
            </div>

            <ProductSelector
              selectedIds={compareIds}
              onSelect={addProduct}
              onRemove={removeProduct}
              selectedCategory={selectedCategory}
              onCategoryChange={setSelectedCategory}
              allowMixedCategories={allowMixedCategories}
              onToggleMixed={() => setAllowMixedCategories(!allowMixedCategories)}
              currentProductsCategories={currentCategories}
            />
          </div>
        </div>

        {/* Mixed Category Warning */}
        {isMixedCategories && allowMixedCategories && (
          <div className="container-custom mb-6">
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3" role="alert">
              <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" aria-hidden="true" />
              <div>
                <h3 className="font-medium text-amber-900">Comparing Different Product Types</h3>
                <p className="text-sm text-amber-800 mt-1">
                  You&apos;re comparing {currentCategories.map(c => c.replace('_', ' ')).join(' vs ')}.
                  Interest rates may not be directly comparable as they serve different purposes.
                  FDs typically offer higher rates but lock your money, while savings accounts provide flexibility.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Expat Features Banner */}
        {hasExpatProduct && (
          <div className="container-custom mb-6">
            <div className="bg-purple-50 border border-purple-200 rounded-xl p-4 flex items-start gap-3">
              <Globe className="w-5 h-5 text-purple-600 shrink-0 mt-0.5" aria-hidden="true" />
              <div>
                <h3 className="font-medium text-purple-900">Expat-Friendly Products Selected</h3>
                <p className="text-sm text-purple-800 mt-1">
                  Products marked with 🌍 can be opened by Sri Lankans living abroad.
                  Look for features like foreign currency support, international transfers, and online account opening.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Comparison Table */}
        <div className="container-custom">
          {productsToCompare.length >= 2 ? (
            <div className="bg-white rounded-xl border border-stone-200 overflow-hidden">
              {/* Table Header - Product Cards */}
              <div className="grid grid-cols-[200px_repeat(auto-fit,minmax(200px,1fr))] gap-4 p-6 border-b border-stone-200 bg-stone-50">
                <div className="font-medium text-stone-500">Feature</div>
                {productsToCompare.map((product) => {
                  const bank = (product as Product & { bank: Bank }).bank;
                  return (
                    <div key={product.id} className="relative">
                      <button
                        onClick={() => removeProduct(product.id)}
                        className="absolute -top-2 -right-2 w-6 h-6 bg-stone-200 rounded-full flex items-center justify-center hover:bg-red-100 hover:text-red-600 transition-colors"
                        aria-label={`Remove ${product.name}`}
                      >
                        <X className="w-3 h-3" aria-hidden="true" />
                      </button>
                      <div className="bg-white rounded-lg border border-stone-200 p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <p className="font-semibold text-stone-900 text-sm line-clamp-1">{product.name}</p>
                          {product.targetAudience.includes('expats') && (
                            <span className="text-xs" title="Expat-friendly">🌍</span>
                          )}
                        </div>
                        <p className="text-xs text-stone-500">{bank?.name}</p>
                        <div className="mt-2 text-2xl font-bold text-emerald-700">
                          {formatPercentage(product.interestRateRegular)}
                        </div>
                        {/* Expat badges */}
                        <div className="flex flex-wrap gap-1 mt-2">
                          {product.features.foreignCurrency && (
                            <span className="text-[10px] bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded">
                              FC
                            </span>
                          )}
                          {product.targetAudience.includes('expats') && (
                            <span className="text-[10px] bg-purple-100 text-purple-700 px-1.5 py-0.5 rounded">
                              Expat
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Comparison Rows */}
              <div className="divide-y divide-stone-100">
                {comparisonRows.map((row) => {
                  const values = productsToCompare.map((p) => getValue(p, row.key));
                  const allSame = values.every((v) => v === values[0]);

                  return (
                    <div
                      key={row.key}
                      className={cn(
                        "grid grid-cols-[200px_repeat(auto-fit,minmax(200px,1fr))] gap-4 p-4 items-center hover:bg-stone-50 transition-colors",
                        !allSame && "bg-amber-50/30"
                      )}
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-stone-700">{row.label}</span>
                        {row.tooltip && (
                          <div className="group relative">
                            <Info className="w-4 h-4 text-stone-400" aria-hidden="true" />
                            <div className="absolute bottom-full left-0 mb-2 w-48 p-2 bg-stone-800 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10" role="tooltip">
                              {row.tooltip}
                            </div>
                          </div>
                        )}
                      </div>
                      {productsToCompare.map((product) => {
                        const value = getValue(product, row.key);
                        const formattedValue = formatValue(value, row.type);

                        return (
                          <div key={product.id} className="text-center">
                            {row.type === 'boolean' ? (
                              value ? (
                                <Check className="w-5 h-5 text-emerald-600 mx-auto" aria-label="Yes" />
                              ) : (
                                <Minus className="w-5 h-5 text-stone-300 mx-auto" aria-label="No" />
                              )
                            ) : (
                              <span className={cn(
                                "text-sm",
                                row.type === 'percent' && "font-semibold text-emerald-700"
                              )}>
                                {formattedValue}
                              </span>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="text-center py-16 bg-white rounded-xl border border-stone-200">
              <Scale className="w-12 h-12 text-stone-300 mx-auto mb-4" aria-hidden="true" />
              <h3 className="text-lg font-semibold text-stone-900 mb-2">Add Products to Compare</h3>
              <p className="text-stone-600">Select at least 2 products to start comparing</p>
            </div>
          )}
        </div>

        {/* Comparison Tips */}
        <div className="container-custom mt-8">
          <div className="bg-emerald-50 rounded-xl p-6 border border-emerald-200">
            <h3 className="font-semibold text-emerald-900 mb-2">💡 Comparison Tips</h3>
            <ul className="space-y-2 text-sm text-emerald-800">
              <li>Look beyond just interest rates - consider fees, accessibility, and bank stability</li>
              <li>Senior citizens often get higher rates (0.5% extra is common)</li>
              <li>Check minimum balance requirements to avoid penalties</li>
              <li>Foreign currency accounts protect against LKR depreciation but have lower rates</li>
              <li><strong>Expats:</strong> Look for products that allow online account opening from abroad</li>
            </ul>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
