import { z } from 'zod';

export const emailSchema = z.string().email('Invalid email address');

export const phoneSchema = z.string().regex(/^\+?[\d\s-()]+$/, 'Invalid phone number');

export const currencySchema = z.string().length(3, 'Currency must be a 3-letter code');

export const invoiceStatusSchema = z.enum(['draft', 'sent', 'paid', 'overdue', 'cancelled']);

export const paymentMethodSchema = z.enum([
  'cash',
  'card',
  'bank_transfer',
  'check',
  'other',
]);

