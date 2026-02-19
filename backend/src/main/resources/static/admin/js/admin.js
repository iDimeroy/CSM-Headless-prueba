// ═══════════════════════════════════════════════════════════════
// Admin Dashboard — Page & Block management
// ═══════════════════════════════════════════════════════════════

(function () {
    'use strict';

    // ── Auth guard ───────────────────────────────────────────
    if (!localStorage.getItem('cms_token')) {
        window.location.href = '/admin/login.html';
        return;
    }

    // Display user info
    const username = localStorage.getItem('cms_username') || 'admin';
    const role = localStorage.getItem('cms_role') || 'ADMIN';
    document.getElementById('displayUsername').textContent = username;
    document.getElementById('displayRole').textContent = role;
    document.querySelector('.sidebar__avatar').textContent = username.charAt(0).toUpperCase();

    // ── DOM refs ─────────────────────────────────────────────
    const pagesTableBody = document.getElementById('pagesTableBody');
    const pageModal = document.getElementById('pageModal');
    const pageForm = document.getElementById('pageForm');
    const pageModalTitle = document.getElementById('pageModalTitle');
    const pageFormError = document.getElementById('pageFormError');
    const blocksModal = document.getElementById('blocksModal');
    const blocksList = document.getElementById('blocksList');
    const blocksPageTitle = document.getElementById('blocksPageTitle');
    const blocksFormError = document.getElementById('blocksFormError');
    const blockEditModal = document.getElementById('blockEditModal');
    const blockEditForm = document.getElementById('blockEditForm');
    const blockEditTitle = document.getElementById('blockEditTitle');
    const blockEditError = document.getElementById('blockEditError');
    const toastContainer = document.getElementById('toastContainer');

    let currentPageId = null;

    // ── Toast ────────────────────────────────────────────────
    function toast(message, type = 'success') {
        const el = document.createElement('div');
        el.className = `toast toast--${type}`;
        el.textContent = message;
        toastContainer.appendChild(el);
        setTimeout(() => el.remove(), 3000);
    }

    // ── Load pages ───────────────────────────────────────────
    async function loadPages() {
        try {
            const pages = await API.get('/admin/pages');
            renderPagesTable(pages);
        } catch (err) {
            pagesTableBody.innerHTML = `<tr><td colspan="6" class="table-empty" style="color:#fca5a5;">Error: ${err.message}</td></tr>`;
        }
    }

    function renderPagesTable(pages) {
        if (!pages.length) {
            pagesTableBody.innerHTML = '<tr><td colspan="6" class="table-empty">No hay páginas. ¡Crea la primera!</td></tr>';
            return;
        }
        pagesTableBody.innerHTML = pages.map(p => `
            <tr>
                <td><strong>${esc(p.title)}</strong></td>
                <td><code style="color:var(--primary-hover);background:var(--primary-glow);padding:0.15em 0.5em;border-radius:4px;">/${esc(p.slug)}</code></td>
                <td><span class="badge badge--${p.status.toLowerCase()}">${p.status}</span></td>
                <td>${p.blocks ? p.blocks.length : 0}</td>
                <td style="color:var(--text-dim);font-size:0.8rem;">${formatDate(p.updatedAt)}</td>
                <td>
                    <div class="table-actions">
                        <button class="btn btn-ghost btn-sm" onclick="AdminApp.editPage('${p.id}')" title="Editar">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                        </button>
                        <button class="btn btn-ghost btn-sm" onclick="AdminApp.manageBlocks('${p.id}', '${esc(p.title)}')" title="Bloques">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg>
                        </button>
                        <button class="btn btn-danger btn-sm" onclick="AdminApp.deletePage('${p.id}')" title="Eliminar">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
                        </button>
                    </div>
                </td>
            </tr>
        `).join('');
    }

    function formatDate(iso) {
        if (!iso) return '—';
        const d = new Date(iso);
        return d.toLocaleDateString('es-MX', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
    }

    function esc(str) {
        const div = document.createElement('div');
        div.textContent = str;
        return div.innerHTML;
    }

    // ── Page CRUD ────────────────────────────────────────────
    function openPageModal(page = null) {
        pageFormError.style.display = 'none';
        pageForm.reset();
        if (page) {
            pageModalTitle.textContent = 'Editar Página';
            document.getElementById('pageId').value = page.id;
            document.getElementById('pageTitle').value = page.title;
            document.getElementById('pageSlug').value = page.slug;
            document.getElementById('pageSeoTitle').value = page.seoTitle || '';
            document.getElementById('pageStatus').value = page.status;
        } else {
            pageModalTitle.textContent = 'Nueva Página';
            document.getElementById('pageId').value = '';
        }
        pageModal.style.display = 'flex';
    }

    function closePageModal() { pageModal.style.display = 'none'; }

    pageForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        pageFormError.style.display = 'none';
        const id = document.getElementById('pageId').value;
        const body = {
            title: document.getElementById('pageTitle').value.trim(),
            slug: document.getElementById('pageSlug').value.trim(),
            seoTitle: document.getElementById('pageSeoTitle').value.trim() || null,
            status: document.getElementById('pageStatus').value,
        };
        try {
            if (id) {
                await API.put(`/admin/pages/${id}`, body);
                toast('Página actualizada');
            } else {
                await API.post('/admin/pages', body);
                toast('Página creada');
            }
            closePageModal();
            loadPages();
        } catch (err) {
            pageFormError.textContent = err.message;
            pageFormError.style.display = 'block';
        }
    });

    // ── Blocks management ────────────────────────────────────
    async function openBlocksModal(pageId, pageTitle) {
        currentPageId = pageId;
        blocksPageTitle.textContent = pageTitle;
        blocksFormError.style.display = 'none';
        blocksModal.style.display = 'flex';
        await loadBlocks(pageId);
    }

    function closeBlocksModal() { blocksModal.style.display = 'none'; }

    async function loadBlocks(pageId) {
        try {
            const page = await API.get(`/admin/pages/${pageId}`);
            renderBlocksList(page.blocks || []);
        } catch (err) {
            blocksList.innerHTML = `<div class="blocks-empty" style="color:#fca5a5;">Error: ${err.message}</div>`;
        }
    }

    function renderBlocksList(blocks) {
        if (!blocks.length) {
            blocksList.innerHTML = '<div class="blocks-empty">No hay bloques. Agrega el primero.</div>';
            return;
        }
        blocks.sort((a, b) => a.sortOrder - b.sortOrder);
        blocksList.innerHTML = blocks.map(b => `
            <div class="block-card">
                <div class="block-card__info">
                    <div class="block-card__order">${b.sortOrder}</div>
                    <div class="block-card__type">${esc(b.type)}</div>
                </div>
                <div class="block-card__actions">
                    <button class="btn btn-ghost btn-sm" onclick="AdminApp.editBlock('${b.id}', '${esc(b.type)}', ${b.sortOrder}, ${esc(JSON.stringify(JSON.stringify(b.payload)))})" title="Editar">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                    </button>
                    <button class="btn btn-danger btn-sm" onclick="AdminApp.deleteBlock('${b.id}')" title="Eliminar">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
                    </button>
                </div>
            </div>
        `).join('');
    }

    // ── Block edit modal ─────────────────────────────────────
    function openBlockEditModal(blockId, type, sortOrder, payloadStr) {
        blockEditError.style.display = 'none';
        blockEditForm.reset();
        document.getElementById('blockEditId').value = blockId || '';
        document.getElementById('blockEditPageId').value = currentPageId;
        document.getElementById('blockType').value = type || 'HeroSection';
        document.getElementById('blockSortOrder').value = sortOrder || 1;

        if (payloadStr) {
            try {
                const parsed = typeof payloadStr === 'string' ? JSON.parse(payloadStr) : payloadStr;
                document.getElementById('blockPayload').value = JSON.stringify(parsed, null, 2);
            } catch {
                document.getElementById('blockPayload').value = payloadStr;
            }
        } else {
            document.getElementById('blockPayload').value = '{\n  \n}';
        }

        blockEditTitle.textContent = blockId ? 'Editar Bloque' : 'Nuevo Bloque';
        blockEditModal.style.display = 'flex';
    }

    function closeBlockEditModal() { blockEditModal.style.display = 'none'; }

    blockEditForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        blockEditError.style.display = 'none';

        let payload;
        try {
            payload = JSON.parse(document.getElementById('blockPayload').value);
        } catch (err) {
            blockEditError.textContent = 'JSON inválido: ' + err.message;
            blockEditError.style.display = 'block';
            return;
        }

        const blockId = document.getElementById('blockEditId').value;
        const pageId = document.getElementById('blockEditPageId').value;
        const body = {
            type: document.getElementById('blockType').value,
            sortOrder: parseInt(document.getElementById('blockSortOrder').value, 10),
            payload,
        };

        try {
            if (blockId) {
                await API.put(`/admin/blocks/${blockId}`, body);
                toast('Bloque actualizado');
            } else {
                await API.post(`/admin/pages/${pageId}/blocks`, body);
                toast('Bloque creado');
            }
            closeBlockEditModal();
            loadBlocks(currentPageId);
        } catch (err) {
            blockEditError.textContent = err.message;
            blockEditError.style.display = 'block';
        }
    });

    // ── Event bindings ───────────────────────────────────────
    document.getElementById('createPageBtn').addEventListener('click', () => openPageModal());
    document.getElementById('closePageModal').addEventListener('click', closePageModal);
    document.getElementById('cancelPageModal').addEventListener('click', closePageModal);
    document.getElementById('closeBlocksModal').addEventListener('click', closeBlocksModal);
    document.getElementById('addBlockBtn').addEventListener('click', () => openBlockEditModal(null));
    document.getElementById('closeBlockEditModal').addEventListener('click', closeBlockEditModal);
    document.getElementById('cancelBlockEditModal').addEventListener('click', closeBlockEditModal);

    // Close modals on backdrop click
    [pageModal, blocksModal, blockEditModal].forEach(modal => {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) modal.style.display = 'none';
        });
    });

    // Logout
    document.getElementById('logoutBtn').addEventListener('click', () => {
        localStorage.clear();
        window.location.href = '/admin/login.html';
    });

    // Mobile menu toggle
    document.getElementById('menuToggle')?.addEventListener('click', () => {
        document.getElementById('sidebar').classList.toggle('open');
    });

    // ── Global API (called from inline onclick) ──────────────
    window.AdminApp = {
        async editPage(id) {
            try {
                const page = await API.get(`/admin/pages/${id}`);
                openPageModal(page);
            } catch (err) { toast(err.message, 'error'); }
        },

        async deletePage(id) {
            if (!confirm('¿Estás seguro de eliminar esta página y todos sus bloques?')) return;
            try {
                await API.del(`/admin/pages/${id}`);
                toast('Página eliminada');
                loadPages();
            } catch (err) { toast(err.message, 'error'); }
        },

        manageBlocks(pageId, title) {
            openBlocksModal(pageId, title);
        },

        editBlock(blockId, type, sortOrder, payloadStr) {
            openBlockEditModal(blockId, type, sortOrder, payloadStr);
        },

        async deleteBlock(blockId) {
            if (!confirm('¿Eliminar este bloque?')) return;
            try {
                await API.del(`/admin/blocks/${blockId}`);
                toast('Bloque eliminado');
                loadBlocks(currentPageId);
            } catch (err) { toast(err.message, 'error'); }
        },
    };

    // ── Init ─────────────────────────────────────────────────
    loadPages();

})();
