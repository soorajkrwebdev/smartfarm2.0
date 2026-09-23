import React, { useState } from 'react';
import { EmptyState } from '../../components/common/EmptyState';
import { Badge } from '../../components/common/Badge';
import { Briefcase, Search, MapPin, Users, Clock, Plus, Filter, Share2, Star } from 'lucide-react';
import { useFarmData } from '../../contexts/FarmContext';

interface FarmWorkPost {
  id: string;
  farmId: string;
  farmName: string;
  farmLocation: string;
  title: string;
  description: string;
  workType: string;
  startDate: string;
  endDate: string;
  estimatedWorkers: number;
  status: string;
  createdAt: string;
  postedBy: string;
}

const DEMO_POSTS: FarmWorkPost[] = [
  {
    id: 'fw-001',
    farmId: 'farm-001',
    farmName: 'Green Canopy Organic Homestead',
    farmLocation: 'Sakleshpur, Karnataka',
    title: 'Arecanut Harvesting Help Needed',
    description: 'Looking for 4-5 workers for arecanut harvesting over 2 days.',
    workType: 'Harvesting',
    startDate: '25 Sep 2026',
    endDate: '26 Sep 2026',
    estimatedWorkers: 5,
    status: 'open',
    createdAt: '23 Sep 2026',
    postedBy: 'Ramesh Patel'
  },
  {
    id: 'fw-002',
    farmId: 'farm-002',
    farmName: 'Evergreen Spice Farm',
    farmLocation: 'Kodagu, Karnataka',
    title: 'Coffee Pruning Season Work',
    description: 'Seasonal coffee pruning work for 10 days.',
    workType: 'Pruning',
    startDate: '28 Sep 2026',
    endDate: '07 Oct 2026',
    estimatedWorkers: 8,
    status: 'open',
    createdAt: '23 Sep 2026',
    postedBy: 'Lakshmi Nair'
  },
  {
    id: 'fw-003',
    farmId: 'farm-003',
    farmName: 'Nature Basket Farm',
    farmLocation: 'Wayanad, Kerala',
    title: 'Banana Bunch Transportation',
    description: 'Need help transporting 200+ banana bunches from field to storage.',
    workType: 'Transport',
    startDate: '24 Sep 2026',
    endDate: '24 Sep 2026',
    estimatedWorkers: 3,
    status: 'open',
    createdAt: '23 Sep 2026',
    postedBy: 'Jose Thomas'
  },
];

