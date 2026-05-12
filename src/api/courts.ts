import { supabase } from '../lib/supabase';

export async function getGym() {
  const { data, error } = await supabase
    .from('gyms')
    .select('*')
    .eq('is_active', true)
    .limit(1)
    .single();

  if (error) {
    throw error;
  }

  return data;
}

export async function getCourts() {
  const { data, error } = await supabase
    .from('courts')
    .select('*')
    .eq('is_active', true)
    .order('sort_order', { ascending: true });

  if (error) {
    throw error;
  }

  return data;
}