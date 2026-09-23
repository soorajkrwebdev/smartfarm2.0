import React, { useState } from 'react';
import { EmptyState } from '../../components/common/EmptyState';
import { Badge } from '../../components/common/Badge';
import { BarChart3, TrendingUp, Leaf, Package, Users, Wheat, CircleDollarSign, Activity, Sparkles } from 'lucide-react';
import { useFarmData } from '../../contexts/FarmContext';

interface AnalyticsData {
  totalFarms: number;
  totalCrops: number;
  organicArea: number;
  conventionalArea: number;
  totalActivities: number;
  organicPractices: number;
  ipmActivities: number;
  wasteRecycled: number;
  compostProduced: number;
  soilTests: number;
  organicInputUsage: number;
}

const DEMO_ANALYTICS: AnalyticsData = {
  totalFarms: 1,
  totalCrops: 5,
  organicArea: 4.2,
  conventionalArea: 0,
  totalActivities: 47,
  organicPractices: 23,
  ipmActivities: 12,
  wasteRecycled: 320,
  compostProduced: 180,
  soilTests: 3,
  organicInputUsage: 95,
};

export const AnalyticsPage: React.FC = () => {
  const { farms } = useFarmData();
  const [analytics] = useState<AnalyticsData>(DEMO_ANALYTICS);

  const organicPercentage = ((analytics.organicArea / (analytics.organicArea + analytics.conventionalArea)) * 100).toFixed(0);
  const cropData = [
    { name: 'Arecanut', area: 1.2, production: 2800, price: 28, color: 'bg-emerald-500' },
    { name: 'Black Pepper', area: 0.5, production: 450, price: 685, color: 'bg-emerald-600' },
    { name: 'Coconut', area: 0.8, production: 1200, price: 26, color: 'bg-emerald-400' },
    { name: 'Banana', area: 0.6, production: 800, price: 18, color: 'bg-amber-500' },
    { name: 'Vegetables', area: 0.3, production: 300, price: 45, color: 'bg-orange-500' },
  ];

  const totalRevenue = cropData.reduce((sum, c) => sum + (c.production * c.price), 0);
  const totalArea = cropData.reduce((sum, c) => sum + c.area, 0);
  const maxProduction = Math.max(...cropData.map(c => c.production));

  const activityData = [
    { label: 'Organic Practices', value: analytics.organicPractices, color: 'bg-emerald-500' },
    { label: 'IPM Activities', value: analytics.ipmActivities, color: 'bg-blue-500' },
    { label: 'Other Activities', value: analytics.totalActivities - analytics.organicPractices - analytics.ipmActivities, color: 'bg-slate-400' },
  ];

  return (
    <div className='space-y-6'>
      <div className='flex items-center justify-between'>
        <div>
          <h1 className='text-xl font-bold text-slate-800'>Farm Analytics</h1>
          <p className='text-sm text-slate-500 mt-0.5'>Insights and metrics for your organic farming operations</p>
        </div>
        <Badge variant='emerald' size='sm'>Dashboard</Badge>
      </div>

      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4'>
        <div className='bg-white rounded-2xl border p-4'>
          <div className='flex items-center justify-between mb-2'>
            <span className='text-xs text-slate-500'>Organic Land Share</span>
            <Leaf className='w-4 h-4 text-emerald-600' />
          </div>
          <p className='text-3xl font-bold'>{organicPercentage}%</p>
          <p className='text-xs text-slate-400 mt-1'>{analytics.organicArea} Ha of {analytics.organicArea + analytics.conventionalArea} Ha</p>
        </div>

        <div className='bg-white rounded-2xl border p-4'>
          <div className='flex items-center justify-between mb-2'>
            <span className='text-xs text-slate-500'>Organic Input Usage</span>
            <Package className='w-4 h-4 text-emerald-600' />
          </div>
          <p className='text-3xl font-bold'>{analytics.organicInputUsage}%</p>
          <p className='text-xs text-slate-400 mt-1'>Of total inputs used</p>
        </div>

        <div className='bg-white rounded-2xl border p-4'>
          <div className='flex items-center justify-between mb-2'>
            <span className='text-xs text-slate-500'>Total Revenue (Est.)</span>
            <CircleDollarSign className='w-4 h-4 text-emerald-600' />
          </div>
          <p className='text-3xl font-bold'>Rs {totalRevenue.toLocaleString()}</p>
          <p className='text-xs text-slate-400 mt-1'>Annual projection</p>
        </div>

        <div className='bg-white rounded-2xl border p-4'>
          <div className='flex items-center justify-between mb-2'>
            <span className='text-xs text-slate-500'>Avg. Productivity</span>
            <Activity className='w-4 h-4 text-emerald-600' />
          </div>
          <p className='text-3xl font-bold'>Rs {(totalRevenue / totalArea).toFixed(0)}/Ha</p>
          <p className='text-xs text-slate-400 mt-1'>Revenue per hectare</p>
        </div>
      </div>

      <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
        <div className='bg-white rounded-2xl border p-5'>
          <div className='flex items-center justify-between mb-4'>
            <h3 className='font-bold'>Activity Distribution</h3>
            <Sparkles className='w-4 h-4 text-emerald-600' />
          </div>

          <div className='space-y-3'>
            {activityData.map((item, idx) => {
              const total = analytics.totalActivities;
              const percentage = ((item.value / total) * 100).toFixed(0);
              const maxVal = Math.max(...activityData.map(d => d.value));
              const barWidth = (item.value / maxVal) * 100;

              return (
                <div key={idx}>
                  <div className='flex items-center justify-between mb-1'>
                    <span className='text-sm text-slate-600'>{item.label}</span>
                    <span className='text-sm font-semibold'>{item.value} ({percentage}%)</span>
                  </div>
                  <div className='h-2.5 bg-slate-100 rounded-full w-full overflow-hidden'>
                    <div
                      className={item.color + ' h-full rounded-full'}
                      style={{ width: barWidth + '%' }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          <div className='mt-4 pt-3 border-t flex justify-between text-sm'>
            <span className='text-slate-500'>Total Activities</span>
            <span className='font-bold'>{analytics.totalActivities}</span>
          </div>
        </div>

        <div className='bg-white rounded-2xl border p-5'>
          <div className='flex items-center justify-between mb-4'>
            <h3 className='font-bold'>Crop Performance</h3>
            <TrendingUp className='w-4 h-4 text-emerald-600' />
          </div>

          <div className='space-y-3'>
            {cropData.map((crop, idx) => {
              const barWidth = (crop.production / maxProduction) * 100;

              return (
                <div key={idx} className='flex items-center gap-3'>
                  <span className='text-sm text-slate-600 w-20 truncate'>{crop.name}</span>
                  <div className='flex-1 h-6 bg-slate-100 rounded-full overflow-hidden'>
                    <div
                      className={crop.color + ' h-full rounded-full flex items-center'}
                      style={{ width: barWidth + '%' }}
                    />
                  </div>
                  <div className='text-right text-sm'>
                    <span className='font-semibold'>{crop.production.toLocaleString()} Kg</span>
                    <span className='text-xs text-slate-400 block'>Rs {crop.price}/Kg</span>
                  </div>
                </div>
              );
            })}
          </div>

          <div className='mt-4 pt-3 border-t flex justify-between text-sm'>
            <span className='text-slate-500'>Total Area</span>
            <span className='font-bold'>{totalArea.toFixed(1)} Ha</span>
          </div>
        </div>
      </div>

      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4'>
        <div className='bg-emerald-800 rounded-2xl p-4 text-white'>
          <div className='flex items-center gap-2 mb-2'>
            <Wheat className='w-4 h-4 text-emerald-200' />
            <span className='text-xs text-emerald-200/80'>Total Crops</span>
          </div>
          <p className='text-2xl font-bold'>{analytics.totalCrops}</p>
          <p className='text-xs text-emerald-200/70 mt-1'>Active crop cycles</p>
        </div>

        <div className='bg-blue-800 rounded-2xl p-4 text-white'>
          <div className='flex items-center gap-2 mb-2'>
            <Users className='w-4 h-4 text-blue-200' />
            <span className='text-xs text-blue-200/80'>IPM Activities</span>
          </div>
          <p className='text-2xl font-bold'>{analytics.ipmActivities}</p>
          <p className='text-xs text-blue-200/70 mt-1'>Pest management actions</p>
        </div>

        <div className='bg-amber-800 rounded-2xl p-4 text-white'>
          <div className='flex items-center gap-2 mb-2'>
            <CircleDollarSign className='w-4 h-4 text-amber-200' />
            <span className='text-xs text-amber-200/80'>Waste Recycled</span>
          </div>
          <p className='text-2xl font-bold'>{analytics.wasteRecycled} Kg</p>
          <p className='text-xs text-amber-200/70 mt-1'>Agricultural waste diverted</p>
        </div>

        <div className='bg-purple-800 rounded-2xl p-4 text-white'>
          <div className='flex items-center gap-2 mb-2'>
            <Leaf className='w-4 h-4 text-purple-200' />
            <span className='text-xs text-purple-200/80'>Compost Produced</span>
          </div>
          <p className='text-2xl font-bold'>{analytics.compostProduced} Kg</p>
          <p className='text-xs text-purple-200/70 mt-1'>Finished compost volume</p>
        </div>
      </div>

      <div className='bg-slate-800 rounded-3xl p-6 text-white'>
        <div className='flex items-start justify-between mb-4'>
          <div>
            <h3 className='font-bold text-sm text-slate-200'>Organic Compliance Score</h3>
            <p className='text-xs text-slate-400 mt-1'>Based on NPOP guidelines tracking</p>
          </div>
          <div className='text-right'>
            <div className='text-4xl font-bold'>{analytics.organicInputUsage}%</div>
            <div className='text-xs text-emerald-300 mt-1'>Compliance Rate</div>
          </div>
        </div>

        <div className='grid grid-cols-3 gap-4'>
          <div className='text-center'>
            <div className='text-2xl font-bold text-emerald-400'>{organicPercentage}%</div>
            <div className='text-xs text-slate-400'>Organic Land</div>
          </div>
          <div className='text-center'>
            <div className='text-2xl font-bold text-emerald-400'>{analytics.soilTests}</div>
            <div className='text-xs text-slate-400'>Soil Tests</div>
          </div>
          <div className='text-center'>
            <div className='text-2xl font-bold text-emerald-400'>{analytics.organicPractices}</div>
            <div className='text-xs text-slate-400'>Practices Logged</div>
          </div>
        </div>

        <div className='mt-4 pt-4 border-t border-slate-700'>
          <div className='flex items-center justify-between'>
            <span className='text-xs text-slate-400'>Overall Organic Readiness</span>
            <span className='text-sm font-bold text-emerald-400'>Good Progress</span>
          </div>
        </div>
      </div>

      <div className='bg-amber-50 rounded-2xl border p-4'>
        <div className='flex items-start gap-3'>
          <Activity className='w-4 h-4 text-amber-600 shrink-0 mt-0.5' />
          <div>
            <h4 className='font-bold text-amber-800 text-sm'>Analytics Disclaimer</h4>
            <p className='text-xs text-amber-700 mt-1'>
              These metrics are for your reference only. They do not constitute official organic certification. For certification, consult with APEDA-approved agencies.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
