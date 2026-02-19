package com.cobatab.cms.dto;

import java.time.Instant;
import java.util.UUID;

public record CarouselSlideDto(
        UUID id,
        String titulo,
        String descripcion,
        String imagenUrl,
        Instant fechaInicio,
        Instant fechaFinal,
        String botonTexto,
        String botonUrl,
        Integer orden,
        String estado,
        Instant createdAt,
        Instant updatedAt) {
}
