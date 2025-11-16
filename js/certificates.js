const API_BASE = '';

async function isAdminAuthenticated() {
    try {
        const response = await fetch(`${API_BASE}/api/auth/check`);
        const data = await response.json();
        return data.authenticated;
    } catch (error) {
        console.error('Auth check failed:', error);
        return false;
    }
}

async function setAdminAuthenticated(password) {
    try {
        const response = await fetch(`${API_BASE}/api/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ password })
        });
        const data = await response.json();
        return data.success;
    } catch (error) {
        console.error('Login failed:', error);
        return false;
    }
}

async function adminLogoutAPI() {
    try {
        await fetch(`${API_BASE}/api/auth/logout`, { method: 'POST' });
        return true;
    } catch (error) {
        console.error('Logout failed:', error);
        return false;
    }
}

async function getCertificates() {
    try {
        const response = await fetch(`${API_BASE}/api/certificates`);
        if (!response.ok) throw new Error('Failed to fetch certificates');
        return await response.json();
    } catch (error) {
        console.error('Get certificates failed:', error);
        return [];
    }
}

async function getCertificateById(id) {
    try {
        const response = await fetch(`${API_BASE}/api/certificates/${id}`);
        if (!response.ok) return null;
        return await response.json();
    } catch (error) {
        console.error('Get certificate failed:', error);
        return null;
    }
}

async function addCertificate(studentName, courseName, issueDate) {
    try {
        const response = await fetch(`${API_BASE}/api/certificates`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                studentName,
                courseName,
                issueDate
            })
        });
        if (!response.ok) throw new Error('Failed to create certificate');
        return await response.json();
    } catch (error) {
        console.error('Create certificate failed:', error);
        return null;
    }
}

async function deleteCertificate(certificateId) {
    try {
        const response = await fetch(`${API_BASE}/api/certificates/${certificateId}`, {
            method: 'DELETE'
        });
        return response.ok;
    } catch (error) {
        console.error('Delete certificate failed:', error);
        return false;
    }
}

function formatDate(dateString) {
    const date = new Date(dateString);
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString('en-US', options);
}

function getBaseUrl() {
    return window.location.origin + '/';
}

function getCertificateUrl(certificateId) {
    return getBaseUrl() + 'certificate.html?id=' + certificateId;
}

function getVerifyUrl() {
    return getBaseUrl() + 'verify.html';
}
