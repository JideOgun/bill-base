import { v4 as uuidv4 } from 'uuid';
import { getDatabase } from '../client';
import { addToOutbox } from './outbox';
import type { Business } from '@/types';

export const createBusiness = async (
  data: Omit<Business, 'id' | 'createdAt' | 'updatedAt' | 'syncedAt'>
): Promise<Business> => {
  const db = await getDatabase();
  const id = uuidv4();
  const now = new Date().toISOString();

  const business: Business = {
    ...data,
    id,
    createdAt: now,
    updatedAt: now,
  };

  await db.runAsync(
    'INSERT INTO business (id, name, email, phone, address, taxId, logo, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
    [
      business.id,
      business.name,
      business.email,
      business.phone,
      business.address,
      business.taxId,
      business.logo || null,
      business.createdAt,
      business.updatedAt,
    ]
  );

  await addToOutbox('create', 'business', id, business);

  return business;
};

export const getBusinessById = async (id: string): Promise<Business | null> => {
  const db = await getDatabase();
  const result = await db.getFirstAsync<Business>('SELECT * FROM business WHERE id = ?', [id]);
  return result || null;
};

export const getAllBusinesses = async (): Promise<Business[]> => {
  const db = await getDatabase();
  return await db.getAllAsync<Business>('SELECT * FROM business ORDER BY createdAt DESC');
};

export const updateBusiness = async (
  id: string,
  data: Partial<Omit<Business, 'id' | 'createdAt' | 'syncedAt'>>
): Promise<Business | null> => {
  const db = await getDatabase();
  const existing = await getBusinessById(id);

  if (!existing) {
    return null;
  }

  const updated: Business = {
    ...existing,
    ...data,
    updatedAt: new Date().toISOString(),
  };

  await db.runAsync(
    'UPDATE business SET name = ?, email = ?, phone = ?, address = ?, taxId = ?, logo = ?, updatedAt = ? WHERE id = ?',
    [
      updated.name,
      updated.email,
      updated.phone,
      updated.address,
      updated.taxId,
      updated.logo || null,
      updated.updatedAt,
      id,
    ]
  );

  await addToOutbox('update', 'business', id, updated);

  return updated;
};

export const deleteBusiness = async (id: string): Promise<boolean> => {
  const db = await getDatabase();
  const existing = await getBusinessById(id);

  if (!existing) {
    return false;
  }

  await db.runAsync('DELETE FROM business WHERE id = ?', [id]);
  await addToOutbox('delete', 'business', id, { id });

  return true;
};
