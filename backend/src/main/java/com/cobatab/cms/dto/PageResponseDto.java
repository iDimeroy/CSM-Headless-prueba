package com.cobatab.cms.dto;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

public record PageResponseDto(
        UUID id,
        String slug,
        String title,
        String seoTitle,
        String status,
        List<BlockDto> blocks,
        Instant createdAt,
        Instant updatedAt) {
}