export const FarmWorkBoardPage: React.FC = () => {
  const { farms } = useFarmData();
  const [q, setQ] = useState('');
  const [workTypeFilter, setWorkTypeFilter] = useState('all');
  const [posts] = useState<FarmWorkPost[]>(DEMO_POSTS);

  const workTypes = ['all', 'Harvesting', 'Pruning', 'Weeding', 'Planting', 'Irrigation', 'Processing', 'Transport', 'Other'];

  const filteredPosts = posts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(q.toLowerCase()) ||
      post.description.toLowerCase().includes(q.toLowerCase()) ||
      post.farmName.toLowerCase().includes(q.toLowerCase());
    const matchesType = workTypeFilter === 'all' || post.workType === workTypeFilter;
    return matchesSearch && matchesType && post.status === 'open';
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      case 'in-progress': return 'bg-amber-100 text-amber-700 border-amber-200';
      case 'completed': return 'bg-slate-100 text-slate-600 border-slate-200';
      case 'cancelled': return 'bg-rose-100 text-rose-700 border-rose-200';
      default: return 'bg-slate-100 text-slate-600';
    }
  };

  return (
    <div className='space-y-6'>
      <div className='flex items-center justify-between'>
        <div>
          <h1 className='text-xl font-bold text-slate-800'>Farm Work Board</h1>
          <p className='text-sm text-slate-500 mt-0.5'>Find or post agricultural work opportunities</p>
        </div>
        <Badge variant='emerald' size='sm'>Community Board</Badge>
      </div>

      <div className='grid grid-cols-1 sm:grid-cols-3 gap-4'>
        <div className='bg-white rounded-2xl border p-4'>
          <div className='flex items-center gap-3'>
            <div className='p-2 bg-emerald-100 rounded-xl'>
              <Briefcase className='w-5 h-5 text-emerald-600' />
            </div>
            <div>
              <p className='text-2xl font-bold'>{filteredPosts.length}</p>
              <p className='text-xs text-slate-500'>Open Positions</p>
            </div>
          </div>
        </div>
        <div className='bg-white rounded-2xl border p-4'>
          <div className='flex items-center gap-3'>
            <div className='p-2 bg-blue-100 rounded-xl'>
              <Users className='w-5 h-5 text-blue-600' />
            </div>
            <div>
              <p className='text-2xl font-bold'>{posts.reduce((sum, p) => sum + p.estimatedWorkers, 0)}</p>
              <p className='text-xs text-slate-500'>Workers Needed</p>
            </div>
          </div>
        </div>
        <div className='bg-white rounded-2xl border p-4'>
          <div className='flex items-center gap-3'>
            <div className='p-2 bg-amber-100 rounded-xl'>
              <Star className='w-5 h-5 text-amber-600' />
            </div>
            <div>
              <p className='text-2xl font-bold'>2</p>
              <p className='text-xs text-slate-500'>Local Farms Posting</p>
            </div>
          </div>
        </div>
      </div>

      <div className='grid grid-cols-1 lg:grid-cols-4 gap-6'>
        <div className='lg:col-span-1'>
          <div className='bg-white rounded-2xl border p-4'>
            <div className='flex items-center justify-between mb-4'>
              <h3 className='font-bold'>Filter by Work Type</h3>
              <Filter className='w-4 h-4 text-slate-400' />
            </div>
            <div className='space-y-1.5'>
              {workTypes.map(type => (
                <button
                  key={type}
                  onClick={() => setWorkTypeFilter(type)}
                  className='w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium cursor-pointer bg-slate-50 hover:bg-slate-100 text-slate-600'
                >
                  <span className='flex items-center gap-2'>
                    {type === 'all' ? 'All Types' : type}
                  </span>
                </button>
              ))}
            </div>

            <div className='mt-4 pt-3 border-t'>
              <h4 className='font-bold text-sm mb-2'>How it Works</h4>
              <div className='space-y-2 text-xs text-slate-500'>
                <div className='flex items-start gap-2'>
                  <span className='w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-[10px] font-bold shrink-0'>1</span>
                  <span>Farmers post work needs</span>
                </div>
                <div className='flex items-start gap-2'>
                  <span className='w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-[10px] font-bold shrink-0'>2</span>
                  <span>Workers discover opportunities</span>
                </div>
                <div className='flex items-start gap-2'>
                  <span className='w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-[10px] font-bold shrink-0'>3</span>
                  <span>Connect directly</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className='lg:col-span-3'>
          <div className='flex items-center justify-between mb-4'>
            <h3 className='font-bold'>Available Work Opportunities</h3>
            <div className='relative w-64'>
              <Search className='absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400' />
              <input
                type='text'
                placeholder='Search posts...'
                value={q}
                onChange={e => setQ(e.target.value)}
                className='pl-9 pr-3 py-1.5 text-sm bg-slate-50 rounded-xl border border-slate-200 w-full focus:border-emerald-500 outline-none'
              />
            </div>
          </div>

          {filteredPosts.length > 0 ? (
            <div className='space-y-3'>
              {filteredPosts.map(post => (
                <div key={post.id} className='bg-white rounded-2xl border p-4'>
                  <div className='flex items-start justify-between mb-3'>
                    <div>
                      <div className='flex items-center gap-2 mb-1'>
                        <Badge className={getStatusColor(post.status)}>
                          {post.status === 'open' ? 'Open' : post.status}
                        </Badge>
                        <Badge variant='slate' size='sm'>{post.workType}</Badge>
                      </div>
                      <h4 className='font-bold text-slate-800'>{post.title}</h4>
                    </div>
                    <button className='p-2 hover:bg-emerald-50 rounded-xl text-emerald-600' title='Share'>
                      <Share2 className='w-4 h-4' />
                    </button>
                  </div>

                  <div className='bg-slate-50 rounded-xl p-3 mb-3'>
                    <p className='text-sm text-slate-600'>{post.description}</p>
                  </div>

                  <div className='flex items-center justify-between flex-wrap gap-2'>
                    <div className='flex items-center gap-3'>
                      <div className='flex items-center gap-1 text-xs text-slate-500'>
                        <MapPin className='w-3.5 h-3.5' />
                        <span className='truncate max-w-[120px]'>{post.farmLocation}</span>
                      </div>
                      <div className='flex items-center gap-1 text-xs text-slate-500'>
                        <Users className='w-3.5 h-3.5' />
                        <span>{post.estimatedWorkers} workers</span>
                      </div>
                    </div>
                    <div className='flex items-center gap-3 text-xs'>
                      <span className='text-slate-400'>
                        <Clock className='w-3.5 h-3.5 inline mr-1' />
                        {post.startDate} - {post.endDate}
                      </span>
                      <span className='text-slate-600'>Posted by {post.postedBy}</span>
                    </div>
                  </div>

                  {post.farmId === farms[0]?.id && (
                    <div className='mt-3 pt-3 border-t flex items-center gap-2'>
                      <span className='text-[10px] text-emerald-600'>Your farm</span>
                      <button className='text-[10px] px-2 py-1 bg-emerald-100 text-emerald-700 rounded-md'>Edit Post</button>
                      <button className='text-[10px] px-2 py-1 bg-rose-100 text-rose-700 rounded-md ml-auto'>Close Position</button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <EmptyState icon={<Briefcase className='w-8 h-8' />} title='No work posts found' description='Try adjusting your filters.' />
          )}
        </div>
      </div>

      <div className='bg-emerald-800 rounded-3xl p-5 text-white flex items-center justify-between'>
        <div className='flex items-start gap-4'>
          <Briefcase className='w-6 h-6 text-emerald-200' />
          <div>
            <h3 className='font-bold text-sm'>Post a Work Opportunity</h3>
            <p className='text-sm text-emerald-200/80 mt-1'>
              Help your community find work on your farm.
            </p>
          </div>
        </div>
        <button className='px-4 py-2 bg-emerald-600 rounded-xl text-sm font-semibold'>
          <Plus className='w-4 h-4 inline mr-1' /> Post Work
        </button>
      </div>
    </div>
  );
};
