import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { Farm, FarmCrop, CropActivity, FarmInput, OrganicInput, CropOrganicInput, PestObservation, IPMRecord, PesticideApplication, SoilTest, WaterTest, FarmWaste, CompostBatch } from '../types';
import { useAuth } from './AuthContext';
import { supabase } from '../lib/supabase';
import { DemoStorage } from '../lib/demoStorage';

interface FarmContextType {
  farms: Farm[];
  crops: FarmCrop[];
  activities: CropActivity[];
  inputs: FarmInput[];
  organicInputs: OrganicInput[];
  cropOrganicInputs: CropOrganicInput[];
  pestObservations: PestObservation[];
  ipmRecords: IPMRecord[];
  pesticideApplications: PesticideApplication[];
  selectedFarmId: string | null;
  selectedFarm: Farm | null;
  loading: boolean;
  setSelectedFarmId: (id: string | null) => void;
  // Farm Actions
  addFarm: (data: Omit<Farm, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => Promise<{ data?: Farm; error?: string }>;
  updateFarm: (id: string, data: Partial<Farm>) => Promise<{ data?: Farm; error?: string }>;
  deleteFarm: (id: string) => Promise<{ error?: string }>;
  // Crop Actions
  addCrop: (data: Omit<FarmCrop, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => Promise<{ data?: FarmCrop; error?: string }>;
  updateCrop: (id: string, data: Partial<FarmCrop>) => Promise<{ data?: FarmCrop; error?: string }>;
  deleteCrop: (id: string) => Promise<{ error?: string }>;
  // Activity Actions
  addActivity: (data: Omit<CropActivity, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => Promise<{ data?: CropActivity; error?: string }>;
  updateActivity: (id: string, data: Partial<CropActivity>) => Promise<{ data?: CropActivity; error?: string }>;
  deleteActivity: (id: string) => Promise<{ error?: string }>;
  // Input Actions (Phase 2)
  addInput: (data: Omit<FarmInput, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => Promise<{ data?: FarmInput; error?: string }>;
  updateInput: (id: string, data: Partial<FarmInput>) => Promise<{ data?: FarmInput; error?: string }>;
  deleteInput: (id: string) => Promise<{ error?: string }>;
  // Pest & IPM Actions (Phase 3)
  addPestObservation: (data: Omit<PestObservation, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => Promise<{ data?: PestObservation; error?: string }>;
  deletePestObservation: (id: string) => Promise<{ error?: string }>;
  addIPMRecord: (data: Omit<IPMRecord, 'id' | 'user_id' | 'created_at'>) => Promise<{ data?: IPMRecord; error?: string }>;
  addPesticideApplication: (data: Omit<PesticideApplication, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => Promise<{ data?: PesticideApplication; error?: string }>;
  // Phase 4: Soil, Water, Waste, Compost
  soilTests: SoilTest[];
  waterTests: WaterTest[];
  farmWaste: FarmWaste[];
  compostBatches: CompostBatch[];
  // Refresh
  refreshData: () => Promise<void>;
}

const FarmContext = createContext<FarmContextType | undefined>(undefined);

export const FarmProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, isDemoMode, isConfigured } = useAuth();
  const [farms, setFarms] = useState<Farm[]>([]);
  const [crops, setCrops] = useState<FarmCrop[]>([]);
  const [activities, setActivities] = useState<CropActivity[]>([]);
  const [inputs, setInputs] = useState<FarmInput[]>([]);
  const [organicInputs, setOrganicInputs] = useState<OrganicInput[]>([]);
  const [cropOrganicInputs, setCropOrganicInputs] = useState<CropOrganicInput[]>([]);
  const [pestObservations, setPestObservations] = useState<PestObservation[]>([]);
  const [ipmRecords, setIpmRecords] = useState<IPMRecord[]>([]);
  const [pesticideApplications, setPesticideApplications] = useState<PesticideApplication[]>([]);
  const [soilTests, setSoilTests] = useState<SoilTest[]>([]);
  const [waterTests, setWaterTests] = useState<WaterTest[]>([]);
  const [farmWaste, setFarmWaste] = useState<FarmWaste[]>([]);
  const [compostBatches, setCompostBatches] = useState<CompostBatch[]>([]);
  const [selectedFarmId, setSelectedFarmId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const useLiveSupabase = Boolean(isConfigured && !isDemoMode && supabase && user);

  const refreshData = useCallback(async () => {
    setLoading(true);
    try {
      if (useLiveSupabase && supabase && user) {
        // 1. Fetch Farms
        const { data: farmsData, error: farmsError } = await supabase
          .from('farms')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

        if (farmsError) throw farmsError;

        // 2. Fetch Crops
        const { data: cropsData, error: cropsError } = await supabase
          .from('farm_crops')
          .select('*, farms(name)')
          .eq('user_id', user.id)
          .order('planting_date', { ascending: false });

        if (cropsError) throw cropsError;

        const formattedCrops: FarmCrop[] = (cropsData || []).map((c: any) => ({
          ...c,
          farm_name: c.farms?.name || 'Unknown Farm',
        }));

        // 3. Fetch Activities
        const { data: actData, error: actError } = await supabase
          .from('crop_activities')
          .select('*, farms(name), farm_crops(crop_name)')
          .eq('user_id', user.id)
          .order('activity_date', { ascending: false });

        if (actError) throw actError;

        const formattedActs: CropActivity[] = (actData || []).map((a: any) => ({
          ...a,
          farm_name: a.farms?.name || 'Unknown Farm',
          crop_name: a.farm_crops?.crop_name || 'General Farm Activity',
        }));

        // 4. Fetch Farm Inputs
        const { data: inpsData, error: inpsError } = await supabase
          .from('farm_inputs')
          .select('*, farms(name), farm_crops(crop_name)')
          .eq('user_id', user.id)
          .order('purchase_date', { ascending: false });

        if (inpsError && inpsError.code !== '42P01') {
          console.warn('Notice fetching farm_inputs:', inpsError.message);
        }

        const formattedInps: FarmInput[] = (inpsData || []).map((i: any) => ({
          ...i,
          farm_name: i.farms?.name || 'Unknown Farm',
          crop_name: i.farm_crops?.crop_name || 'General Inventory',
        }));

        // 5. Fetch Public Organic Knowledge Library
        const { data: orgData } = await supabase
          .from('organic_inputs')
          .select('*')
          .order('name');

        const { data: coiData } = await supabase
          .from('crop_organic_inputs')
          .select('*, organic_inputs(*)');

        setFarms(farmsData || []);
        setCrops(formattedCrops);
        setActivities(formattedActs);
        setInputs(formattedInps.length > 0 ? formattedInps : DemoStorage.getInputs());
        setOrganicInputs(orgData && orgData.length > 0 ? orgData : DemoStorage.getOrganicInputs());
        setCropOrganicInputs(coiData && coiData.length > 0 ? coiData : DemoStorage.getCropOrganicInputs());

        // Fetch Phase 3: Pest & IPM data
        const { data: pestData, error: pestError } = await supabase
          .from('pest_observations')
          .select('*, farms(name), farm_crops(crop_name)')
          .eq('user_id', user.id)
          .order('observation_date', { ascending: false });

        if (pestError && pestError.code !== '42P01') {
          console.warn('Notice fetching pest_observations:', pestError.message);
        }

        const { data: ipmData } = await supabase
          .from('ipm_records')
          .select('*, farms(name), farm_crops(crop_name)')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

        const { data: pestAppData } = await supabase
          .from('pesticide_applications')
          .select('*, farms(name), farm_crops(crop_name), pest_observations(pest_name)')
          .eq('user_id', user.id)
          .order('application_date', { ascending: false });

        setPestObservations(pestData && pestData.length > 0 ? pestData : DemoStorage.getPestObservations());
        setIpmRecords(ipmData && ipmData.length > 0 ? ipmData : DemoStorage.getIPMRecords());
        setPesticideApplications(pestAppData && pestAppData.length > 0 ? pestAppData : DemoStorage.getPesticideApplications());

        if (!selectedFarmId && farmsData && farmsData.length > 0) {
          setSelectedFarmId(farmsData[0].id);
        }
      } else {
        // Local Demo Storage mode
        const demoFarms = DemoStorage.getFarms();
        const demoCrops = DemoStorage.getCrops();
        const demoActs = DemoStorage.getActivities();
        const demoInps = DemoStorage.getInputs();
        const demoOrg = DemoStorage.getOrganicInputs();
        const demoCoi = DemoStorage.getCropOrganicInputs();

        setFarms(demoFarms);
        setCrops(demoCrops);
        setActivities(demoActs);
        setInputs(demoInps);
        setOrganicInputs(demoOrg);
        setCropOrganicInputs(demoCoi);
        setPestObservations(DemoStorage.getPestObservations());
        setIpmRecords(DemoStorage.getIPMRecords());
        setPesticideApplications(DemoStorage.getPesticideApplications());
        setSoilTests(DemoStorage.getSoilTests());
        setWaterTests(DemoStorage.getWaterTests());
        setFarmWaste(DemoStorage.getFarmWaste());
        setCompostBatches(DemoStorage.getCompostBatches());

        if (!selectedFarmId && demoFarms.length > 0) {
          setSelectedFarmId(demoFarms[0].id);
        }
      }
    } catch (err: any) {
      console.error('Error fetching farm data:', err);
    } finally {
      setLoading(false);
    }
  }, [useLiveSupabase, user, selectedFarmId]);

  useEffect(() => {
    refreshData();
  }, [refreshData]);

  // Derived selected farm
  const selectedFarm = farms.find(f => f.id === selectedFarmId) || farms[0] || null;

  // Farm Actions
  const addFarm = async (data: Omit<Farm, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => {
    try {
      if (useLiveSupabase && supabase && user) {
        const { data: newFarm, error } = await supabase
          .from('farms')
          .insert({
            ...data,
            user_id: user.id,
          })
          .select()
          .single();

        if (error) return { error: error.message };
        setFarms(prev => [newFarm, ...prev]);
        setSelectedFarmId(newFarm.id);
        return { data: newFarm };
      } else {
        const newFarm = DemoStorage.saveFarm({
          ...data,
          user_id: user?.id || 'demo-farmer-01',
        });
        setFarms(prev => [newFarm, ...prev]);
        setSelectedFarmId(newFarm.id);
        return { data: newFarm };
      }
    } catch (err: any) {
      return { error: err.message };
    }
  };

  const updateFarm = async (id: string, data: Partial<Farm>) => {
    try {
      if (useLiveSupabase && supabase) {
        const { data: updated, error } = await supabase
          .from('farms')
          .update({
            ...data,
            updated_at: new Date().toISOString(),
          })
          .eq('id', id)
          .select()
          .single();

        if (error) return { error: error.message };
        setFarms(prev => prev.map(f => f.id === id ? updated : f));
        return { data: updated };
      } else {
        const existing = farms.find(f => f.id === id);
        if (!existing) return { error: 'Farm not found' };
        const updated = DemoStorage.saveFarm({ ...existing, ...data, id });
        setFarms(prev => prev.map(f => f.id === id ? updated : f));
        return { data: updated };
      }
    } catch (err: any) {
      return { error: err.message };
    }
  };

  const deleteFarm = async (id: string) => {
    try {
      if (useLiveSupabase && supabase) {
        const { error } = await supabase.from('farms').delete().eq('id', id);
        if (error) return { error: error.message };
      } else {
        DemoStorage.deleteFarm(id);
      }
      setFarms(prev => prev.filter(f => f.id !== id));
      setCrops(prev => prev.filter(c => c.farm_id !== id));
      setActivities(prev => prev.filter(a => a.farm_id !== id));
      setInputs(prev => prev.filter(i => i.farm_id !== id));
      if (selectedFarmId === id) {
        const remaining = farms.filter(f => f.id !== id);
        setSelectedFarmId(remaining.length > 0 ? remaining[0].id : null);
      }
      return {};
    } catch (err: any) {
      return { error: err.message };
    }
  };

  // Crop Actions
  const addCrop = async (data: Omit<FarmCrop, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => {
    try {
      if (useLiveSupabase && supabase && user) {
        const { data: newCrop, error } = await supabase
          .from('farm_crops')
          .insert({
            ...data,
            user_id: user.id,
          })
          .select('*, farms(name)')
          .single();

        if (error) return { error: error.message };
        const formatted: FarmCrop = {
          ...newCrop,
          farm_name: newCrop.farms?.name || 'Unknown Farm',
        };
        setCrops(prev => [formatted, ...prev]);
        return { data: formatted };
      } else {
        const newCrop = DemoStorage.saveCrop({
          ...data,
          user_id: user?.id || 'demo-farmer-01',
        });
        setCrops(prev => [newCrop, ...prev]);
        return { data: newCrop };
      }
    } catch (err: any) {
      return { error: err.message };
    }
  };

  const updateCrop = async (id: string, data: Partial<FarmCrop>) => {
    try {
      if (useLiveSupabase && supabase) {
        const { data: updated, error } = await supabase
          .from('farm_crops')
          .update({
            ...data,
            updated_at: new Date().toISOString(),
          })
          .eq('id', id)
          .select('*, farms(name)')
          .single();

        if (error) return { error: error.message };
        const formatted: FarmCrop = {
          ...updated,
          farm_name: updated.farms?.name || 'Unknown Farm',
        };
        setCrops(prev => prev.map(c => c.id === id ? formatted : c));
        return { data: formatted };
      } else {
        const existing = crops.find(c => c.id === id);
        if (!existing) return { error: 'Crop not found' };
        const updated = DemoStorage.saveCrop({ ...existing, ...data, id });
        setCrops(prev => prev.map(c => c.id === id ? updated : c));
        return { data: updated };
      }
    } catch (err: any) {
      return { error: err.message };
    }
  };

  const deleteCrop = async (id: string) => {
    try {
      if (useLiveSupabase && supabase) {
        const { error } = await supabase.from('farm_crops').delete().eq('id', id);
        if (error) return { error: error.message };
      } else {
        DemoStorage.deleteCrop(id);
      }
      setCrops(prev => prev.filter(c => c.id !== id));
      return {};
    } catch (err: any) {
      return { error: err.message };
    }
  };

  // Activity Actions
  const addActivity = async (data: Omit<CropActivity, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => {
    try {
      if (useLiveSupabase && supabase && user) {
        const { data: newAct, error } = await supabase
          .from('crop_activities')
          .insert({
            ...data,
            user_id: user.id,
          })
          .select('*, farms(name), farm_crops(crop_name)')
          .single();

        if (error) return { error: error.message };
        const formatted: CropActivity = {
          ...newAct,
          farm_name: newAct.farms?.name || 'Unknown Farm',
          crop_name: newAct.farm_crops?.crop_name || 'General Farm Activity',
        };
        setActivities(prev => [formatted, ...prev]);
        return { data: formatted };
      } else {
        const newAct = DemoStorage.saveActivity({
          ...data,
          user_id: user?.id || 'demo-farmer-01',
        });
        setActivities(prev => [newAct, ...prev]);
        return { data: newAct };
      }
    } catch (err: any) {
      return { error: err.message };
    }
  };

  const updateActivity = async (id: string, data: Partial<CropActivity>) => {
    try {
      if (useLiveSupabase && supabase) {
        const { data: updated, error } = await supabase
          .from('crop_activities')
          .update({
            ...data,
            updated_at: new Date().toISOString(),
          })
          .eq('id', id)
          .select('*, farms(name), farm_crops(crop_name)')
          .single();

        if (error) return { error: error.message };
        const formatted: CropActivity = {
          ...updated,
          farm_name: updated.farms?.name || 'Unknown Farm',
          crop_name: updated.farm_crops?.crop_name || 'General Farm Activity',
        };
        setActivities(prev => prev.map(a => a.id === id ? formatted : a));
        return { data: formatted };
      } else {
        const existing = activities.find(a => a.id === id);
        if (!existing) return { error: 'Activity not found' };
        const updated = DemoStorage.saveActivity({ ...existing, ...data, id });
        setActivities(prev => prev.map(a => a.id === id ? updated : a));
        return { data: updated };
      }
    } catch (err: any) {
      return { error: err.message };
    }
  };

  const deleteActivity = async (id: string) => {
    try {
      if (useLiveSupabase && supabase) {
        const { error } = await supabase.from('crop_activities').delete().eq('id', id);
        if (error) return { error: error.message };
      } else {
        DemoStorage.deleteActivity(id);
      }
      setActivities(prev => prev.filter(a => a.id !== id));
      return {};
    } catch (err: any) {
      return { error: err.message };
    }
  };

  // Phase 2: Input Actions
  const addInput = async (data: Omit<FarmInput, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => {
    try {
      if (useLiveSupabase && supabase && user) {
        const { data: newInp, error } = await supabase
          .from('farm_inputs')
          .insert({
            ...data,
            user_id: user.id,
          })
          .select('*, farms(name), farm_crops(crop_name)')
          .single();

        if (error) return { error: error.message };
        const formatted: FarmInput = {
          ...newInp,
          farm_name: newInp.farms?.name || 'Unknown Farm',
          crop_name: newInp.farm_crops?.crop_name || 'General Inventory',
        };
        setInputs(prev => [formatted, ...prev]);
        return { data: formatted };
      } else {
        const newInp = DemoStorage.saveInput({
          ...data,
          user_id: user?.id || 'demo-farmer-01',
        });
        setInputs(prev => [newInp, ...prev]);
        return { data: newInp };
      }
    } catch (err: any) {
      return { error: err.message };
    }
  };

  const updateInput = async (id: string, data: Partial<FarmInput>) => {
    try {
      if (useLiveSupabase && supabase) {
        const { data: updated, error } = await supabase
          .from('farm_inputs')
          .update({
            ...data,
            updated_at: new Date().toISOString(),
          })
          .eq('id', id)
          .select('*, farms(name), farm_crops(crop_name)')
          .single();

        if (error) return { error: error.message };
        const formatted: FarmInput = {
          ...updated,
          farm_name: updated.farms?.name || 'Unknown Farm',
          crop_name: updated.farm_crops?.crop_name || 'General Inventory',
        };
        setInputs(prev => prev.map(i => i.id === id ? formatted : i));
        return { data: formatted };
      } else {
        const existing = inputs.find(i => i.id === id);
        if (!existing) return { error: 'Input not found' };
        const updated = DemoStorage.saveInput({ ...existing, ...data, id });
        setInputs(prev => prev.map(i => i.id === id ? updated : i));
        return { data: updated };
      }
    } catch (err: any) {
      return { error: err.message };
    }
  };

  const deleteInput = async (id: string) => {
    try {
      if (useLiveSupabase && supabase) {
        const { error } = await supabase.from('farm_inputs').delete().eq('id', id);
        if (error) return { error: error.message };
      } else {
        DemoStorage.deleteInput(id);
      }
      setInputs(prev => prev.filter(i => i.id !== id));
      return {};
    } catch (err: any) {
      return { error: err.message };
    }
  };

  // Phase 3: Pest Observation Actions
  const addPestObservation = async (data: Omit<PestObservation, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => {
    try {
      if (useLiveSupabase && supabase && user) {
        const { data: newObs, error } = await supabase
          .from('pest_observations')
          .insert({
            ...data,
            user_id: user.id,
          })
          .select('*, farms(name), farm_crops(crop_name)')
          .single();

        if (error) return { error: error.message };
        const formatted: PestObservation = {
          ...newObs,
          farm_name: newObs.farms?.name || 'Unknown Farm',
          crop_name: newObs.farm_crops?.crop_name || 'General Crop',
        };
        setPestObservations(prev => [formatted, ...prev]);
        return { data: formatted };
      } else {
        const newObs = DemoStorage.savePestObservation({
          ...data,
          user_id: user?.id || 'demo-farmer-01',
        });
        setPestObservations(prev => [newObs, ...prev]);
        return { data: newObs };
      }
    } catch (err: any) {
      return { error: err.message };
    }
  };

  const deletePestObservation = async (id: string) => {
    try {
      if (useLiveSupabase && supabase) {
        const { error } = await supabase.from('pest_observations').delete().eq('id', id);
        if (error) return { error: error.message };
      } else {
        DemoStorage.deletePestObservation(id);
      }
      setPestObservations(prev => prev.filter(o => o.id !== id));
      return {};
    } catch (err: any) {
      return { error: err.message };
    }
  };

  const addIPMRecord = async (data: Omit<IPMRecord, 'id' | 'user_id' | 'created_at'>) => {
    try {
      if (useLiveSupabase && supabase && user) {
        const { data: newRecord, error } = await supabase
          .from('ipm_records')
          .insert({
            ...data,
            user_id: user.id,
          })
          .select('*, farms(name), farm_crops(crop_name)')
          .single();

        if (error) return { error: error.message };
        const formatted: IPMRecord = {
          ...newRecord,
          farm_name: newRecord.farms?.name || 'Unknown Farm',
          crop_name: newRecord.farm_crops?.crop_name || 'General Crop',
        };
        setIpmRecords(prev => [formatted, ...prev]);
        return { data: formatted };
      } else {
        const newRecord = DemoStorage.saveIPMRecord({
          ...data,
          user_id: user?.id || 'demo-farmer-01',
        });
        setIpmRecords(prev => [newRecord, ...prev]);
        return { data: newRecord };
      }
    } catch (err: any) {
      return { error: err.message };
    }
  };

  const addPesticideApplication = async (data: Omit<PesticideApplication, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => {
    try {
      if (useLiveSupabase && supabase && user) {
        const { data: newApp, error } = await supabase
          .from('pesticide_applications')
          .insert({
            ...data,
            user_id: user.id,
          })
          .select('*, farms(name), farm_crops(crop_name), pest_observations(pest_name)')
          .single();

        if (error) return { error: error.message };
        const formatted: PesticideApplication = {
          ...newApp,
          farm_name: newApp.farms?.name || 'Unknown Farm',
          crop_name: newApp.farm_crops?.crop_name || 'General Crop',
          pest_name: newApp.pest_observations?.pest_name,
        };
        setPesticideApplications(prev => [formatted, ...prev]);
        return { data: formatted };
      } else {
        const newApp = DemoStorage.savePesticideApplication({
          ...data,
          user_id: user?.id || 'demo-farmer-01',
        });
        setPesticideApplications(prev => [newApp, ...prev]);
        return { data: newApp };
      }
    } catch (err: any) {
      return { error: err.message };
    }
  };

  return (
    <FarmContext.Provider
      value={{
        farms,
        crops,
        activities,
        inputs,
        organicInputs,
        cropOrganicInputs,
        pestObservations,
        ipmRecords,
        pesticideApplications,
        soilTests,
        waterTests,
        farmWaste,
        compostBatches,
        selectedFarmId,
        selectedFarm,
        loading,
        setSelectedFarmId,
        addFarm,
        updateFarm,
        deleteFarm,
        addCrop,
        updateCrop,
        deleteCrop,
        addActivity,
        updateActivity,
        deleteActivity,
        addInput,
        updateInput,
        deleteInput,
        addPestObservation,
        deletePestObservation,
        addIPMRecord,
        addPesticideApplication,
        refreshData,
      }}
    >
      {children}
    </FarmContext.Provider>
  );
};

export const useFarmData = () => {
  const context = useContext(FarmContext);
  if (!context) {
    throw new Error('useFarmData must be used within a FarmProvider');
  }
  return context;
};
