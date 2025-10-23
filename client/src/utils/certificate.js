import html2pdf from 'html2pdf.js'

export const generateCertificate = (certificateData, onComplete) => {
  // Create certificate content HTML (just the body content, not full document)
  const certificateContentHTML = `
    <div class="certificate">
      <div class="header">
        <div class="graduation-icon">🎓</div>
        <div class="title">Certificate of Completion</div>
        <div class="subtitle">Awarded by Cway Academy</div>
      </div>
      <div class="main-content">
        <div class="certifies">This is to certify that</div>
        <div class="name">${certificateData.studentName}</div>
        <div class="completed">has successfully completed the course</div>
        <div class="course">${certificateData.courseName}</div>
        <div class="course-details">${certificateData.courseDetails || ''}</div>
        <div class="date">Completion Date: ${certificateData.completionDate}</div>
      </div>
      <div class="signatures">
        <div class="signature">
          <div class="signature-line"></div>
          <div class="signature-title">Instructor</div>
          <div class="signature-name">Cway Academy</div>
        </div>
        <div class="signature">
          <div class="signature-line"></div>
          <div class="signature-title">Director</div>
          <div class="signature-name">Cway Academy</div>
        </div>
      </div>
      <div class="footer" style="margin-bottom: 40px;">
        This certificate is awarded in recognition of the successful completion of the course requirements.<br>
        Cway Academy - Empowering Learning Through Innovation
      </div>
      <div class="certificate-id" style="position: absolute; bottom: 16px; left: 50%; transform: translateX(-50%); font-size: 12px; color: #1a365d; background: rgba(255,255,255,0.95); padding: 6px 14px; border-radius: 4px; border: 1px solid #e2e8f0; font-weight: 600; z-index: 2;">Certificate ID: ${certificateData.certificateId || 'CA-' + Date.now()}</div>
    </div>
  `

  // Create certificate HTML with inline styles and system fonts for better PDF compatibility
  const certificateHTML = '<!DOCTYPE html><html><head><meta charset="UTF-8"><title>Certificate of Completion</title><style>*{margin:0;padding:0;box-sizing:border-box;}body{font-family:\'Times New Roman\',Times,serif;background:white;width:842px;height:595px;display:flex;align-items:center;justify-content:center;margin:0;padding:0;}.certificate{width:100%;height:100%;border:4px solid #1a365d;padding:25px;display:flex;flex-direction:column;background:white;position:relative;box-sizing:border-box;}.header{text-align:center;margin-bottom:15px;flex-shrink:0;}.graduation-icon{font-size:50px;margin-bottom:10px;color:#1a365d;}.title{font-size:36px;font-weight:bold;text-align:center;margin-bottom:8px;color:#1a365d;text-transform:uppercase;letter-spacing:2px;border-bottom:2px solid #1a365d;padding-bottom:8px;}.subtitle{font-size:14px;color:#4a5568;margin-bottom:20px;font-style:italic;}.main-content{flex:1;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;padding:10px 0;}.certifies{font-size:16px;margin:8px 0;color:#2d3748;}.name{font-size:40px;font-weight:bold;margin:15px 0;color:#1a365d;font-style:italic;text-decoration:underline;text-decoration-color:#e53e3e;text-decoration-thickness:2px;line-height:1.2;}.completed{font-size:16px;margin-bottom:10px;color:#2d3748;}.course{font-size:26px;margin:10px 0;color:#2563eb;font-weight:bold;font-style:italic;line-height:1.3;}.course-details{font-size:14px;color:#4a5568;margin:8px 0 15px 0;font-style:italic;}.date{font-size:16px;margin:10px 0;color:#2d3748;font-weight:bold;}.signatures{display:flex;justify-content:space-around;width:100%;margin-top:25px;padding:0 40px;flex-shrink:0;}.signature{text-align:center;width:200px;}.signature-line{width:100%;height:2px;background:#1a365d;margin:20px 0 6px 0;}.signature-title{font-size:12px;color:#4a5568;margin-bottom:4px;font-weight:bold;}.signature-name{font-size:14px;font-weight:bold;color:#1a365d;}.footer{text-align:center;margin-top:15px;font-size:11px;color:#718096;line-height:1.3;flex-shrink:0;}.certificate-id{position:absolute;bottom:32px;left:50%;transform:translateX(-50%);font-size:12px;color:#1a365d;background:rgba(255,255,255,0.95);padding:6px 14px;border-radius:4px;border:1px solid #e2e8f0;font-weight:600;z-index:2;}</style></head><body>' + certificateContentHTML + '</body></html>'

  // Create preview modal
  const modal = document.createElement('div')
  modal.style.position = 'fixed'
  modal.style.top = '0'
  modal.style.left = '0'
  modal.style.width = '100vw'
  modal.style.height = '100vh'
  modal.style.backgroundColor = 'rgba(0, 0, 0, 0.8)'
  modal.style.zIndex = '10000'
  modal.style.display = 'flex'
  modal.style.alignItems = 'center'
  modal.style.justifyContent = 'center'
  modal.style.padding = '20px'
  modal.style.boxSizing = 'border-box'

  // Create modal content
  const modalContent = document.createElement('div')
  modalContent.style.backgroundColor = 'white'
  modalContent.style.borderRadius = '12px'
  modalContent.style.width = '100%'
  modalContent.style.maxWidth = '950px'
  modalContent.style.maxHeight = '95vh'
  modalContent.style.display = 'flex'
  modalContent.style.flexDirection = 'column'
  modalContent.style.boxShadow = '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'

  // Create certificate preview container
  const previewContainer = document.createElement('div')
  previewContainer.style.flex = '1'
  previewContainer.style.minHeight = '0'
  previewContainer.style.backgroundColor = 'white'
  previewContainer.style.borderRadius = '8px 8px 0 0'
  previewContainer.style.overflow = 'hidden'
  previewContainer.innerHTML = certificateHTML

  // Create modal footer with buttons (fixed positioning)
  const modalFooter = document.createElement('div')
  modalFooter.style.padding = '20px'
  modalFooter.style.display = 'flex'
  modalFooter.style.gap = '12px'
  modalFooter.style.justifyContent = 'center'
  modalFooter.style.borderTop = '1px solid #e5e7eb'
  modalFooter.style.backgroundColor = '#f9fafb'
  modalFooter.style.borderRadius = '0 0 12px 12px'
  modalFooter.style.flexShrink = '0'

  // Download button
  const downloadBtn = document.createElement('button')
  downloadBtn.textContent = '📄 Download PDF'
  downloadBtn.style.backgroundColor = '#2563eb'
  downloadBtn.style.color = 'white'
  downloadBtn.style.border = 'none'
  downloadBtn.style.padding = '14px 28px'
  downloadBtn.style.borderRadius = '8px'
  downloadBtn.style.fontWeight = '600'
  downloadBtn.style.cursor = 'pointer'
  downloadBtn.style.fontSize = '16px'
  downloadBtn.style.minWidth = '160px'

  // Close button
  const closeBtn = document.createElement('button')
  closeBtn.textContent = '✕ Close'
  closeBtn.style.backgroundColor = '#f3f4f6'
  closeBtn.style.color = '#374151'
  closeBtn.style.border = '1px solid #d1d5db'
  closeBtn.style.padding = '14px 28px'
  closeBtn.style.borderRadius = '8px'
  closeBtn.style.fontWeight = '600'
  closeBtn.style.cursor = 'pointer'
  closeBtn.style.fontSize = '16px'
  closeBtn.style.minWidth = '120px'

  // Add buttons to footer
  modalFooter.appendChild(downloadBtn)
  modalFooter.appendChild(closeBtn)

  // Add elements to modal
  modalContent.appendChild(previewContainer)
  modalContent.appendChild(modalFooter)
  modal.appendChild(modalContent)
  document.body.appendChild(modal)
  document.body.style.overflow = 'hidden'

  // Close modal function
  const closeModal = () => {
    document.body.removeChild(modal)
    document.body.style.overflow = ''
    if (onComplete) onComplete()
  }

  // Close button event
  closeBtn.addEventListener('click', closeModal)

  // Close on background click
  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      closeModal()
    }
  })

  // Download button event
  downloadBtn.addEventListener('click', () => {
    // Show loading state
    downloadBtn.textContent = '⏳ Generating PDF...'
    downloadBtn.disabled = true
    downloadBtn.style.opacity = '0.7'

    // Create a hidden container for PDF generation
    const pdfContainer = document.createElement('div')
    pdfContainer.style.position = 'fixed'
    pdfContainer.style.left = '-9999px'
    pdfContainer.style.top = '0'
    pdfContainer.style.width = '1122px' // A4 landscape width in px at 96dpi
    pdfContainer.style.height = '793px' // A4 landscape height in px at 96dpi
    pdfContainer.style.backgroundColor = 'white'
    pdfContainer.style.zIndex = '-1'
    pdfContainer.style.fontFamily = "'Times New Roman', Times, serif"
    // Add the certificate content as a child node
    const certNode = document.createElement('div')
    certNode.className = 'certificate'
    certNode.style.width = '100%'
    certNode.style.height = '100%'
    certNode.innerHTML = certificateContentHTML
    pdfContainer.appendChild(certNode)
    document.body.appendChild(pdfContainer)

    // Force layout calculation
    pdfContainer.offsetHeight

    // Generate PDF after ensuring content is rendered
    setTimeout(() => {
      const options = {
        margin: 0,
        filename: `CwayAcademy_Certificate_${certificateData.studentName.replace(/\s+/g, '_')}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: {
          scale: 2,
          useCORS: true,
          allowTaint: true,
          backgroundColor: '#ffffff',
          width: 1122,
          height: 793,
          logging: false,
          letterRendering: true,
          scrollX: 0,
          scrollY: 0,
          windowWidth: 1122,
          windowHeight: 793
        },
        jsPDF: {
          unit: 'px',
          format: [1122, 793],
          orientation: 'landscape',
          compress: true,
          putOnlyUsedFonts: true,
          floatPrecision: 16
        }
      }

      html2pdf()
        .set(options)
        .from(certNode)
        .save()
        .then(() => {
          document.body.removeChild(pdfContainer)
          downloadBtn.textContent = '✅ Downloaded!'
          downloadBtn.style.backgroundColor = '#10b981'
          setTimeout(() => {
            closeModal()
          }, 1500)
        })
        .catch((error) => {
          console.error('PDF generation error:', error)
          document.body.removeChild(pdfContainer)

          // Fallback with different approach
          const fallbackContainer = document.createElement('div')
          fallbackContainer.style.position = 'fixed'
          fallbackContainer.style.left = '-9999px'
          fallbackContainer.style.top = '0'
          fallbackContainer.style.width = '1122px'
          fallbackContainer.style.height = '793px'
          fallbackContainer.style.backgroundColor = 'white'
          fallbackContainer.style.zIndex = '-1'
          fallbackContainer.style.fontFamily = "'Times New Roman', Times, serif"
          const fallbackCertNode = document.createElement('div')
          fallbackCertNode.className = 'certificate'
          fallbackCertNode.style.width = '100%'
          fallbackCertNode.style.height = '100%'
          fallbackCertNode.innerHTML = certificateContentHTML
          fallbackContainer.appendChild(fallbackCertNode)
          document.body.appendChild(fallbackContainer)

          setTimeout(() => {
            const fallbackOptions = {
              margin: 0,
              filename: `Certificate_${certificateData.studentName.replace(/\s+/g, '_')}.pdf`,
              image: { type: 'jpeg', quality: 0.95 },
              html2canvas: {
                scale: 1.5,
                useCORS: true,
                allowTaint: true,
                backgroundColor: '#ffffff',
                width: 1122,
                height: 793,
                logging: false
              },
              jsPDF: {
                unit: 'px',
                format: [1122, 793],
                orientation: 'landscape',
                compress: true
              }
            }

            html2pdf()
              .set(fallbackOptions)
              .from(fallbackCertNode)
              .save()
              .then(() => {
                document.body.removeChild(fallbackContainer)
                downloadBtn.textContent = '✅ Downloaded!'
                downloadBtn.style.backgroundColor = '#10b981'
                setTimeout(() => {
                  closeModal()
                }, 1500)
              })
              .catch((fallbackError) => {
                console.error('Fallback PDF generation failed:', fallbackError)
                document.body.removeChild(fallbackContainer)
                downloadBtn.textContent = '❌ Download Failed'
                downloadBtn.style.backgroundColor = '#dc2626'
                downloadBtn.disabled = false
                downloadBtn.style.opacity = '1'
              })
          }, 1000)
        })
    }, 500)
  })
}