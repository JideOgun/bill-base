import { supabase } from '../services/supabase/client';
import { getDatabase } from '../db/client';
import type { SyncResult } from '@/types';

export const syncToCloud = async (): Promise<SyncResult> => {
  const db = await getDatabase();
  let synced = 0;
  let errors = 0;

  try {
    const outboxRecords = await db.getAllAsync<{
      id: string;
      operation: string;
      table: string;
      recordId: string;
      data: string;
      createdAt: string;
    }>('SELECT * FROM outbox WHERE syncedAt IS NULL ORDER BY createdAt ASC');

    for (const record of outboxRecords) {
      try {
        const data = JSON.parse(record.data);

        switch (record.operation) {
          case 'create':
            await supabase.from(record.table).insert(data);
            break;
          case 'update':
            await supabase.from(record.table).update(data).eq('id', record.recordId);
            break;
          case 'delete':
            await supabase.from(record.table).delete().eq('id', record.recordId);
            break;
        }

        await db.runAsync(
          'UPDATE outbox SET syncedAt = ? WHERE id = ?',
          new Date().toISOString(),
          record.id
        );
        synced++;
      } catch (error) {
        console.error(`Error syncing record ${record.id}:`, error);
        errors++;
      }
    }

    return {
      success: errors === 0,
      synced,
      errors,
      lastSyncedAt: new Date().toISOString(),
    };
  } catch (error) {
    console.error('Sync error:', error);
    return {
      success: false,
      synced,
      errors,
    };
  }
};

export const syncFromCloud = async (): Promise<SyncResult> => {
  const db = await getDatabase();
  let synced = 0;
  let errors = 0;

  try {
    const { data: user } = await supabase.auth.getUser();
    if (!user.user) {
      return {
        success: false,
        synced: 0,
        errors: 1,
      };
    }

    const tables = ['business', 'client', 'invoice', 'payment'];
    const lastSyncResult = await db.getFirstAsync<{ syncedAt: string }>(
      "SELECT MAX(syncedAt) as syncedAt FROM (SELECT syncedAt FROM business WHERE syncedAt IS NOT NULL UNION SELECT syncedAt FROM client WHERE syncedAt IS NOT NULL UNION SELECT syncedAt FROM invoice WHERE syncedAt IS NOT NULL UNION SELECT syncedAt FROM payment WHERE syncedAt IS NOT NULL)"
    );
    const lastSync = lastSyncResult?.syncedAt;

    for (const table of tables) {
      try {
        const query = supabase
          .from(table)
          .select('*')
          .eq('user_id', user.user.id);

        if (lastSync?.syncedAt) {
          query.gt('updated_at', lastSync.syncedAt);
        }

        const { data, error } = await query;

        if (error) {
          throw error;
        }

        if (data) {
          for (const record of data) {
            const keys = Object.keys(record).filter((k) => k !== 'id' && k !== 'user_id');
            const values = keys.map((k) => record[k as keyof typeof record]);
            const placeholders = keys.map(() => '?').join(', ');
            await db.runAsync(
              `INSERT OR REPLACE INTO ${table} (id, ${keys.join(', ')}, syncedAt) VALUES (?, ${placeholders}, ?)`,
              [record.id, ...values, new Date().toISOString()]
            );
          }
          synced += data.length;
        }
      } catch (error) {
        console.error(`Error syncing table ${table}:`, error);
        errors++;
      }
    }

    return {
      success: errors === 0,
      synced,
      errors,
      lastSyncedAt: new Date().toISOString(),
    };
  } catch (error) {
    console.error('Sync from cloud error:', error);
    return {
      success: false,
      synced,
      errors,
    };
  }
};

