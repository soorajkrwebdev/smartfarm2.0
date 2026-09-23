import React, { useState } from 'react';
import { useFarmData } from '../contexts/FarmContext';
import { FarmCard } from '../components/farms/FarmCard';
import { FarmFormModal } from '../components/farms/FarmFormModal';
import { ConfirmationDialog } from '../components/common/ConfirmationDialog';
import { EmptyState } from '../components/common/EmptyState';
import { Button } from '../components/common/Button';
import { Farm, OrganicStatus } from '../types';
import { Trees, Plus, Search, Filter } from 'lucide-react';

export const FarmsPage: React.FC = () => {
  const { farms, crops, activities, deleteFarm, selectedFarmId, setSelectedFarmId } = useFarmData();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('');

  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [farmToEdit, setFarmToEdit] = useState<Farm | null>(null);
  const [farmIdToDelete, setFarmIdToDelete] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Filtered farms
  const filteredFarms = farms.filter(f => {
    const matchesSearch = f.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.location.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = !statusFilter || f.organic_status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleDeleteConfirm = async () => {
    if (!farmIdToDelete) return;
    setIsDeleting(true);
    await deleteFarm(farmIdToDelete);
    setIsDeleting(false);
    setFarmIdToDelete(null);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight font-heading">
            My Farms & Plots
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Manage parcel boundaries, soil types, irrigation methods, and organic status
          </p>
        </div>

        <Button
          variant="primary"
          size="md"
          onClick={() => {
            setFarmToEdit(null);
            setIsAddModalOpen(true);
          }}
          icon={<Plus className="w-4 h-4" />}
        >
          Add New Farm
        </Button>
      </div>

      {/* Search and Filters */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search farm name or location..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3.5 py-2 text-xs rounded-xl border border-slate-200 bg-white placeholder:text-slate-400 focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="w-4 h-4 text-slate-400 shrink-0" />
          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            className="w-full sm:w-48 px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white text-slate-700 focus:outline-none focus:border-emerald-600 cursor-pointer"
          >
            <option value="">All Organic Statuses</option>
            <option value="certified_organic">Certified Organic</option>
            <option value="in_conversion">In Conversion</option>
            <option value="non_certified_organic">Non-Certified Organic</option>
            <option value="conventional">Conventional</option>
          </select>
        </div>
      </div>

      {/* Farms Grid or Empty State */}
      {filteredFarms.length === 0 ? (
        <EmptyState
          icon={<Trees className="w-8 h-8" />}
          title={searchQuery || statusFilter ? 'No matching farms found' : 'No farms added yet'}
          description={
            searchQuery || statusFilter
              ? 'Try adjusting your search criteria or resetting filters.'
              : 'Add your first farm plot with boundaries, soil information, and irrigation systems.'
          }
          actionText={searchQuery || statusFilter ? undefined : 'Add First Farm'}
          onAction={() => {
            setFarmToEdit(null);
            setIsAddModalOpen(true);
          }}
          actionIcon={<Plus className="w-4 h-4" />}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredFarms.map(farm => {
            const farmCrops = crops.filter(c => c.farm_id === farm.id);
            const farmActivities = activities.filter(a => a.farm_id === farm.id);
            const isSelected = selectedFarmId === farm.id;

            return (
              <FarmCard
                key={farm.id}
                farm={farm}
                cropsCount={farmCrops.length}
                activitiesCount={farmActivities.length}
                isSelected={isSelected}
                onSelectFarm={setSelectedFarmId}
                onEdit={f => {
                  setFarmToEdit(f);
                  setIsAddModalOpen(true);
                }}
                onDelete={id => setFarmIdToDelete(id)}
              />
            );
          })}
        </div>
      )}

      {/* Form Modal (Add / Edit) */}
      <FarmFormModal
        isOpen={isAddModalOpen}
        onClose={() => {
          setIsAddModalOpen(false);
          setFarmToEdit(null);
        }}
        farmToEdit={farmToEdit}
      />

      {/* Delete Confirmation Dialog */}
      <ConfirmationDialog
        isOpen={Boolean(farmIdToDelete)}
        onClose={() => setFarmIdToDelete(null)}
        onConfirm={handleDeleteConfirm}
        title="Delete Farm Plot?"
        message="Are you sure you want to delete this farm? This will also remove associated crops and logged activities."
        confirmText="Delete Farm"
        isDangerous
        loading={isDeleting}
      />
    </div>
  );
};
