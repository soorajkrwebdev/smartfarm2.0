import { supabase } from '../lib/supabase';
import { NotificationItem, NotificationType } from '../types';

export async function fetchNotifications(userId: string): Promise<NotificationItem[]> {
  if (!supabase || !userId) return [];
  try {
    const { data, error } = await supabase
      .from('notifications')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      console.warn('Notice fetching notifications:', error.message);
      return [];
    }

    return (data || []).map((row: any) => ({
      ...row,
      is_read: Boolean(row.is_read),
    }));
  } catch (err) {
    console.error('Failed to load notifications:', err);
    return [];
  }
}

export async function createNotification(
  userId: string,
  input: {
    type: NotificationType;
    title: string;
    message: string;
    related_record_id?: string;
    related_record_type?: string;
  }
): Promise<{ data?: NotificationItem; error?: string }> {
  if (!supabase || !userId) return { error: 'Authentication required' };
  try {
    const { data, error } = await supabase
      .from('notifications')
      .insert({
        user_id: userId,
        type: input.type,
        title: input.title,
        message: input.message,
        related_record_id: input.related_record_id || null,
        related_record_type: input.related_record_type || null,
        is_read: false,
      })
      .select()
      .single();

    if (error) return { error: error.message };
    return { data };
  } catch (err: any) {
    return { error: err.message };
  }
}

export async function markNotificationAsRead(id: string): Promise<{ error?: string }> {
  if (!supabase) return { error: 'Database unavailable' };
  try {
    const { error } = await supabase
      .from('notifications')
      .update({ is_read: true })
      .eq('id', id);

    if (error) return { error: error.message };
    return {};
  } catch (err: any) {
    return { error: err.message };
  }
}

export async function markAllNotificationsAsRead(userId: string): Promise<{ error?: string }> {
  if (!supabase || !userId) return { error: 'Authentication required' };
  try {
    const { error } = await supabase
      .from('notifications')
      .update({ is_read: true })
      .eq('user_id', userId)
      .eq('is_read', false);

    if (error) return { error: error.message };
    return {};
  } catch (err: any) {
    return { error: err.message };
  }
}

export async function deleteNotification(id: string): Promise<{ error?: string }> {
  if (!supabase) return { error: 'Database unavailable' };
  try {
    const { error } = await supabase.from('notifications').delete().eq('id', id);
    if (error) return { error: error.message };
    return {};
  } catch (err: any) {
    return { error: err.message };
  }
}
