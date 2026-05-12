import { supabase } from '../lib/supabase';

export async function getGamesByCourt(courtId: number) {
  const { data, error } = await supabase
    .from('games')
    .select('*')
    .eq('court_id', courtId)
    .order('start_time', { ascending: true });

  if (error) throw error;

  return data;
}