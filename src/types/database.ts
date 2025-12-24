export interface Business {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  taxId: string;
  logo?: string;
  createdAt: string;
  updatedAt: string;
  syncedAt?: string;
}

export interface Client {
  id: string;
  businessId: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  taxId?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
  syncedAt?: string;
}

export interface Invoice {
  id: string;
  businessId: string;
  clientId: string;
  invoiceNumber: string;
  status: 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled';
  issueDate: string;
  dueDate: string;
  subtotal: number;
  tax: number;
  total: number;
  currency: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
  syncedAt?: string;
}

export interface LineItem {
  id: string;
  invoiceId: string;
  description: string;
  quantity: number;
  unitPrice: number;
  taxRate: number;
  total: number;
  createdAt: string;
  updatedAt: string;
}

export interface Payment {
  id: string;
  invoiceId: string;
  amount: number;
  method: 'cash' | 'card' | 'bank_transfer' | 'check' | 'other';
  transactionId?: string;
  paidAt: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
  syncedAt?: string;
}

export interface Outbox {
  id: string;
  operation: 'create' | 'update' | 'delete';
  table: string;
  recordId: string;
  data: string;
  createdAt: string;
  syncedAt?: string;
}

