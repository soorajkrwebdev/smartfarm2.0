import { supabase } from '../lib/supabase';
import { FarmExpense, CropHarvest } from '../types';

export async function fetchFarmExpenses(userId: string): Promise<FarmExpense[]> {
  if (!supabase || !userId) return [];
  try {
    const { data, error } = await supabase
      .from('farm_expenses')
      .select('*, farms(name), farm_crops(crop_name)')
      .eq('user_id', userId)
      .order('expense_date', { ascending: false });

    if (error) {
      console.warn('Notice fetching farm_expenses:', error.message);
      return [];
    }

    return (data || []).map((row: any) => ({
      ...row,
      farm_name: row.farms?.name || 'Farm',
      crop_name: row.farm_crops?.crop_name || 'General Farm',
    }));
  } catch (err) {
    console.error('Failed to load expenses:', err);
    return [];
  }
}

export async function createFarmExpense(
  userId: string,
  input: Omit<FarmExpense, 'id' | 'user_id' | 'created_at' | 'updated_at'>
): Promise<{ data?: FarmExpense; error?: string }> {
  if (!supabase || !userId) return { error: 'Authentication required' };
  try {
    const { data, error } = await supabase
      .from('farm_expenses')
      .insert({
        user_id: userId,
        farm_id: input.farm_id,
        crop_id: input.crop_id || null,
        category: input.category,
        amount: Number(input.amount),
        expense_date: input.expense_date,
        description: input.description,
        vendor_or_source: input.vendor_or_source || null,
        notes: input.notes || null,
      })
      .select('*, farms(name), farm_crops(crop_name)')
      .single();

    if (error) return { error: error.message };
    return {
      data: {
        ...data,
        farm_name: data.farms?.name || 'Farm',
        crop_name: data.farm_crops?.crop_name || 'General Farm',
      },
    };
  } catch (err: any) {
    return { error: err.message };
  }
}

export async function deleteFarmExpense(id: string): Promise<{ error?: string }> {
  if (!supabase) return { error: 'Database unavailable' };
  try {
    const { error } = await supabase.from('farm_expenses').delete().eq('id', id);
    if (error) return { error: error.message };
    return {};
  } catch (err: any) {
    return { error: err.message };
  }
}

export async function fetchCropHarvests(userId: string): Promise<CropHarvest[]> {
  if (!supabase || !userId) return [];
  try {
    const { data, error } = await supabase
      .from('crop_harvests')
      .select('*, farms(name), farm_crops(crop_name)')
      .eq('user_id', userId)
      .order('harvest_date', { ascending: false });

    if (error) {
      console.warn('Notice fetching crop_harvests:', error.message);
      return [];
    }

    return (data || []).map((row: any) => ({
      ...row,
      farm_name: row.farms?.name || 'Farm',
      crop_name: row.farm_crops?.crop_name || 'Crop',
    }));
  } catch (err) {
    console.error('Failed to load crop harvests:', err);
    return [];
  }
}

export async function createCropHarvest(
  userId: string,
  input: Omit<CropHarvest, 'id' | 'user_id' | 'created_at' | 'updated_at'>
): Promise<{ data?: CropHarvest; error?: string }> {
  if (!supabase || !userId) return { error: 'Authentication required' };
  try {
    const revenue =
      input.revenue !== undefined
        ? Number(input.revenue)
        : input.sale_price !== undefined
        ? Number(input.quantity) * Number(input.sale_price)
        : 0;

    const { data, error } = await supabase
      .from('crop_harvests')
      .insert({
        user_id: userId,
        farm_id: input.farm_id,
        crop_id: input.crop_id,
        harvest_date: input.harvest_date,
        quantity: Number(input.quantity),
        unit: input.unit,
        quality: input.quality,
        sale_price: input.sale_price ? Number(input.sale_price) : null,
        revenue,
        market_name: input.market_name || null,
        notes: input.notes || null,
      })
      .select('*, farms(name), farm_crops(crop_name)')
      .single();

    if (error) return { error: error.message };
    return {
      data: {
        ...data,
        farm_name: data.farms?.name || 'Farm',
        crop_name: data.farm_crops?.crop_name || 'Crop',
      },
    };
  } catch (err: any) {
    return { error: err.message };
  }
}

export async function deleteCropHarvest(id: string): Promise<{ error?: string }> {
  if (!supabase) return { error: 'Database unavailable' };
  try {
    const { error } = await supabase.from('crop_harvests').delete().eq('id', id);
    if (error) return { error: error.message };
    return {};
  } catch (err: any) {
    return { error: err.message };
  }
}
