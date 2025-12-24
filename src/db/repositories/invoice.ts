import { v4 as uuidv4 } from 'uuid';
import { getDatabase } from '../client';
import { addToOutbox } from './outbox';
import type { Invoice } from '@/types';

export const createInvoice = async (
  data: Omit<Invoice, 'id' | 'createdAt' | 'updatedAt' | 'syncedAt'>
): Promise<Invoice> => {
  const db = await getDatabase();
  const id = uuidv4();
  const now = new Date().toISOString();

  const invoice: Invoice = {
    ...data,
    id,
    createdAt: now,
    updatedAt: now,
  };

  await db.runAsync(
    'INSERT INTO invoice (id, businessId, clientId, invoiceNumber, status, issueDate, dueDate, subtotal, tax, total, currency, notes, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
    [
      invoice.id,
      invoice.businessId,
      invoice.clientId,
      invoice.invoiceNumber,
      invoice.status,
      invoice.issueDate,
      invoice.dueDate,
      invoice.subtotal,
      invoice.tax,
      invoice.total,
      invoice.currency,
      invoice.notes || null,
      invoice.createdAt,
      invoice.updatedAt,
    ]
  );

  await addToOutbox('create', 'invoice', id, invoice);

  return invoice;
};

export const getInvoiceById = async (id: string): Promise<Invoice | null> => {
  const db = await getDatabase();
  const result = await db.getFirstAsync<Invoice>(
    'SELECT * FROM invoice WHERE id = ?',
    [id]
  );
  return result || null;
};

export const getAllInvoices = async (
  businessId?: string,
  clientId?: string,
  status?: Invoice['status']
): Promise<Invoice[]> => {
  const db = await getDatabase();
  let query = 'SELECT * FROM invoice WHERE 1=1';
  const params: unknown[] = [];

  if (businessId) {
    query += ' AND businessId = ?';
    params.push(businessId);
  }

  if (clientId) {
    query += ' AND clientId = ?';
    params.push(clientId);
  }

  if (status) {
    query += ' AND status = ?';
    params.push(status);
  }

  query += ' ORDER BY createdAt DESC';

  return await db.getAllAsync<Invoice>(query, params);
};

export const updateInvoice = async (
  id: string,
  data: Partial<Omit<Invoice, 'id' | 'createdAt' | 'syncedAt'>>
): Promise<Invoice | null> => {
  const db = await getDatabase();
  const existing = await getInvoiceById(id);

  if (!existing) {
    return null;
  }

  const updated: Invoice = {
    ...existing,
    ...data,
    updatedAt: new Date().toISOString(),
  };

  await db.runAsync(
    'UPDATE invoice SET businessId = ?, clientId = ?, invoiceNumber = ?, status = ?, issueDate = ?, dueDate = ?, subtotal = ?, tax = ?, total = ?, currency = ?, notes = ?, updatedAt = ? WHERE id = ?',
    [
      updated.businessId,
      updated.clientId,
      updated.invoiceNumber,
      updated.status,
      updated.issueDate,
      updated.dueDate,
      updated.subtotal,
      updated.tax,
      updated.total,
      updated.currency,
      updated.notes || null,
      updated.updatedAt,
      id,
    ]
  );

  await addToOutbox('update', 'invoice', id, updated);

  return updated;
};

export const deleteInvoice = async (id: string): Promise<boolean> => {
  const db = await getDatabase();
  const existing = await getInvoiceById(id);

  if (!existing) {
    return false;
  }

  await db.runAsync('DELETE FROM invoice WHERE id = ?', [id]);
  await addToOutbox('delete', 'invoice', id, { id });

  return true;
};

