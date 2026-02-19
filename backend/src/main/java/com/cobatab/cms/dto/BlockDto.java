package com.cobatab.cms.dto;

import java.util.Map;
import java.util.UUID;

public record BlockDto(
        UUID id,
        String type,
        Integer sortOrder,
        Map<String, Object> payload) {
}
