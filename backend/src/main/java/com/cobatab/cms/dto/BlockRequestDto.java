package com.cobatab.cms.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.util.Map;

public record BlockRequestDto(
        @NotBlank String type,
        @NotNull Integer sortOrder,
        @NotNull Map<String, Object> payload) {
}
