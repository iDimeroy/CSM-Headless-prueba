// ═══════════════════════════════════════════════════════════════
// Admin Dashboard — Page, Block & Carousel management
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

    // Carousel DOM refs
    const carouselTableBody = document.getElementById('carouselTableBody');
    const carouselModal = document.getElementById('carouselModal');
    const carouselForm = document.getElementById('carouselForm');
    const carouselModalTitle = document.getElementById('carouselModalTitle');
    const carouselFormError = document.getElementById('carouselFormError');

    const sectionPages = document.getElementById('sectionPages');
    const sectionCarousel = document.getElementById('sectionCarousel');
    const sectionLanding = document.getElementById('sectionLanding');
    const sectionModulos = document.getElementById('sectionModulos');
    const sectionNoticias = document.getElementById('sectionNoticias');

    const landingBlocksList = document.getElementById('landingBlocksList');

    const topbarTitle = document.querySelector('.topbar__title');
    const createPageBtn = document.getElementById('createPageBtn');
    const sidebarLinks = document.querySelectorAll('.sidebar__link');

    let currentPageId = null;
    let currentSection = 'pages';
    let blocksCache = {};
    let landingPageId = null;
    let currentLandingBlocks = [];

    // ── Section switching ────────────────────────────────────
    sidebarLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const section = link.dataset.section;

            // Manage submenu toggle
            if (section === 'landing') {
                const container = document.getElementById('landingMenuContainer');
                if (container) container.classList.toggle('open');
            } else {
                const container = document.getElementById('landingMenuContainer');
                if (container) container.classList.remove('open');
            }

            switchSection(section);
        });
    });

    // Submenu links handling
    document.querySelectorAll('.sidebar__sublink').forEach(link => {
        link.addEventListener('click', async (e) => {
            e.preventDefault();
            const blockType = link.dataset.block;

            if (currentSection !== 'landing') {
                switchSection('landing');
            }

            if (!landingPageId) await loadLandingPage();

            const existingBlock = currentLandingBlocks.find(b => b.type === blockType);
            if (existingBlock) {
                AdminApp.editBlock(existingBlock.id);
            } else {
                openBlockEditModal(null, blockType);
            }
        });
    });

    function switchSection(section) {
        currentSection = section;

        // Update sidebar active
        sidebarLinks.forEach(l => l.classList.remove('sidebar__link--active'));
        document.querySelector(`[data-section="${section}"]`)?.classList.add('sidebar__link--active');

        // Toggle sections
        sectionPages.style.display = section === 'pages' ? '' : 'none';
        sectionLanding.style.display = section === 'landing' ? '' : 'none';
        sectionModulos.style.display = section === 'modulos' ? '' : 'none';
        sectionNoticias.style.display = section === 'noticias' ? '' : 'none';
        sectionCarousel.style.display = section === 'carousel' ? '' : 'none';

        // Update topbar
        if (section === 'pages') {
            topbarTitle.textContent = 'Páginas';
            createPageBtn.style.display = '';
            createPageBtn.textContent = '';
            createPageBtn.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg> Nueva Página';
            createPageBtn.onclick = () => openPageModal();
            loadPages();
        } else if (section === 'landing') {
            topbarTitle.textContent = 'Landing Page';
            createPageBtn.style.display = 'none';
            loadLandingPage();
        } else if (section === 'modulos') {
            topbarTitle.textContent = 'Módulos';
            createPageBtn.style.display = 'none';
        } else if (section === 'noticias') {
            topbarTitle.textContent = 'Noticias';
            createPageBtn.style.display = 'none';
        } else if (section === 'carousel') {
            topbarTitle.textContent = 'Panel de Gestión de Carrusel';
            createPageBtn.style.display = '';
            createPageBtn.textContent = '';
            createPageBtn.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg> Nuevo Slide';
            createPageBtn.onclick = () => openCarouselModal();
            loadCarousel();
        }
    }

    // ── Toast ────────────────────────────────────────────────
    function toast(message, type = 'success') {
        const el = document.createElement('div');
        el.className = `toast toast--${type}`;
        el.textContent = message;
        toastContainer.appendChild(el);
        setTimeout(() => el.remove(), 3000);
    }

    // ── Helpers ──────────────────────────────────────────────
    function formatDate(iso) {
        if (!iso) return '—';
        const d = new Date(iso);
        return d.toLocaleDateString('es-MX', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
    }

    function formatDateShort(iso) {
        if (!iso) return '—';
        const d = new Date(iso);
        return d.toLocaleDateString('es-MX', { day: '2-digit', month: 'short', year: 'numeric' });
    }

    function esc(str) {
        if (str == null) return '';
        const div = document.createElement('div');
        div.textContent = str;
        return div.innerHTML;
    }

    // ══════════════════════════════════════════════════════════
    //  PAGES SECTION
    // ══════════════════════════════════════════════════════════

    async function loadPages() {
        try {
            const pages = await API.get('/admin/pages');
            renderPagesTable(pages);
        } catch (err) {
            pagesTableBody.innerHTML = `<tr><td colspan="6" class="table-empty" style="color:var(--danger);">Error: ${err.message}</td></tr>`;
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
            renderBlocksList(page.blocks || [], blocksList);
        } catch (err) {
            blocksList.innerHTML = `<div class="blocks-empty" style="color:var(--danger);">Error: ${err.message}</div>`;
        }
    }

    async function loadLandingPage() {
        try {
            landingBlocksList.innerHTML = '<div class="blocks-empty">Cargando bloques...</div>';
            const pages = await API.get('/admin/pages');
            let lp = pages.find(p => p.slug === 'landing-page');

            if (!lp) {
                lp = await API.post('/admin/pages', {
                    title: 'Landing Page',
                    slug: 'landing-page',
                    status: 'PUBLISHED'
                });
            }

            currentPageId = lp.id;
            landingPageId = lp.id;

            const fullPage = await API.get(`/admin/pages/${currentPageId}`);
            currentLandingBlocks = fullPage.blocks || [];
            renderBlocksList(currentLandingBlocks, landingBlocksList);

        } catch (err) {
            landingBlocksList.innerHTML = `<div class="blocks-empty" style="color:var(--danger);">Error: ${err.message}</div>`;
        }
    }

    function renderBlocksList(blocks, container) {
        if (!blocks.length) {
            container.innerHTML = '<div class="blocks-empty">No hay bloques. Agrega el primero.</div>';
            return;
        }
        blocks.sort((a, b) => a.sortOrder - b.sortOrder);
        // Cache block data so edit button can retrieve it by ID
        blocks.forEach(b => { blocksCache[b.id] = b; });
        container.innerHTML = blocks.map(b => `
            <div class="block-card">
                <div class="block-card__info">
                    <div class="block-card__order">${b.sortOrder}</div>
                    <div class="block-card__type"><strong>${esc(b.type)}</strong></div>
                </div>
                <div class="block-card__actions">
                    <button class="btn btn-ghost btn-sm" onclick="AdminApp.editBlock('${b.id}')" title="Editar">
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

        const selectedType = type || 'Titulo1';
        document.getElementById('blockType').value = selectedType;
        document.getElementById('blockSortOrder').value = sortOrder || 1;

        // Render dynamic form fields
        BlockForms.render(selectedType);

        // Populate form fields from existing payload
        let parsedPayload = null;
        if (payloadStr) {
            try {
                parsedPayload = typeof payloadStr === 'string' ? JSON.parse(payloadStr) : payloadStr;
                document.getElementById('blockPayload').value = JSON.stringify(parsedPayload, null, 2);
            } catch {
                document.getElementById('blockPayload').value = payloadStr;
            }
            // Populate the dynamic form fields
            if (parsedPayload) {
                BlockForms.populate(selectedType, parsedPayload);
            }
        } else {
            document.getElementById('blockPayload').value = '';
        }

        blockEditTitle.textContent = blockId ? 'Editar Bloque' : 'Nuevo Bloque';
        blockEditModal.style.display = 'flex';
    }

    // Re-render form fields when block type changes
    document.getElementById('blockType').addEventListener('change', (e) => {
        BlockForms.render(e.target.value);
        document.getElementById('blockPayload').value = '';
    });

    function closeBlockEditModal() { blockEditModal.style.display = 'none'; }

    blockEditForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        blockEditError.style.display = 'none';

        const blockType = document.getElementById('blockType').value;
        let payload;

        // First try to collect from dynamic form fields
        const formPayload = BlockForms.collect(blockType);
        const jsonTextarea = document.getElementById('blockPayload').value.trim();

        // Merge both, prioritizing visual form inputs
        let jsonPayload = {};
        if (jsonTextarea) {
            try {
                jsonPayload = JSON.parse(jsonTextarea);
            } catch (err) {
                blockEditError.textContent = 'JSON inválido: ' + err.message;
                blockEditError.style.display = 'block';
                return;
            }
        }

        if (Object.keys(formPayload).length > 0) {
            payload = { ...jsonPayload, ...formPayload };
        } else {
            payload = jsonPayload;
        }

        const blockId = document.getElementById('blockEditId').value;
        const pageId = document.getElementById('blockEditPageId').value;
        const body = {
            type: blockType,
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

            // Reload appropriate section
            if (currentSection === 'landing') {
                loadLandingPage();
            } else {
                loadBlocks(currentPageId);
            }
        } catch (err) {
            blockEditError.textContent = err.message;
            blockEditError.style.display = 'block';
        }
    });

    // ══════════════════════════════════════════════════════════
    //  CAROUSEL SECTION
    // ══════════════════════════════════════════════════════════

    async function loadCarousel() {
        try {
            const slides = await API.get('/admin/carousel');
            renderCarouselTable(slides);
        } catch (err) {
            carouselTableBody.innerHTML = `<tr><td colspan="7" class="table-empty" style="color:var(--danger);">Error: ${err.message}</td></tr>`;
        }
    }

    function renderCarouselTable(slides) {
        if (!slides.length) {
            carouselTableBody.innerHTML = '<tr><td colspan="7" class="table-empty">No hay slides. ¡Crea el primero!</td></tr>';
            return;
        }
        carouselTableBody.innerHTML = slides.map(s => `
            <tr>
                <td><div class="block-card__order" style="margin:0 auto;">${s.orden}</div></td>
                <td><strong>${esc(s.titulo)}</strong></td>
                <td style="max-width:200px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;color:var(--text-muted);font-size:0.82rem;">${esc(s.descripcion) || '—'}</td>
                <td>${s.botonTexto ? `<code style="background:var(--accent-glow);color:var(--gold);padding:0.15em 0.5em;border-radius:4px;">${esc(s.botonTexto)}</code>` : '—'}</td>
                <td><span class="badge badge--${s.estado.toLowerCase()}">${s.estado}</span></td>
                <td style="font-size:0.78rem;color:var(--text-dim);">${formatDateShort(s.fechaInicio)}<br>→ ${formatDateShort(s.fechaFinal)}</td>
                <td>
                    <div class="table-actions">
                        <button class="btn btn-ghost btn-sm" onclick="AdminApp.editSlide('${s.id}')" title="Editar">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                        </button>
                        <button class="btn btn-danger btn-sm" onclick="AdminApp.deleteSlide('${s.id}')" title="Eliminar">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
                        </button>
                    </div>
                </td>
            </tr>
        `).join('');
    }

    // ── Carousel CRUD modal ──────────────────────────────────
    function openCarouselModal(slide = null) {
        carouselFormError.style.display = 'none';
        carouselForm.reset();
        if (slide) {
            carouselModalTitle.textContent = 'Editar Slide';
            document.getElementById('slideId').value = slide.id;
            document.getElementById('slideTitulo').value = slide.titulo || '';
            document.getElementById('slideDescripcion').value = slide.descripcion || '';
            document.getElementById('slideImagenUrl').value = slide.imagenUrl || '';
            document.getElementById('slideBotonTexto').value = slide.botonTexto || '';
            document.getElementById('slideBotonUrl').value = slide.botonUrl || '';
            document.getElementById('slideOrden').value = slide.orden || 1;
            document.getElementById('slideEstado').value = slide.estado || 'DRAFT';

            // Date handling (ISO → datetime-local format)
            if (slide.fechaInicio) {
                document.getElementById('slideFechaInicio').value = new Date(slide.fechaInicio).toISOString().slice(0, 16);
            }
            if (slide.fechaFinal) {
                document.getElementById('slideFechaFinal').value = new Date(slide.fechaFinal).toISOString().slice(0, 16);
            }
        } else {
            carouselModalTitle.textContent = 'Nuevo Slide';
            document.getElementById('slideId').value = '';
        }
        carouselModal.style.display = 'flex';
    }

    function closeCarouselModal() { carouselModal.style.display = 'none'; }

    carouselForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        carouselFormError.style.display = 'none';

        const id = document.getElementById('slideId').value;
        const fechaInicio = document.getElementById('slideFechaInicio').value;
        const fechaFinal = document.getElementById('slideFechaFinal').value;

        const body = {
            titulo: document.getElementById('slideTitulo').value.trim(),
            descripcion: document.getElementById('slideDescripcion').value.trim() || null,
            imagenUrl: document.getElementById('slideImagenUrl').value.trim() || null,
            fechaInicio: fechaInicio ? new Date(fechaInicio).toISOString() : null,
            fechaFinal: fechaFinal ? new Date(fechaFinal).toISOString() : null,
            botonTexto: document.getElementById('slideBotonTexto').value.trim() || null,
            botonUrl: document.getElementById('slideBotonUrl').value.trim() || null,
            orden: parseInt(document.getElementById('slideOrden').value, 10),
            estado: document.getElementById('slideEstado').value,
        };

        try {
            if (id) {
                await API.put(`/admin/carousel/${id}`, body);
                toast('Slide actualizado');
            } else {
                await API.post('/admin/carousel', body);
                toast('Slide creado');
            }
            closeCarouselModal();
            loadCarousel();
        } catch (err) {
            carouselFormError.textContent = err.message;
            carouselFormError.style.display = 'block';
        }
    });

    // ── Event bindings ───────────────────────────────────────
    document.getElementById('createPageBtn').addEventListener('click', () => {
        if (currentSection === 'carousel') openCarouselModal();
        else openPageModal();
    });
    document.getElementById('addLandingBlockBtn')?.addEventListener('click', () => {
        openBlockEditModal(null, 'Slider');
    });
    document.getElementById('closePageModal').addEventListener('click', closePageModal);
    document.getElementById('cancelPageModal').addEventListener('click', closePageModal);
    document.getElementById('closeBlocksModal').addEventListener('click', closeBlocksModal);
    document.getElementById('addBlockBtn').addEventListener('click', () => openBlockEditModal(null));
    document.getElementById('closeBlockEditModal').addEventListener('click', closeBlockEditModal);
    document.getElementById('cancelBlockEditModal').addEventListener('click', closeBlockEditModal);
    document.getElementById('closeCarouselModal').addEventListener('click', closeCarouselModal);
    document.getElementById('cancelCarouselModal').addEventListener('click', closeCarouselModal);

    // Close modals on backdrop click
    [pageModal, blocksModal, blockEditModal, carouselModal].forEach(modal => {
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

        editBlock(blockId) {
            const block = blocksCache[blockId];
            if (!block) {
                toast('No se pudo cargar el bloque', 'error');
                return;
            }
            openBlockEditModal(blockId, block.type, block.sortOrder, block.payload);
        },

        async deleteBlock(blockId) {
            if (!confirm('¿Eliminar este bloque?')) return;
            try {
                await API.del(`/admin/blocks/${blockId}`);
                toast('Bloque eliminado');
                if (currentSection === 'landing') {
                    loadLandingPage();
                } else {
                    loadBlocks(currentPageId);
                }
            } catch (err) { toast(err.message, 'error'); }
        },

        async editSlide(id) {
            try {
                const slide = await API.get(`/admin/carousel/${id}`);
                openCarouselModal(slide);
            } catch (err) { toast(err.message, 'error'); }
        },

        async deleteSlide(id) {
            if (!confirm('¿Eliminar este slide del carrusel?')) return;
            try {
                await API.del(`/admin/carousel/${id}`);
                toast('Slide eliminado');
                loadCarousel();
            } catch (err) { toast(err.message, 'error'); }
        },
    };

    // ── Init ─────────────────────────────────────────────────
    loadPages();

})();
