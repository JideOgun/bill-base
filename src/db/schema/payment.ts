import { getDatabase } from '../client';

export const createPaymentTable = async (): Promise<void> => {
  const db = await getDatabase();
  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS payment (
      id TEXT PRIMARY KEY,
      invoiceId TEXT NOT NULL,
      amount REAL NOT NULL,
      method TEXT NOT NULL CHECK(method IN ('cash', 'card', 'bank_transfer', 'check', 'other')),
      transactionId TEXT,
      paidAt TEXT NOT NULL,
      notes TEXT,
      createdAt TEXT NOT NULL,
      updatedAt TEXT NOT NULL,
      syncedAt TEXT,
      FOREIGN KEY (invoiceId) REFERENCES invoice(id)
    );
  `);
};

