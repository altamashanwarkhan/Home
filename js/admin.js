document.addEventListener('DOMContentLoaded', async function() {
    const authenticated = await isAdminAuthenticated();
    if (authenticated) {
        showAdminPanel();
    }
    setTodayDate();
});

function setTodayDate() {
    const today = new Date().toISOString().split('T')[0];
    const issueDateInput = document.getElementById('issueDate');
    if (issueDateInput) {
        issueDateInput.value = today;
    }
}

async function adminLogin() {
    const password = document.getElementById('adminPassword').value;
    const success = await setAdminAuthenticated(password);
    
    if (success) {
        showAdminPanel();
    } else {
        alert('Incorrect password! Please try again.');
    }
}

async function adminLogout() {
    if (confirm('Are you sure you want to logout?')) {
        await adminLogoutAPI();
        window.location.reload();
    }
}

function showAdminPanel() {
    document.getElementById('loginSection').style.display = 'none';
    document.getElementById('adminPanel').style.display = 'block';
    loadCertificates();
    updateStats();
}

async function createCertificate(event) {
    event.preventDefault();
    
    const studentName = document.getElementById('studentName').value.trim();
    const courseName = document.getElementById('courseName').value;
    const issueDate = document.getElementById('issueDate').value;
    
    if (!studentName || !courseName || !issueDate) {
        alert('Please fill in all fields');
        return;
    }
    
    const certificate = await addCertificate(studentName, courseName, issueDate);
    
    if (certificate) {
        document.getElementById('certificateForm').reset();
        setTodayDate();
        
        loadCertificates();
        updateStats();
        
        alert(`Certificate created successfully!\nCertificate ID: ${certificate.id}\nView at: ${getCertificateUrl(certificate.id)}`);
    } else {
        alert('Failed to create certificate. Please try again.');
    }
}

async function loadCertificates() {
    const certificates = await getCertificates();
    const tbody = document.getElementById('certificatesBody');
    const noCerts = document.getElementById('noCertificates');
    
    tbody.innerHTML = '';
    
    if (certificates.length === 0) {
        noCerts.style.display = 'block';
        noCerts.querySelector('p').textContent = 'No certificates found. Create your first certificate!';
        return;
    }
    
    noCerts.style.display = 'none';
    
    certificates.forEach(cert => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td><strong>${cert.id}</strong></td>
            <td>${cert.studentName}</td>
            <td>${cert.courseName}</td>
            <td>${formatDate(cert.issueDate)}</td>
            <td>
                <button onclick="viewCertificate('${cert.id}')" class="btn-action btn-view" title="View Certificate">
                    <i class="fas fa-eye"></i>
                </button>
                <button onclick="copyCertificateLink('${cert.id}')" class="btn-action btn-copy" title="Copy Link">
                    <i class="fas fa-link"></i>
                </button>
                <button onclick="deleteCert('${cert.id}')" class="btn-action btn-delete" title="Delete">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        `;
        tbody.appendChild(row);
    });
}

async function updateStats() {
    const certificates = await getCertificates();
    document.getElementById('totalCerts').textContent = certificates.length;
}

function viewCertificate(id) {
    window.open(getCertificateUrl(id), '_blank');
}

function copyCertificateLink(id) {
    const url = getCertificateUrl(id);
    navigator.clipboard.writeText(url).then(() => {
        alert('Certificate URL copied to clipboard!');
    }).catch(() => {
        prompt('Copy this URL:', url);
    });
}

async function deleteCert(id) {
    if (confirm('Are you sure you want to delete this certificate? This action cannot be undone.')) {
        const success = await deleteCertificate(id);
        if (success) {
            loadCertificates();
            updateStats();
        } else {
            alert('Failed to delete certificate.');
        }
    }
}

async function searchCertificates() {
    const searchTerm = document.getElementById('searchCert').value.toLowerCase();
    const certificates = await getCertificates();
    const tbody = document.getElementById('certificatesBody');
    const noCerts = document.getElementById('noCertificates');
    
    tbody.innerHTML = '';
    
    const filtered = certificates.filter(cert => 
        cert.id.toLowerCase().includes(searchTerm) ||
        cert.studentName.toLowerCase().includes(searchTerm) ||
        cert.courseName.toLowerCase().includes(searchTerm)
    );
    
    if (filtered.length === 0) {
        noCerts.style.display = 'block';
        noCerts.querySelector('p').textContent = 'No certificates match your search.';
        return;
    }
    
    noCerts.style.display = 'none';
    
    filtered.forEach(cert => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td><strong>${cert.id}</strong></td>
            <td>${cert.studentName}</td>
            <td>${cert.courseName}</td>
            <td>${formatDate(cert.issueDate)}</td>
            <td>
                <button onclick="viewCertificate('${cert.id}')" class="btn-action btn-view" title="View Certificate">
                    <i class="fas fa-eye"></i>
                </button>
                <button onclick="copyCertificateLink('${cert.id}')" class="btn-action btn-copy" title="Copy Link">
                    <i class="fas fa-link"></i>
                </button>
                <button onclick="deleteCert('${cert.id}')" class="btn-action btn-delete" title="Delete">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        `;
        tbody.appendChild(row);
    });
}
