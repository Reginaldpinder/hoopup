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

export async function getHostedGames(userId: string) {
  const { data, error } = await supabase
    .from('games')
    .select(`
      *,
      courts (
        id,
        court_name,
        gyms (
          id,
          name
        )
      )
    `)
    .eq('host_id', userId)
    .order('start_time', { ascending: true });

  if (error) throw error;

  return data;
}

export async function getJoinedGames(userId: string) {
  const { data, error } = await supabase
    .from('game_players')
    .select(`
      id,
      status,
      payment_status,
      games (
        *,
        courts (
          id,
          court_name,
          gyms (
            id,
            name
          )
        )
      )
    `)
    .eq('user_id', userId)
    .eq('status', 'joined');

  if (error) throw error;

  return data;
}

export async function updatePaymentStatus(
  gameId: number,
  playerUserId: string,
  paymentStatus: 'paid' | 'unpaid'
) {
  const rpcName =
    paymentStatus === 'paid' ? 'mark_player_paid' : 'mark_player_unpaid';

  const { error } = await supabase.rpc(rpcName, {
    p_game_id: gameId,
    p_user_id: playerUserId,
    p_payment_note: null,
  });

  if (error) throw error;
}