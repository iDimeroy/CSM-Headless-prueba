// ═══════════════════════════════════════════════════════════════
// Auth — Login page logic
// ═══════════════════════════════════════════════════════════════

(function () {
    'use strict';

    // If already logged in, redirect to dashboard
    if (localStorage.getItem('cms_token')) {
        window.location.href = '/admin/index.html';
        return;
    }

    const form = document.getElementById('loginForm');
    const errorBox = document.getElementById('loginError');
    const btnText = document.querySelector('.btn__text');
    const btnLoader = document.querySelector('.btn__loader');
    const loginBtn = document.getElementById('loginBtn');
    const togglePassword = document.getElementById('togglePassword');

    // Password visibility toggle
    togglePassword?.addEventListener('click', () => {
        const input = document.getElementById('password');
        input.type = input.type === 'password' ? 'text' : 'password';
    });

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        errorBox.style.display = 'none';

        const username = document.getElementById('username').value.trim();
        const password = document.getElementById('password').value;

        if (!username || !password) {
            showError('Por favor completa todos los campos.');
            return;
        }

        // Show loading state
        btnText.style.display = 'none';
        btnLoader.style.display = 'inline-flex';
        loginBtn.disabled = true;

        try {
            const res = await fetch('/api/v1/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password })
            });

            if (!res.ok) {
                const data = await res.json().catch(() => ({}));
                throw new Error(data.detail || 'Credenciales inválidas');
            }

            const data = await res.json();
            localStorage.setItem('cms_token', data.token);
            localStorage.setItem('cms_username', data.username);
            localStorage.setItem('cms_role', data.role);

            window.location.href = '/admin/index.html';
        } catch (err) {
            showError(err.message);
        } finally {
            btnText.style.display = 'inline';
            btnLoader.style.display = 'none';
            loginBtn.disabled = false;
        }
    });

    function showError(msg) {
        errorBox.textContent = msg;
        errorBox.style.display = 'block';
    }
})();
