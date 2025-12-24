import { v4 as uuidv4 } from 'uuid';
import { getDatabase } from '../client';
import { addToOutbox } from './outbox';
import type { Client } from '@/types';

export const createClient = async (
  data: Omit<Client, 'id' | 'createdAt' | 'updatedAt' | 'syncedAt'>
): Promise<Client> => {
  const db = await getDatabase();
  const id = uuidv4();
  const now = new Date().toISOString();

  const client: Client = {
    ...data,
    id,
    createdAt: now,
    updatedAt: now,
  };

  await db.runAsync(
    'INSERT INTO client (id, businessId, name, email, phone, address, taxId, notes, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
    [
      client.id,
      client.businessId,
      client.name,
      client.email,
      client.phone,
      client.address,
      client.taxId || null,
      client.notes || null,
      client.createdAt,
      client.updatedAt,
    ]
  );

  await addToOutbox('create', 'client', id, client);

  return client;
};

export const getClientById = async (id: string): Promise<Client | null> => {
  const db = await getDatabase();
  const result = await db.getFirstAsync<Client>(
    'SELECT * FROM client WHERE id = ?',
    [id]
  );
  return result || null;
};

export const getAllClients = async (businessId?: string): Promise<Client[]> => {
  const db = await getDatabase();
  if (businessId) {
    return await db.getAllAsync<Client>(
      'SELECT * FROM client WHERE businessId = ? ORDER BY name ASC',
      [businessId]
    );
  }
  return await db.getAllAsync<Client>('SELECT * FROM client ORDER BY name ASC');
};

export const updateClient = async (
  id: string,
  data: Partial<Omit<Client, 'id' | 'createdAt' | 'syncedAt'>>
): Promise<Client | null> => {
  const db = await getDatabase();
  const existing = await getClientById(id);

  if (!existing) {
    return null;
  }

  const updated: Client = {
    ...existing,
    ...data,
    updatedAt: new Date().toISOString(),
  };

  await db.runAsync(
    'UPDATE client SET businessId = ?, name = ?, email = ?, phone = ?, address = ?, taxId = ?, notes = ?, updatedAt = ? WHERE id = ?',
    [
      updated.businessId,
      updated.name,
      updated.email,
      updated.phone,
      updated.address,
      updated.taxId || null,
      updated.notes || null,
      updated.updatedAt,
      id,
    ]
  );

  await addToOutbox('update', 'client', id, updated);

  return updated;
};

export const deleteClient = async (id: string): Promise<boolean> => {
  const db = await getDatabase();
  const existing = await getClientById(id);

  if (!existing) {
    return false;
  }

  await db.runAsync('DELETE FROM client WHERE id = ?', [id]);
  await addToOutbox('delete', 'client', id, { id });

  return true;
};

