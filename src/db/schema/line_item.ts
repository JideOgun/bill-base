import { getDatabase } from '../client';

export const createLineItemTable = async (): Promise<void> => {
  const db = await getDatabase();
  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS line_item (
      id TEXT PRIMARY KEY,
      invoiceId TEXT NOT NULL,
      description TEXT NOT NULL,
      quantity REAL NOT NULL,
      unitPrice REAL NOT NULL,
      taxRate REAL NOT NULL DEFAULT 0,
      total REAL NOT NULL,
      createdAt TEXT NOT NULL,
      updatedAt TEXT NOT NULL,
      FOREIGN KEY (invoiceId) REFERENCES invoice(id) ON DELETE CASCADE
    );
  `);
};

