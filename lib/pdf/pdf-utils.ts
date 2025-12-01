import { PDFDocument } from "pdf-lib";
// pdfjs can be used if you need layout-level parsing; simplified example

export async function loadPdf(bytes: ArrayBuffer, password?: string) {
  const doc = await PDFDocument.load(bytes, password ? { password } : {});
  return doc;
}
