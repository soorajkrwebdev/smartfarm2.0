import React, { useState, useEffect } from 'react';
import { EmptyState } from '../../components/common/EmptyState';
import { Badge } from '../../components/common/Badge';
import { TrendingUp, Search, Leaf, Package, RefreshCw, AlertCircle } from 'lucide-react';
import { useFarmData } from '../../contexts/FarmContext';

interface MandiPrice {
  commodity: string;
  price: number;
  unit: string;
  date: string;
  minPrice: number;
  maxPrice: number;
  modalPrice: number;
}

const DEMO_PRICES: MandiPrice[] = [
  { commodity: 'Coconut (Fresh)', price: 2800, unit: 'INR/quintal', date: '24 Sep 2026', minPrice: 2200, maxPrice: 3500, modalPrice: 2800 },
  { commodity: 'Coconut Oil', price: 14500, unit: 'INR/quintal', date: '24 Sep 2026', minPrice: 13500, maxPrice: 15200, modalPrice: 14500 },
  { commodity: 'Black Pepper (Garbled)', price: 68500, unit: 'INR/quintal', date: '24 Sep 2026', minPrice: 62000, maxPrice: 75000, modalPrice: 68500 },
  { commodity: 'Banana (Yelakki)', price: 1800, unit: 'INR/quintal', date: '24 Sep 2026', minPrice: 1500, maxPrice: 2200, modalPrice: 1800 },
  { commodity: 'Cocoa Beans', price: 92000, unit: 'INR/quintal', date: '24 Sep 2026', minPrice: 85000, maxPrice: 105000, modalPrice: 92000 },
  { commodity: 'Areca nut (Semis)', price: 2200, unit: 'INR/quintal', date: '24 Sep 2026', minPrice: 1800, maxPrice: 2800, modalPrice: 2200 },
];

export const MarketPage: React.FC = () => {
  const { farms } = useFarmData();
  const [q, setQ] = useState('');
  const [prices, setPrices] = useState<MandiPrice[]>(DEMO_PRICES);
  const [loading, setLoading] = useState(false);

  const refreshPrices = () => {
    setLoading(true);
    setTimeout(() => {
      setPrices(DEMO_PRICES);
      setLoading(false);
    }, 500);
  };

  useEffect(() => {
    const timer = setTimeout(() => setPrices(DEMO_PRICES), 400);
    return () => clearTimeout(timer);
  }, []);

  const filteredPrices = prices.filter(p =>
    p.commodity.toLowerCase().includes(q.toLowerCase())
  );

  const selectedFarm = farms[0];

  return (
    <div className='space-y-6'>
      <div className='flex items-center justify-between'>
        <div>
          <h1 className='text-xl font-bold text-slate-800'>Market Prices</h1>
          <p className='text-sm text-slate-500 mt-0.5'>Agriculture commodity mandi rates</p>
        </div>
        <Badge variant='emerald' size='sm'>AGMARKNET / Demo</Badge>
      </div>

      <div className='grid grid-cols-1 lg:grid-cols-4 gap-6'>
        <div className='lg:col-span-1'>
          <div className='bg-white rounded-2xl border border-slate-200/70 p-4'>
            <div className='flex items-center justify-between mb-4'>
              <h3 className='font-bold text-slate-800 flex items-center gap-2'>
                <Leaf className='w-4 h-4 text-emerald-600' /> Your Farm
              </h3>
            </div>
            {selectedFarm ? (
              <div className='space-y-2'>
                <p className='font-semibold text-slate-800 text-sm'>{selectedFarm.name}</p>
                <p className='text-xs text-slate-500'>{selectedFarm.location}</p>
              </div>
            ) : (
              <EmptyState icon={<Leaf className='w-8 h-8' />} title='No farms configured' description='Add a farm to see market prices.' />
            )}
            <div className='mt-4 pt-3 border-t border-slate-100'>
              <button
                onClick={refreshPrices}
                className='w-full flex items-center justify-center gap-1.5 px-3 py-2 bg-emerald-50 text-emerald-700 rounded-xl text-xs font-medium'
              >
                <RefreshCw className='w-3.5 h-3.5' /> Refresh Prices
              </button>
            </div>
          </div>

          <div className='bg-emerald-50 rounded-2xl border border-emerald-200/50 p-3 mt-4'>
            <div className='flex items-start gap-2'>
              <AlertCircle className='w-4 h-4 text-emerald-600 shrink-0 mt-0.5' />
              <p className='text-xs text-emerald-700'>
                Demo mode prices shown. Connect to AGMARKNET API for live data.
              </p>
            </div>
          </div>
        </div>

        <div className='lg:col-span-3'>
          <div className='flex items-center justify-between mb-4'>
            <h3 className='font-bold text-slate-800'>Recent Mandi Prices</h3>
            <div className='relative w-56'>
              <Search className='absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400' />
              <input
                type='text'
                placeholder='Search...'
                value={q}
                onChange={e => setQ(e.target.value)}
                className='pl-9 pr-3 py-1.5 text-sm bg-slate-50 rounded-xl border border-slate-200 w-full focus:border-emerald-500 outline-none'
              />
            </div>
          </div>

          {loading ? (
            <div className='space-y-3'>
              {[1, 2, 3, 4].map(i => (
                <div key={i} className='bg-white rounded-2xl border p-4'>
                  <div className='h-4 bg-slate-100 rounded w-32 mb-2 animate-pulse' />
                </div>
              ))}
            </div>
          ) : filteredPrices.length > 0 ? (
            <div className='grid grid-cols-1 md:grid-cols-2 gap-3'>
              {filteredPrices.map((price, idx) => (
                <div key={idx} className='bg-white rounded-2xl border p-4'>
                  <div className='flex items-start justify-between mb-2'>
                    <div>
                      <h4 className='font-bold text-sm'>{price.commodity}</h4>
                      <p className='text-xs text-slate-500'>{price.date}</p>
                    </div>
                    <Badge variant='slate' size='sm'>{price.unit}</Badge>
                  </div>
                  <div className='border-t pt-3 mt-1 space-y-1.5'>
                    <div className='flex justify-between'>
                      <span className='text-xs text-slate-400'>Price</span>
                      <span className='text-sm font-bold'>{price.price.toLocaleString()} Rs</span>
                    </div>
                    <div className='flex justify-between'>
                      <span className='text-xs text-slate-400'>Modal</span>
                      <span className='text-xs text-slate-600'>{price.modalPrice.toLocaleString()} Rs</span>
                    </div>
                    <div className='flex justify-between'>
                      <span className='text-xs text-slate-400'>Min-Max</span>
                      <span className='text-xs text-slate-600'>{price.minPrice.toLocaleString()} - {price.maxPrice.toLocaleString()} Rs</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <EmptyState icon={<TrendingUp className='w-8 h-8' />} title='No prices found' description='Try a different search.' />
          )}
        </div>
      </div>

      <div className='bg-emerald-800 rounded-3xl p-5 text-white'>
        <div className='flex items-start gap-4'>
          <Package className='w-6 h-6 text-emerald-200' />
          <div>
            <h3 className='font-bold text-sm'>Farm Gate Advisory</h3>
            <p className='text-sm text-emerald-200/80 mt-1'>
              Farmers receive 60-75% of mandi price at farm gate after transportation.
              Record your harvest costs in the Input module to compare with market prices.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
