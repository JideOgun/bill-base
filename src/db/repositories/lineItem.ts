import { v4 as uuidv4 } from 'uuid';
import { getDatabase } from '../client';
import type { LineItem } from '@/types';

export const createLineItem = async (
  data: Omit<LineItem, 'id' | 'createdAt' | 'updatedAt'>
): Promise<LineItem> => {
  const db = await getDatabase();
  const id = uuidv4();
  const now = new Date().toISOString();

  const lineItem: LineItem = {
    ...data,
    id,
    createdAt: now,
    updatedAt: now,
  };

  await db.runAsync(
    'INSERT INTO line_item (id, invoiceId, description, quantity, unitPrice, taxRate, total, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
    [
      lineItem.id,
      lineItem.invoiceId,
      lineItem.description,
      lineItem.quantity,
      lineItem.unitPrice,
      lineItem.taxRate,
      lineItem.total,
      lineItem.createdAt,
      lineItem.updatedAt,
    ]
  );

  return lineItem;
};

export const getLineItemById = async (id: string): Promise<LineItem | null> => {
  const db = await getDatabase();
  const result = await db.getFirstAsync<LineItem>(
    'SELECT * FROM line_item WHERE id = ?',
    [id]
  );
  return result || null;
};

export const getLineItemsByInvoiceId = async (
  invoiceId: string
): Promise<LineItem[]> => {
  const db = await getDatabase();
  return await db.getAllAsync<LineItem>(
    'SELECT * FROM line_item WHERE invoiceId = ? ORDER BY createdAt ASC',
    [invoiceId]
  );
};

export const updateLineItem = async (
  id: string,
  data: Partial<Omit<LineItem, 'id' | 'createdAt'>>
): Promise<LineItem | null> => {
  const db = await getDatabase();
  const existing = await getLineItemById(id);

  if (!existing) {
    return null;
  }

  const updated: LineItem = {
    ...existing,
    ...data,
    updatedAt: new Date().toISOString(),
  };

  await db.runAsync(
    'UPDATE line_item SET invoiceId = ?, description = ?, quantity = ?, unitPrice = ?, taxRate = ?, total = ?, updatedAt = ? WHERE id = ?',
    [
      updated.invoiceId,
      updated.description,
      updated.quantity,
      updated.unitPrice,
      updated.taxRate,
      updated.total,
      updated.updatedAt,
      id,
    ]
  );

  return updated;
};

export const deleteLineItem = async (id: string): Promise<boolean> => {
  const db = await getDatabase();
  const existing = await getLineItemById(id);

  if (!existing) {
    return false;
  }

  await db.runAsync('DELETE FROM line_item WHERE id = ?', [id]);
  return true;
};

export const deleteLineItemsByInvoiceId = async (
  invoiceId: string
): Promise<void> => {
  const db = await getDatabase();
  await db.runAsync('DELETE FROM line_item WHERE invoiceId = ?', [invoiceId]);
};

