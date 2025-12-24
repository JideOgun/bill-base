import { getDatabase } from '../client';

export const createOutboxTable = async (): Promise<void> => {
  const db = await getDatabase();
  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS outbox (
      id TEXT PRIMARY KEY,
      operation TEXT NOT NULL CHECK(operation IN ('create', 'update', 'delete')),
      table TEXT NOT NULL,
      recordId TEXT NOT NULL,
      data TEXT NOT NULL,
      createdAt TEXT NOT NULL,
      syncedAt TEXT
    );
  `);
};

