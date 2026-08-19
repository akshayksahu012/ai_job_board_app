import fs from 'fs';
import pdfParse from 'pdf-parse';
import mammoth from 'mammoth';

export async function extractText(filePath, mimetype) {
  const buffer = fs.readFileSync(filePath);

  if (mimetype === 'application/pdf') {
    const data = await pdfParse(buffer);
    return data.text;
  }

  if (mimetype.includes('wordprocessingml') || mimetype.includes('msword')) {
    const { value } = await mammoth.extractRawText({ buffer });
    return value;
  }

  throw new Error('Unsupported file type');
}
