package com.cobatab.cms.service;

import com.cobatab.cms.dto.*;
import com.cobatab.cms.entity.Block;
import com.cobatab.cms.entity.Page;
import com.cobatab.cms.mapper.PageMapper;
import com.cobatab.cms.repository.BlockRepository;
import com.cobatab.cms.repository.PageRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class PageService {

    private final PageRepository pageRepository;
    private final BlockRepository blockRepository;
    private final PageMapper pageMapper;

    // ── PUBLIC ──────────────────────────────────────────────────────────────

    public PageResponseDto getPublishedPage(String slug) {
        Page page = pageRepository.findPublishedPageWithBlocks(slug)
                .orElseThrow(() -> new EntityNotFoundException(
                        "Page not found or not published: " + slug));
        return pageMapper.toDto(page);
    }

    // ── ADMIN ────────────────────────────────────────────────────────────────

    public List<PageResponseDto> getAllPages() {
        return pageRepository.findAllByOrderByCreatedAtDesc().stream()
                .map(pageMapper::toDto)
                .toList();
    }

    public PageResponseDto getPageById(UUID id) {
        Page page = pageRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Page not found: " + id));
        return pageMapper.toDto(page);
    }

    @Transactional
    public PageResponseDto createPage(PageRequestDto request) {
        if (pageRepository.findBySlug(request.slug()).isPresent()) {
            throw new IllegalArgumentException("Slug already exists: " + request.slug());
        }
        Page page = Page.builder()
                .slug(request.slug())
                .title(request.title())
                .seoTitle(request.seoTitle())
                .status(request.status() != null ? request.status() : "DRAFT")
                .build();
        return pageMapper.toDto(pageRepository.save(page));
    }

    @Transactional
    public PageResponseDto updatePage(UUID id, PageRequestDto request) {
        Page page = pageRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Page not found: " + id));

        page.setSlug(request.slug());
        page.setTitle(request.title());
        page.setSeoTitle(request.seoTitle());
        if (request.status() != null) {
            page.setStatus(request.status());
        }
        return pageMapper.toDto(pageRepository.save(page));
    }

    @Transactional
    public void deletePage(UUID id) {
        if (!pageRepository.existsById(id)) {
            throw new EntityNotFoundException("Page not found: " + id);
        }
        pageRepository.deleteById(id);
    }

    // ── BLOCKS (admin) ───────────────────────────────────────────────────────

    @Transactional
    public BlockDto addBlock(UUID pageId, BlockRequestDto request) {
        Page page = pageRepository.findById(pageId)
                .orElseThrow(() -> new EntityNotFoundException("Page not found: " + pageId));

        Block block = Block.builder()
                .page(page)
                .type(request.type())
                .sortOrder(request.sortOrder())
                .payload(request.payload())
                .build();
        return pageMapper.toBlockDto(blockRepository.save(block));
    }

    @Transactional
    public BlockDto updateBlock(UUID blockId, BlockRequestDto request) {
        Block block = blockRepository.findById(blockId)
                .orElseThrow(() -> new EntityNotFoundException("Block not found: " + blockId));

        block.setType(request.type());
        block.setSortOrder(request.sortOrder());
        block.setPayload(request.payload());
        return pageMapper.toBlockDto(blockRepository.save(block));
    }

    @Transactional
    public void deleteBlock(UUID blockId) {
        if (!blockRepository.existsById(blockId)) {
            throw new EntityNotFoundException("Block not found: " + blockId);
        }
        blockRepository.deleteById(blockId);
    }

    @Transactional
    public void reorderBlocks(List<BlockReorderDto> request) {
        for (BlockReorderDto dto : request) {
            Block block = blockRepository.findById(dto.getId())
                    .orElseThrow(() -> new EntityNotFoundException("Block not found: " + dto.getId()));
            block.setSortOrder(dto.getSortOrder());
            blockRepository.save(block);
        }
    }
}
