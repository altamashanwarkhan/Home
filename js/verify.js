async function verifyCertificate() {
    const certificateId = document.getElementById('certificateId').value.trim().toUpperCase();
    const resultDiv = document.getElementById('verificationResult');
    
    if (!certificateId) {
        alert('Please enter a certificate ID');
        return;
    }
    
    resultDiv.innerHTML = '<div class="loading" style="text-align:center;padding:40px;"><i class="fas fa-spinner fa-spin" style="font-size:48px;color:#004e89;"></i><p style="margin-top:20px;">Verifying certificate...</p></div>';
    resultDiv.style.display = 'block';
    
    const certificate = await getCertificateById(certificateId);
    
    if (certificate) {
        const certificateUrl = getCertificateUrl(certificate.id);
        resultDiv.innerHTML = `
            <div class="verification-success">
                <div class="success-icon">
                    <i class="fas fa-check-circle"></i>
                </div>
                <h2>Certificate Verified Successfully!</h2>
                <div class="cert-details">
                    <div class="detail-row">
                        <span class="detail-label"><i class="fas fa-id-card"></i> Certificate ID:</span>
                        <span class="detail-value">${certificate.id}</span>
                    </div>
                    <div class="detail-row">
                        <span class="detail-label"><i class="fas fa-user"></i> Student Name:</span>
                        <span class="detail-value">${certificate.studentName}</span>
                    </div>
                    <div class="detail-row">
                        <span class="detail-label"><i class="fas fa-graduation-cap"></i> Course:</span>
                        <span class="detail-value">${certificate.courseName}</span>
                    </div>
                    <div class="detail-row">
                        <span class="detail-label"><i class="fas fa-calendar"></i> Issue Date:</span>
                        <span class="detail-value">${formatDate(certificate.issueDate)}</span>
                    </div>
                    <div class="detail-row">
                        <span class="detail-label"><i class="fas fa-shield-alt"></i> Status:</span>
                        <span class="detail-value status-valid"><i class="fas fa-check"></i> ${certificate.status.toUpperCase()}</span>
                    </div>
                </div>
                <div class="cert-actions">
                    <a href="${certificateUrl}" target="_blank" class="btn btn-primary">
                        <i class="fas fa-certificate"></i> View Full Certificate
                    </a>
                </div>
            </div>
        `;
    } else {
        resultDiv.innerHTML = `
            <div class="verification-error">
                <div class="error-icon">
                    <i class="fas fa-times-circle"></i>
                </div>
                <h2>Certificate Not Found</h2>
                <p>The certificate ID "<strong>${certificateId}</strong>" does not exist in our database.</p>
                <p>Please check the ID and try again. Certificate IDs are case-sensitive.</p>
            </div>
        `;
    }
    
    resultDiv.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

document.getElementById('certificateId')?.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        verifyCertificate();
    }
});
