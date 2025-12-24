import { createBusinessTable } from './business';
import { createClientTable } from './client';
import { createInvoiceTable } from './invoice';
import { createLineItemTable } from './line_item';
import { createPaymentTable } from './payment';
import { createOutboxTable } from './outbox';

export const initializeDatabase = async (): Promise<void> => {
  await createBusinessTable();
  await createClientTable();
  await createInvoiceTable();
  await createLineItemTable();
  await createPaymentTable();
  await createOutboxTable();
};

