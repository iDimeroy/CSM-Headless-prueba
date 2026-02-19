package com.cobatab.cms.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;

public record PageRequestDto(
        @NotBlank String slug,
        @NotBlank String title,
        String seoTitle,
        @Pattern(regexp = "DRAFT|PUBLISHED|ARCHIVED") String status) {
}
