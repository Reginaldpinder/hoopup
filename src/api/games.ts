import { supabase } from '../lib/supabase';

export async function getGamesByCourt(courtId: number) {
  const { data, error } = await supabase
    .from('games')
    .select(`
      *,
      game_players (
        id,
        user_id,
        status,
        payment_status
      )
    `)
    .eq('court_id', courtId)
    .order('start_time', { ascending: true });

  if (error) throw error;

  return data;
}

export async function joinGame(gameId: number) {
  const { error } = await supabase.rpc('join_game', {
    p_game_id: gameId,
  });

  if (error) throw error;
}

export async function leaveGame(gameId: number) {
  const { error } = await supabase.rpc('leave_game', {
    p_game_id: gameId,
  });

  if (error) throw error;
}