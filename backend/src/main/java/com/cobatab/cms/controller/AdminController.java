package com.cobatab.cms.controller;

import com.cobatab.cms.dto.*;
import com.cobatab.cms.service.PageService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/admin")
@RequiredArgsConstructor
public class AdminController {

    private final PageService pageService;

    // ── PAGE CRUD ─────────────────────────────────────────────────────────────

    @GetMapping("/pages")
    public ResponseEntity<List<PageResponseDto>> listPages() {
        return ResponseEntity.ok(pageService.getAllPages());
    }

    @GetMapping("/pages/{id}")
    public ResponseEntity<PageResponseDto> getPage(@PathVariable UUID id) {
        return ResponseEntity.ok(pageService.getPageById(id));
    }

    @PostMapping("/pages")
    @PreAuthorize("hasAnyRole('ADMIN', 'EDITOR')")
    public ResponseEntity<PageResponseDto> createPage(@Valid @RequestBody PageRequestDto request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(pageService.createPage(request));
    }

    @PutMapping("/pages/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'EDITOR')")
    public ResponseEntity<PageResponseDto> updatePage(
            @PathVariable UUID id,
            @Valid @RequestBody PageRequestDto request) {
        return ResponseEntity.ok(pageService.updatePage(id, request));
    }

    @DeleteMapping("/pages/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deletePage(@PathVariable UUID id) {
        pageService.deletePage(id);
        return ResponseEntity.noContent().build();
    }

    // ── BLOCK CRUD ────────────────────────────────────────────────────────────

    @PostMapping("/pages/{pageId}/blocks")
    @PreAuthorize("hasAnyRole('ADMIN', 'EDITOR')")
    public ResponseEntity<BlockDto> addBlock(
            @PathVariable UUID pageId,
            @Valid @RequestBody BlockRequestDto request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(pageService.addBlock(pageId, request));
    }

    @PutMapping("/blocks/{blockId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'EDITOR')")
    public ResponseEntity<BlockDto> updateBlock(
            @PathVariable UUID blockId,
            @Valid @RequestBody BlockRequestDto request) {
        return ResponseEntity.ok(pageService.updateBlock(blockId, request));
    }

    @DeleteMapping("/blocks/{blockId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'EDITOR')")
    public ResponseEntity<Void> deleteBlock(@PathVariable UUID blockId) {
        pageService.deleteBlock(blockId);
        return ResponseEntity.noContent().build();
    }
}
