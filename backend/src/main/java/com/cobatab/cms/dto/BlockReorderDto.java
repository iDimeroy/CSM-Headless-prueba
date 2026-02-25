package com.cobatab.cms.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.util.UUID;

@Data
public class BlockReorderDto {

    @NotNull(message = "El ID del bloque es obligatorio")
    private UUID id;

    @NotNull(message = "El orden es obligatorio")
    @Min(value = 1, message = "El orden debe ser mayor o igual a 1")
    private Integer sortOrder;
}
