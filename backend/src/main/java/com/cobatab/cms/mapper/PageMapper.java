package com.cobatab.cms.mapper;

import com.cobatab.cms.dto.BlockDto;
import com.cobatab.cms.dto.PageResponseDto;
import com.cobatab.cms.entity.Block;
import com.cobatab.cms.entity.Page;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class PageMapper {

    public PageResponseDto toDto(Page page) {
        List<BlockDto> blockDtos = page.getBlocks().stream()
                .map(this::toBlockDto)
                .toList();

        return new PageResponseDto(
                page.getId(),
                page.getSlug(),
                page.getTitle(),
                page.getSeoTitle(),
                page.getStatus(),
                blockDtos,
                page.getCreatedAt(),
                page.getUpdatedAt());
    }

    public BlockDto toBlockDto(Block block) {
        return new BlockDto(
                block.getId(),
                block.getType(),
                block.getSortOrder(),
                block.getPayload());
    }
}
