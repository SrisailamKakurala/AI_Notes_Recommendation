// File: src/documentGenerator.ts
import * as fs from 'fs/promises';
import { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType, Header, Footer, BorderStyle } from 'docx';
import puppeteer from 'puppeteer';
import { marked } from 'marked';
export async function generateDocx(content, metadata, outputPath) {
    try {
        // Convert markdown to document structure
        const lines = content.split('\n');
        const children = [];
        // Add header
        const header = new Header({
            children: [
                new Paragraph({
                    alignment: AlignmentType.CENTER,
                    children: [
                        new TextRun({
                            text: metadata.institution,
                            bold: true,
                            size: 24
                        })
                    ]
                })
            ]
        });
        // Add title
        children.push(new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { before: 200, after: 200 },
            children: [
                new TextRun({
                    text: metadata.courseTitle,
                    bold: true,
                    size: 32
                })
            ]
        }));
        // Process markdown content
        let currentHeadingLevel = 0;
        for (const line of lines) {
            if (line.startsWith('# ')) {
                children.push(new Paragraph({
                    text: line.substring(2),
                    heading: HeadingLevel.HEADING_1,
                    spacing: { before: 200, after: 120 }
                }));
                currentHeadingLevel = 1;
            }
            else if (line.startsWith('## ')) {
                children.push(new Paragraph({
                    text: line.substring(3),
                    heading: HeadingLevel.HEADING_2,
                    spacing: { before: 160, after: 80 }
                }));
                currentHeadingLevel = 2;
            }
            else if (line.startsWith('### ')) {
                children.push(new Paragraph({
                    text: line.substring(4),
                    heading: HeadingLevel.HEADING_3,
                    spacing: { before: 120, after: 40 }
                }));
                currentHeadingLevel = 3;
            }
            else if (line.startsWith('- ')) {
                children.push(new Paragraph({
                    text: '• ' + line.substring(2),
                    indent: { left: 720 }
                }));
            }
            else if (line.trim().match(/^\d+\.\s/)) {
                const matchResult = line.trim().match(/^(\d+)\.\s(.+)$/);
                if (matchResult) {
                    children.push(new Paragraph({
                        text: `${matchResult[1]}. ${matchResult[2]}`,
                        indent: { left: 720 }
                    }));
                }
            }
            else if (line.trim() !== '') {
                children.push(new Paragraph({
                    text: line
                }));
            }
            else {
                // Empty line
                children.push(new Paragraph({}));
            }
        }
        // Add footer
        const footer = new Footer({
            children: [
                new Paragraph({
                    alignment: AlignmentType.CENTER,
                    border: {
                        top: {
                            color: "auto",
                            space: 1,
                            style: BorderStyle.SINGLE,
                            size: 6
                        }
                    },
                    children: [
                        new TextRun({
                            text: `${metadata.professorName} | ${new Date().toLocaleDateString()}`,
                            size: 20
                        })
                    ]
                })
            ]
        });
        // Create document
        const doc = new Document({
            sections: [
                {
                    headers: {
                        default: header
                    },
                    footers: {
                        default: footer
                    },
                    children: children
                }
            ]
        });
        // Generate and save the document
        const buffer = await Packer.toBuffer(doc);
        await fs.writeFile(outputPath, buffer);
    }
    catch (error) {
        console.error('Error generating DOCX:', error);
        throw error;
    }
}
export async function generatePdf(content, metadata, outputPath) {
    try {
        // Convert markdown to HTML with enhanced formatting
        const htmlContent = marked(content);
        // Create full HTML document with professional styling and proper header/footer
        const fullHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <title>${metadata.courseTitle} Notes</title>
        <style>
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
          
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }
          
          html, body {
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            font-size: 14px;
            line-height: 1.6;
            color: #2c3e50;
            background: #ffffff;
          }
          
          /* Page structure for proper header/footer on every page */
          @page {
            size: A4;
            margin: 50px 30px 50px 30px;
            @top-center {
              content: element(header);
            }
            @bottom-center {
              content: element(footer);
            }
          }
          
          /* Running header */
          .running-header {
            position: running(header);
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 15px 30px;
            text-align: center;
            border-bottom: 3px solid #5a67d8;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
          }
          
          .header-institution {
            font-size: 16px;
            font-weight: 600;
            letter-spacing: 0.5px;
            text-transform: uppercase;
          }
          
          .header-course {
            font-size: 12px;
            font-weight: 400;
            opacity: 0.9;
            margin-top: 2px;
          }
          
          /* Running footer */
          .running-footer {
            position: running(footer);
            background: #f8fafc;
            border-top: 2px solid #e2e8f0;
            padding: 12px 30px;
            text-align: center;
            font-size: 11px;
            color: #64748b;
          }
          
          .footer-content {
            display: flex;
            justify-content: space-between;
            align-items: center;
            max-width: 100%;
          }
          
          .footer-left {
            font-weight: 500;
          }
          
          .footer-right {
            font-style: italic;
          }
          
          /* Main content area */
          .content-wrapper {
            margin: 120px 0 80px 0; /* Space for header and footer */
            padding: 0 40px;
            min-height: calc(100vh - 200px);
          }
          
          /* Typography */
          h1 {
            font-size: 24px;
            font-weight: 700;
            color: #1a202c;
            margin: 32px 0 20px 0;
            padding-bottom: 12px;
            border-bottom: 3px solid #667eea;
            position: relative;
          }
          
          h1::after {
            content: '';
            position: absolute;
            bottom: -3px;
            left: 0;
            width: 60px;
            height: 3px;
            background: #764ba2;
          }
          
          h2 {
            font-size: 20px;
            font-weight: 600;
            color: #2d3748;
            margin: 28px 0 16px 0;
            padding-left: 12px;
            border-left: 4px solid #667eea;
            background: linear-gradient(90deg, #f7fafc 0%, transparent 100%);
            padding: 12px;
          }
          
          h3 {
            font-size: 18px;
            font-weight: 500;
            color: #4a5568;
            margin: 24px 0 12px 0;
            position: relative;
            padding-left: 20px;
          }
          
          h3::before {
            content: '▸';
            position: absolute;
            left: 0;
            color: #667eea;
            font-weight: bold;
          }
          
          h4 {
            font-size: 16px;
            font-weight: 500;
            color: #718096;
            margin: 20px 0 10px 0;
          }
          
          p {
            margin-bottom: 16px;
            text-align: justify;
            line-height: 1.7;
          }
          
          /* Lists */
          ul, ol {
            margin: 16px 0 16px 24px;
            padding-left: 0;
          }
          
          li {
            margin-bottom: 8px;
            line-height: 1.6;
            position: relative;
          }
          
          ul li {
            list-style: none;
            padding-left: 20px;
          }
          
          ul li::before {
            content: '•';
            color: #667eea;
            font-weight: bold;
            position: absolute;
            left: 0;
            font-size: 16px;
          }
          
          ol li {
            padding-left: 8px;
          }
          
          /* Code and pre blocks */
          code {
            background: #f1f5f9;
            padding: 2px 6px;
            border-radius: 4px;
            font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
            font-size: 13px;
            color: #e53e3e;
          }
          
          pre {
            background: #1a202c;
            color: #e2e8f0;
            padding: 20px;
            border-radius: 8px;
            overflow-x: auto;
            margin: 20px 0;
            border-left: 4px solid #667eea;
          }
          
          pre code {
            background: none;
            color: inherit;
            padding: 0;
          }
          
          /* Blockquotes */
          blockquote {
            border-left: 4px solid #667eea;
            padding: 16px 24px;
            margin: 20px 0;
            background: #f8fafc;
            font-style: italic;
            position: relative;
          }
          
          blockquote::before {
            content: '"';
            font-size: 48px;
            color: #667eea;
            position: absolute;
            top: -8px;
            left: 16px;
            opacity: 0.3;
          }
          
          /* Tables */
          table {
            width: 100%;
            border-collapse: collapse;
            margin: 20px 0;
            background: white;
            border-radius: 8px;
            overflow: hidden;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
          }
          
          th, td {
            padding: 12px 16px;
            text-align: left;
            border-bottom: 1px solid #e2e8f0;
          }
          
          th {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            font-weight: 600;
            text-transform: uppercase;
            font-size: 12px;
            letter-spacing: 0.5px;
          }
          
          tr:hover {
            background-color: #f8fafc;
          }
          
          /* Special elements */
          .highlight {
            background: linear-gradient(120deg, #fef9e7 0%, #fff3cd 100%);
            padding: 16px;
            border-radius: 8px;
            border-left: 4px solid #f6ad55;
            margin: 20px 0;
          }
          
          .note {
            background: linear-gradient(120deg, #e8f4fd 0%, #bee3f8 100%);
            padding: 16px;
            border-radius: 8px;
            border-left: 4px solid #4299e1;
            margin: 20px 0;
          }
          
          /* Links */
          a {
            color: #667eea;
            text-decoration: none;
            border-bottom: 1px solid transparent;
            transition: all 0.2s ease;
          }
          
          a:hover {
            border-bottom-color: #667eea;
          }
          
          /* Page breaks */
          .page-break {
            page-break-before: always;
          }
          
          /* Print optimization */
          @media print {
            body {
              -webkit-print-color-adjust: exact;
              print-color-adjust: exact;
            }
            
            .content-wrapper {
              margin: 0;
              padding: 20px;
            }
          }
        </style>
      </head>
      <body>
        <!-- Running Header -->
        <div class="running-header">
          <div class="header-institution">${metadata.institution}</div>
          <div class="header-course">${metadata.courseTitle}</div>
        </div>
        
        <!-- Running Footer -->
        <div class="running-footer">
          <div class="footer-content">
            <div class="footer-left">${metadata.professorName}</div>
            <div class="footer-right">${new Date().toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        })}</div>
          </div>
        </div>
        
        <!-- Main Content -->
        <div class="content-wrapper">
          ${htmlContent}
        </div>
      </body>
      </html>
    `;
        // Use Puppeteer to generate PDF with enhanced settings
        const browser = await puppeteer.launch({
            headless: true,
            args: ['--no-sandbox', '--disable-setuid-sandbox']
        });
        const page = await browser.newPage();
        // Set viewport for consistent rendering
        await page.setViewport({
            width: 1200,
            height: 1600,
            deviceScaleFactor: 2
        });
        await page.setContent(fullHtml, {
            waitUntil: 'networkidle0',
            timeout: 30000
        });
        // Wait for fonts to load
        await page.evaluateHandle('document.fonts.ready');
        await page.pdf({
            path: outputPath,
            format: 'A4',
            printBackground: true,
            preferCSSPageSize: true,
            displayHeaderFooter: false, // We're using CSS running elements instead
            margin: {
                top: '2mm',
                right: '2mm',
                bottom: '2mm',
                left: '2mm'
            },
            // Enable proper page breaking
            pageRanges: '',
            scale: 1
        });
        await browser.close();
    }
    catch (error) {
        console.error('Error generating PDF:', error);
        throw error;
    }
}
