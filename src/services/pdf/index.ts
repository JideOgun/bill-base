import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';

export const generateInvoicePDF = async (
  invoiceData: unknown,
  outputPath: string
): Promise<string> => {
  // Placeholder for PDF generation logic
  // This will be implemented with a PDF library like react-native-pdf or expo-print
  const pdfContent = JSON.stringify(invoiceData, null, 2);
  const fileUri = `${FileSystem.documentDirectory}${outputPath}`;
  await FileSystem.writeAsStringAsync(fileUri, pdfContent);
  return fileUri;
};

export const sharePDF = async (fileUri: string): Promise<void> => {
  const isAvailable = await Sharing.isAvailableAsync();
  if (isAvailable) {
    await Sharing.shareAsync(fileUri);
  } else {
    throw new Error('Sharing is not available on this device');
  }
};

