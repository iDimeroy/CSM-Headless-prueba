// ═══════════════════════════════════════════════════════════════
// API helper — wraps fetch with JWT auth headers
// ═══════════════════════════════════════════════════════════════

const API = {
    BASE: '/api/v1',

    _headers() {
        const h = { 'Content-Type': 'application/json' };
        const token = localStorage.getItem('cms_token');
        if (token) h['Authorization'] = `Bearer ${token}`;
        return h;
    },

    async _request(method, path, body) {
        const opts = { method, headers: this._headers() };
        if (body) opts.body = JSON.stringify(body);

        const res = await fetch(this.BASE + path, opts);

        if (res.status === 401 || res.status === 403) {
            localStorage.clear();
            window.location.href = '/admin/login.html';
            throw new Error('Session expired');
        }

        if (res.status === 204) return null;

        const data = await res.json().catch(() => ({}));
        if (!res.ok) throw new Error(data.detail || data.message || `Error ${res.status}`);
        return data;
    },

    get(path) { return this._request('GET', path); },
    post(path, body) { return this._request('POST', path, body); },
    put(path, body) { return this._request('PUT', path, body); },
    del(path) { return this._request('DELETE', path); },
};
