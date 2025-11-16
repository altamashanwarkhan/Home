document.addEventListener('DOMContentLoaded', async function() {
    const urlParams = new URLSearchParams(window.location.search);
    const certificateId = urlParams.get('id');
    
    if (!certificateId) {
        showError('No certificate ID provided');
        return;
    }
    
    const certificate = await getCertificateById(certificateId);
    
    if (!certificate) {
        showError('Certificate not found');
        return;
    }
    
    displayCertificate(certificate);
});

function displayCertificate(certificate) {
    const container = document.getElementById('certificateContent');
    const verifyUrl = getVerifyUrl();
    
    container.innerHTML = `
        <div class="certificate-card">
            <div class="cert-header">
                <div class="cert-logo">
                    <h1>AK INSTITUTE</h1>
                    <p>of Technical Training</p>
                </div>
                <div class="cert-seal">
                    <i class="fas fa-certificate"></i>
                </div>
            </div>
            
            <div class="cert-title">
                <h2>CERTIFICATE OF COMPLETION</h2>
                <p class="cert-subtitle">This is to certify that</p>
            </div>
            
            <div class="cert-student">
                <h3>${certificate.studentName}</h3>
            </div>
            
            <div class="cert-body">
                <p>has successfully completed the course</p>
                <h4>${certificate.courseName}</h4>
                <p>and has demonstrated the skills and knowledge required</p>
            </div>
            
            <div class="cert-footer">
                <div class="cert-date">
                    <p><strong>Issue Date</strong></p>
                    <p>${formatDate(certificate.issueDate)}</p>
                </div>
                <div class="cert-id">
                    <p><strong>Certificate ID</strong></p>
                    <p>${certificate.id}</p>
                </div>
            </div>
            
            <div class="cert-qr">
                <div id="qrcode"></div>
                <p>Scan to verify</p>
            </div>
            
            <div class="cert-signature">
                <div class="signature-line">
                    <div class="signature">
                        <p>________________________</p>
                        <p><strong>Authorized Signature</strong></p>
                        <p>Director, AK Institute</p>
                    </div>
                </div>
            </div>
            
            <div class="cert-bottom">
                <p>AK INSTITUTE OF TECHNICAL TRAINING (OPC) PRIVATE LIMITED</p>
                <p>Jamshedpur, Jharkhand, India</p>
            </div>
        </div>
        
        <div class="cert-info-box">
            <h3><i class="fas fa-info-circle"></i> Certificate Information</h3>
            <p><strong>Status:</strong> <span class="status-badge">Valid</span></p>
            <p><strong>Issued to:</strong> ${certificate.studentName}</p>
            <p><strong>Course:</strong> ${certificate.courseName}</p>
            <p><strong>Verify at:</strong> <a href="${verifyUrl}">${verifyUrl}</a></p>
        </div>
    `;
    
    generateQRCode(verifyUrl);
}

function generateQRCode(url) {
    const qrcodeDiv = document.getElementById('qrcode');
    if (qrcodeDiv && typeof QRCode !== 'undefined') {
        new QRCode(qrcodeDiv, {
            text: url,
            width: 128,
            height: 128,
            colorDark: '#004e89',
            colorLight: '#ffffff',
            correctLevel: QRCode.CorrectLevel.H
        });
    }
}

function showError(message) {
    const container = document.getElementById('certificateContent');
    container.innerHTML = `
        <div class="error-message">
            <i class="fas fa-exclamation-triangle"></i>
            <h2>Error</h2>
            <p>${message}</p>
            <a href="verify.html" class="btn btn-primary">Go to Verification Page</a>
        </div>
    `;
}
