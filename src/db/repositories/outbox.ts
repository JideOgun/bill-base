import { v4 as uuidv4 } from 'uuid';
import { getDatabase } from '../client';

export const addToOutbox = async (
  operation: 'create' | 'update' | 'delete',
  table: string,
  recordId: string,
  data: unknown
): Promise<void> => {
  const db = await getDatabase();
  const id = uuidv4();
  const now = new Date().toISOString();

  await db.runAsync(
    'INSERT INTO outbox (id, operation, table, recordId, data, createdAt) VALUES (?, ?, ?, ?, ?, ?)',
    [id, operation, table, recordId, JSON.stringify(data), now]
  );
};

export const getOutboxItems = async (): Promise<
  Array<{
    id: string;
    operation: string;
    table: string;
    recordId: string;
    data: string;
    createdAt: string;
    syncedAt: string | null;
  }>
> => {
  const db = await getDatabase();
  return await db.getAllAsync(
    'SELECT * FROM outbox WHERE syncedAt IS NULL ORDER BY createdAt ASC'
  );
};

export const markOutboxItemAsSynced = async (id: string): Promise<void> => {
  const db = await getDatabase();
  await db.runAsync('UPDATE outbox SET syncedAt = ? WHERE id = ?', [
    new Date().toISOString(),
    id,
  ]);
};

