const fs = require('fs');
const PDFParser = require('pdf2json');

async function extractTextFromPDF(buffer) {
  return new Promise((resolve, reject) => {
    const pdfParser = new PDFParser();
    
    pdfParser.on('pdfParser_dataError', (errData) => {
      reject(new Error('Failed to extract text from PDF file'));
    });
    
    pdfParser.on('pdfParser_dataReady', (pdfData) => {
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

async function test() {
  try {
    const pdfBuffer = fs.readFileSync('/home/ubuntu/upload/ResumeDavid.pdf');
    const base64 = pdfBuffer.toString('base64');
    const dataUrl = `data:application/pdf;base64,${base64}`;
    const base64Data = dataUrl.split(',')[1];
    const buffer = Buffer.from(base64Data, 'base64');
    
    console.log('Extracting text from PDF...');
    const text = await extractTextFromPDF(buffer);
    
    console.log('\n=== SUCCESS ===');
    console.log('Extracted text length:', text.length);
    console.log('\n=== First 500 characters ===');
    console.log(text.substring(0, 500));
    
  } catch (error) {
    console.error('\n=== ERROR ===');
    console.error(error.message);
    process.exit(1);
  }
}

test();
