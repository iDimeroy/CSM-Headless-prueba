package com.cobatab.cms.controller;

import com.cobatab.cms.dto.PageResponseDto;
import com.cobatab.cms.service.PageService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/pages")
@RequiredArgsConstructor
public class PublicPageController {

    private final PageService pageService;

    /**
     * Public endpoint consumed by Astro — returns full page with blocks.
     * GET /api/v1/pages/{slug}
     */
    @GetMapping("/{slug}")
    public ResponseEntity<PageResponseDto> getPage(@PathVariable String slug) {
        return ResponseEntity.ok(pageService.getPublishedPage(slug));
    }
}
