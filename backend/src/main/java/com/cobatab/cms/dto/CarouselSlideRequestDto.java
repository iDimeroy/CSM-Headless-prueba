package com.cobatab.cms.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.time.Instant;

public record CarouselSlideRequestDto(
        @NotBlank(message = "El título es obligatorio") String titulo,

        String descripcion,

        String imagenUrl,

        Instant fechaInicio,

        Instant fechaFinal,

        String botonTexto,

        String botonUrl,

        @NotNull(message = "El orden es obligatorio") Integer orden,

        String estado) {
}
