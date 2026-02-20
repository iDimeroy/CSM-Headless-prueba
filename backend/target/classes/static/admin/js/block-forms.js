// ═══════════════════════════════════════════════════════════════
// Block Forms — Dynamic form fields per block type
// ═══════════════════════════════════════════════════════════════

const BlockForms = {

    // ── Form field generators per block type ──────────────────
    FORMS: {

        Slider: () => `
            <p style="color:var(--text-muted);font-size:0.85rem;margin-bottom:0.5rem;">
                El Slider usa los slides del Carrusel. No requiere campos adicionales.
            </p>`,

        Titulo1: () => `
            <div class="form-group">
                <label class="form-label">Texto del Título</label>
                <input type="text" class="form-input" data-field="text" placeholder="Encabezado principal..." required>
            </div>
            <div class="form-group">
                <label class="form-label">Alineación</label>
                <select class="form-input" data-field="align">
                    <option value="left">Izquierda</option>
                    <option value="center">Centro</option>
                    <option value="right">Derecha</option>
                </select>
            </div>`,

        Titulo2: () => `
            <div class="form-group">
                <label class="form-label">Texto del Título</label>
                <input type="text" class="form-input" data-field="text" placeholder="Encabezado secundario..." required>
            </div>
            <div class="form-group">
                <label class="form-label">Alineación</label>
                <select class="form-input" data-field="align">
                    <option value="left">Izquierda</option>
                    <option value="center">Centro</option>
                    <option value="right">Derecha</option>
                </select>
            </div>`,

        Imagen: () => `
            <div class="form-group">
                <label class="form-label">URL de la Imagen</label>
                <input type="text" class="form-input" data-field="imageUrl" placeholder="https://..." required>
            </div>
            <div class="form-group">
                <label class="form-label">Texto alternativo (alt)</label>
                <input type="text" class="form-input" data-field="alt" placeholder="Descripción de la imagen...">
            </div>
            <div class="form-row">
                <div class="form-group">
                    <label class="form-label">Pie de imagen (caption)</label>
                    <input type="text" class="form-input" data-field="caption" placeholder="Opcional...">
                </div>
                <div class="form-group">
                    <label class="form-label">Ancho (px o %)</label>
                    <input type="text" class="form-input" data-field="width" placeholder="100% o 600px">
                </div>
            </div>`,

        Descripcion: () => `
            <div class="form-group">
                <label class="form-label">Contenido (acepta HTML)</label>
                <textarea class="form-input form-textarea" data-field="content" rows="6"
                    placeholder="Escribe el texto aquí. Puedes usar <b>negritas</b>, <i>itálicas</i>, <a>enlaces</a>..." required></textarea>
            </div>
            <div class="form-group">
                <label class="form-label">Alineación</label>
                <select class="form-input" data-field="align">
                    <option value="left">Izquierda</option>
                    <option value="center">Centro</option>
                    <option value="justify">Justificado</option>
                </select>
            </div>`,

        Boton: () => `
            <div class="form-row">
                <div class="form-group">
                    <label class="form-label">Texto del Botón</label>
                    <input type="text" class="form-input" data-field="text" placeholder="Más información" required>
                </div>
                <div class="form-group">
                    <label class="form-label">URL del enlace</label>
                    <input type="text" class="form-input" data-field="url" placeholder="https://..." required>
                </div>
            </div>
            <div class="form-row">
                <div class="form-group">
                    <label class="form-label">Estilo</label>
                    <select class="form-input" data-field="style">
                        <option value="primary">Primario</option>
                        <option value="secondary">Secundario</option>
                        <option value="outline">Contorno</option>
                    </select>
                </div>
                <div class="form-group">
                    <label class="form-label">Alineación</label>
                    <select class="form-input" data-field="align">
                        <option value="left">Izquierda</option>
                        <option value="center">Centro</option>
                        <option value="right">Derecha</option>
                    </select>
                </div>
            </div>`,

        Mapa: () => `
            <div class="form-group">
                <label class="form-label">URL de Google Maps (embed)</label>
                <input type="text" class="form-input" data-field="embedUrl"
                    placeholder="https://www.google.com/maps/embed?pb=..." required>
                <small style="color:var(--text-dim);font-size:0.7rem;">
                    En Google Maps → Compartir → Incorporar un mapa → copia la URL del src del iframe
                </small>
            </div>
            <div class="form-row">
                <div class="form-group">
                    <label class="form-label">Título del mapa</label>
                    <input type="text" class="form-input" data-field="title" placeholder="Ubicación de COBATAB">
                </div>
                <div class="form-group">
                    <label class="form-label">Altura (px)</label>
                    <input type="number" class="form-input" data-field="height" value="450" min="200" max="800">
                </div>
            </div>`,

        Acordeon: () => {
            return `
            <div id="acordeonItems">
                <div class="acordeon-item" style="background:var(--bg);border:1px solid var(--border);border-radius:var(--radius);padding:1rem;margin-bottom:0.75rem;">
                    <div class="form-group">
                        <label class="form-label" style="font-size:0.8rem;">Título de la sección</label>
                        <input type="text" class="form-input acordeon-title" placeholder="Pregunta o título..." required>
                    </div>
                    <div class="form-group">
                        <label class="form-label" style="font-size:0.8rem;">Contenido</label>
                        <textarea class="form-input acordeon-content" rows="3" placeholder="Respuesta o contenido..." required></textarea>
                    </div>
                </div>
            </div>
            <button type="button" class="btn btn-outline btn-sm" onclick="BlockForms.addAcordeonItem()" style="margin-top:0.25rem;">
                + Agregar sección
            </button>`;
        },

        Sandwich: () => `
            <div class="form-group">
                <label class="form-label">Texto superior</label>
                <textarea class="form-input form-textarea" data-field="topText" rows="3"
                    placeholder="Texto antes de la imagen (acepta HTML)..." required></textarea>
            </div>
            <div class="form-row">
                <div class="form-group">
                    <label class="form-label">URL de la Imagen</label>
                    <input type="text" class="form-input" data-field="imageUrl" placeholder="https://..." required>
                </div>
                <div class="form-group">
                    <label class="form-label">Alt de la imagen</label>
                    <input type="text" class="form-input" data-field="imageAlt" placeholder="Descripción...">
                </div>
            </div>
            <div class="form-group">
                <label class="form-label">Texto inferior</label>
                <textarea class="form-input form-textarea" data-field="bottomText" rows="3"
                    placeholder="Texto después de la imagen (acepta HTML)..." required></textarea>
            </div>`,

        // Legacy block types
        HeroSection: () => `
            <div class="form-group">
                <label class="form-label">Título</label>
                <input type="text" class="form-input" data-field="title" placeholder="Título principal..." required>
            </div>
            <div class="form-group">
                <label class="form-label">Subtítulo</label>
                <input type="text" class="form-input" data-field="subtitle" placeholder="Texto de apoyo...">
            </div>
            <div class="form-row">
                <div class="form-group">
                    <label class="form-label">Texto del CTA</label>
                    <input type="text" class="form-input" data-field="ctaText" placeholder="Ver más...">
                </div>
                <div class="form-group">
                    <label class="form-label">URL del CTA</label>
                    <input type="text" class="form-input" data-field="ctaUrl" placeholder="https://...">
                </div>
            </div>
            <div class="form-group">
                <label class="form-label">Imagen de fondo (URL)</label>
                <input type="text" class="form-input" data-field="backgroundImage" placeholder="https://...">
            </div>`,

        TextWithImage: () => `
            <div class="form-group">
                <label class="form-label">Título</label>
                <input type="text" class="form-input" data-field="title" placeholder="Título..." required>
            </div>
            <div class="form-group">
                <label class="form-label">Contenido (acepta HTML)</label>
                <textarea class="form-input form-textarea" data-field="content" rows="5"
                    placeholder="Texto del bloque..." required></textarea>
            </div>
            <div class="form-row">
                <div class="form-group">
                    <label class="form-label">URL de la Imagen</label>
                    <input type="text" class="form-input" data-field="imageUrl" placeholder="https://...">
                </div>
                <div class="form-group">
                    <label class="form-label">Layout</label>
                    <select class="form-input" data-field="layout">
                        <option value="image_right">Imagen a la derecha</option>
                        <option value="image_left">Imagen a la izquierda</option>
                    </select>
                </div>
            </div>
            <div class="form-group">
                <label class="form-label">Alt de la imagen</label>
                <input type="text" class="form-input" data-field="imageAlt" placeholder="Descripción de la imagen...">
            </div>`,

        FeaturesList: () => `
            <div class="form-group">
                <label class="form-label">Título de la sección</label>
                <input type="text" class="form-input" data-field="heading" placeholder="Nuestros servicios...">
            </div>
            <div class="form-group">
                <label class="form-label">Subtítulo</label>
                <input type="text" class="form-input" data-field="subheading" placeholder="Lo que ofrecemos...">
            </div>
            <div id="featuresItems">
                <div class="feature-item" style="background:var(--bg);border:1px solid var(--border);border-radius:var(--radius);padding:1rem;margin-bottom:0.75rem;">
                    <div class="form-row">
                        <div class="form-group">
                            <label class="form-label" style="font-size:0.8rem;">Icono (emoji/HTML)</label>
                            <input type="text" class="form-input feature-icon" placeholder="🎓" style="max-width:80px;">
                        </div>
                        <div class="form-group" style="flex:2;">
                            <label class="form-label" style="font-size:0.8rem;">Título</label>
                            <input type="text" class="form-input feature-title" placeholder="Título del feature..." required>
                        </div>
                    </div>
                    <div class="form-group">
                        <label class="form-label" style="font-size:0.8rem;">Descripción</label>
                        <textarea class="form-input feature-desc" rows="2" placeholder="Descripción..." required></textarea>
                    </div>
                </div>
            </div>
            <button type="button" class="btn btn-outline btn-sm" onclick="BlockForms.addFeatureItem()" style="margin-top:0.25rem;">
                + Agregar feature
            </button>`,
    },

    // ── Render fields for a type ─────────────────────────────
    render(type) {
        const container = document.getElementById('blockFormFields');
        const generator = this.FORMS[type];
        container.innerHTML = generator ? generator() : '<p style="color:var(--text-muted);">Sin campos adicionales.</p>';
    },

    // ── Populate fields from payload ─────────────────────────
    populate(type, payload) {
        if (!payload || typeof payload !== 'object') return;

        // Standard data-field inputs
        const fields = document.querySelectorAll('#blockFormFields [data-field]');
        fields.forEach(el => {
            const key = el.dataset.field;
            if (payload[key] != null) {
                el.value = payload[key];
            }
        });

        // Special: Acordeon items
        if (type === 'Acordeon' && Array.isArray(payload.items) && payload.items.length > 0) {
            const container = document.getElementById('acordeonItems');
            container.innerHTML = '';
            payload.items.forEach(item => {
                this.addAcordeonItem(item.title, item.content);
            });
        }

        // Special: FeaturesList items
        if (type === 'FeaturesList' && Array.isArray(payload.features) && payload.features.length > 0) {
            const container = document.getElementById('featuresItems');
            container.innerHTML = '';
            payload.features.forEach(f => {
                this.addFeatureItem(f.icon, f.title, f.description);
            });
        }
    },

    // ── Collect payload from form fields ─────────────────────
    collect(type) {
        const payload = {};

        // Collect all data-field inputs
        const fields = document.querySelectorAll('#blockFormFields [data-field]');
        fields.forEach(el => {
            const key = el.dataset.field;
            const value = el.value.trim();
            if (value) {
                // Convert number fields
                if (el.type === 'number') {
                    payload[key] = parseInt(value, 10);
                } else {
                    payload[key] = value;
                }
            }
        });

        // Special: Acordeon
        if (type === 'Acordeon') {
            const items = [];
            document.querySelectorAll('#acordeonItems .acordeon-item').forEach(item => {
                const title = item.querySelector('.acordeon-title').value.trim();
                const content = item.querySelector('.acordeon-content').value.trim();
                if (title && content) items.push({ title, content });
            });
            payload.items = items;
        }

        // Special: FeaturesList
        if (type === 'FeaturesList') {
            const features = [];
            document.querySelectorAll('#featuresItems .feature-item').forEach(item => {
                const icon = item.querySelector('.feature-icon').value.trim();
                const title = item.querySelector('.feature-title').value.trim();
                const description = item.querySelector('.feature-desc').value.trim();
                if (title && description) features.push({ icon, title, description });
            });
            payload.features = features;
        }

        return payload;
    },

    // ── Helper: add accordion item ───────────────────────────
    addAcordeonItem(title = '', content = '') {
        const container = document.getElementById('acordeonItems');
        const div = document.createElement('div');
        div.className = 'acordeon-item';
        div.style.cssText = 'background:var(--bg);border:1px solid var(--border);border-radius:var(--radius);padding:1rem;margin-bottom:0.75rem;position:relative;';
        div.innerHTML = `
            <button type="button" onclick="this.parentElement.remove()" style="position:absolute;top:0.5rem;right:0.5rem;background:none;border:none;color:var(--danger);cursor:pointer;font-size:1.1rem;" title="Eliminar">&times;</button>
            <div class="form-group">
                <label class="form-label" style="font-size:0.8rem;">Título de la sección</label>
                <input type="text" class="form-input acordeon-title" placeholder="Pregunta o título..." value="${this._esc(title)}" required>
            </div>
            <div class="form-group">
                <label class="form-label" style="font-size:0.8rem;">Contenido</label>
                <textarea class="form-input acordeon-content" rows="3" placeholder="Respuesta o contenido..." required>${this._esc(content)}</textarea>
            </div>
        `;
        container.appendChild(div);
    },

    // ── Helper: add feature item ─────────────────────────────
    addFeatureItem(icon = '', title = '', description = '') {
        const container = document.getElementById('featuresItems');
        const div = document.createElement('div');
        div.className = 'feature-item';
        div.style.cssText = 'background:var(--bg);border:1px solid var(--border);border-radius:var(--radius);padding:1rem;margin-bottom:0.75rem;position:relative;';
        div.innerHTML = `
            <button type="button" onclick="this.parentElement.remove()" style="position:absolute;top:0.5rem;right:0.5rem;background:none;border:none;color:var(--danger);cursor:pointer;font-size:1.1rem;" title="Eliminar">&times;</button>
            <div class="form-row">
                <div class="form-group">
                    <label class="form-label" style="font-size:0.8rem;">Icono</label>
                    <input type="text" class="form-input feature-icon" placeholder="🎓" value="${this._esc(icon)}" style="max-width:80px;">
                </div>
                <div class="form-group" style="flex:2;">
                    <label class="form-label" style="font-size:0.8rem;">Título</label>
                    <input type="text" class="form-input feature-title" placeholder="Título..." value="${this._esc(title)}" required>
                </div>
            </div>
            <div class="form-group">
                <label class="form-label" style="font-size:0.8rem;">Descripción</label>
                <textarea class="form-input feature-desc" rows="2" placeholder="Descripción..." required>${this._esc(description)}</textarea>
            </div>
        `;
        container.appendChild(div);
    },

    _esc(str) {
        if (!str) return '';
        const div = document.createElement('div');
        div.textContent = str;
        return div.innerHTML;
    }
};
