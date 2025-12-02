import mammoth from 'mammoth';
import PDFParser from 'pdf2json';

/**
 * Extract text content from PDF buffer
 */
export async function extractTextFromPDF(buffer: Buffer): Promise<string> {
  return new Promise((resolve, reject) => {
    const pdfParser = new PDFParser();
    
    pdfParser.on('pdfParser_dataError', (errData: any) => {
      console.error('Error extracting text from PDF:', errData.parserError);
      reject(new Error('Failed to extract text from PDF file'));
    });
    
    pdfParser.on('pdfParser_dataReady', (pdfData: any) => {
      try {
        let text = '';
        if (pdfData.Pages) {
          for (const page of pdfData.Pages) {
            if (page.Texts) {
              for (const textItem of page.Texts) {
                if (textItem.R) {
                  for (const run of textItem.R) {
                    if (run.T) {
                      text += decodeURIComponent(run.T) + ' ';
                    }
                  }
                }
              }
            }
            text += '\n';
          }
        }
        resolve(text.trim());
      } catch (error) {
        reject(new Error('Failed to parse PDF content'));
      }
    });
    
    pdfParser.parseBuffer(buffer);
  });
}

/**
 * Extract text content from DOCX buffer
 */
export async function extractTextFromDOCX(buffer: Buffer): Promise<string> {
  try {
    const result = await mammoth.extractRawText({ buffer });
    return result.value;
  } catch (error) {
    console.error('Error extracting text from DOCX:', error);
    throw new Error('Failed to extract text from DOCX file');
  }
}

/**
 * Extract text from uploaded file based on mime type
 */
export async function extractTextFromFile(buffer: Buffer, mimeType: string): Promise<string> {
  if (mimeType === 'application/pdf') {
    return extractTextFromPDF(buffer);
  } else if (
    mimeType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
    mimeType === 'application/msword'
  ) {
    return extractTextFromDOCX(buffer);
  } else {
    throw new Error(`Unsupported file type: ${mimeType}`);
  }
}
