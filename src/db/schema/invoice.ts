import { getDatabase } from '../client';

export const createInvoiceTable = async (): Promise<void> => {
  const db = await getDatabase();
  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS invoice (
      id TEXT PRIMARY KEY,
      businessId TEXT NOT NULL,
      clientId TEXT NOT NULL,
      invoiceNumber TEXT NOT NULL UNIQUE,
      status TEXT NOT NULL CHECK(status IN ('draft', 'sent', 'paid', 'overdue', 'cancelled')),
      issueDate TEXT NOT NULL,
      dueDate TEXT NOT NULL,
      subtotal REAL NOT NULL,
      tax REAL NOT NULL,
      total REAL NOT NULL,
      currency TEXT NOT NULL DEFAULT 'USD',
      notes TEXT,
      createdAt TEXT NOT NULL,
      updatedAt TEXT NOT NULL,
      syncedAt TEXT,
      FOREIGN KEY (businessId) REFERENCES business(id),
      FOREIGN KEY (clientId) REFERENCES client(id)
    );
  `);
};

