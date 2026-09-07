import { supabase } from './supabase'

export const COSMO_WORKSPACE_ID = 'cosmo-demo'

export type PersistedState = Record<string, unknown>
export type ActivityRow = {
  id: string
  action_type: string
  entity_type: string
  entity_id: string | null
  payload: Record<string, unknown>
  actor_label: string
  created_at: string
}

export async function loadAppState(prefix?: string) {
  let query = supabase
    .from('cosmo_app_state')
    .select('state_key,state_value,updated_at')
    .eq('workspace_id', COSMO_WORKSPACE_ID)
  if (prefix) query = query.like('state_key', `${prefix}%`)
  const { data, error } = await query
  if (error) throw error
  return Object.fromEntries((data ?? []).map((row: any) => [row.state_key, row.state_value])) as Record<string, PersistedState>
}

export async function saveAppState(stateKey: string, stateValue: PersistedState) {
  const { error } = await supabase
    .from('cosmo_app_state')
    .upsert({
      workspace_id: COSMO_WORKSPACE_ID,
      state_key: stateKey,
      state_value: stateValue,
      updated_at: new Date().toISOString(),
    }, { onConflict: 'workspace_id,state_key' })
  if (error) throw error
  return true
}

export async function logActivity(
  actionType: string,
  entityType: string,
  entityId?: string | null,
  payload: Record<string, unknown> = {},
) {
  const { data, error } = await supabase
    .from('cosmo_activity_log')
    .insert({
      workspace_id: COSMO_WORKSPACE_ID,
      action_type: actionType,
      entity_type: entityType,
      entity_id: entityId ?? null,
      payload,
      actor_label: 'workspace_user',
    })
    .select('id,created_at')
    .single()
  if (error) throw error
  return data
}

export async function loadActivities(limit = 30) {
  const { data, error } = await supabase
    .from('cosmo_activity_log')
    .select('id,action_type,entity_type,entity_id,payload,actor_label,created_at')
    .eq('workspace_id', COSMO_WORKSPACE_ID)
    .order('created_at', { ascending: false })
    .limit(limit)
  if (error) throw error
  return (data ?? []) as ActivityRow[]
}

export async function sha256File(file: File) {
  const digest = await crypto.subtle.digest('SHA-256', await file.arrayBuffer())
  return Array.from(new Uint8Array(digest)).map(v => v.toString(16).padStart(2, '0')).join('')
}
