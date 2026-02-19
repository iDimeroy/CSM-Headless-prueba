package com.cobatab.cms.controller;

import com.cobatab.cms.dto.CarouselSlideDto;
import com.cobatab.cms.dto.CarouselSlideRequestDto;
import com.cobatab.cms.service.CarouselService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1")
@RequiredArgsConstructor
public class CarouselController {

    private final CarouselService carouselService;

    // ── Public: active slides only ─────────────────────────────

    @GetMapping("/carousel")
    public ResponseEntity<List<CarouselSlideDto>> getActiveSlides() {
        return ResponseEntity.ok(carouselService.getActiveSlides());
    }

    // ── Admin CRUD ─────────────────────────────────────────────

    @GetMapping("/admin/carousel")
    public ResponseEntity<List<CarouselSlideDto>> listAll() {
        return ResponseEntity.ok(carouselService.getAllSlides());
    }

    @GetMapping("/admin/carousel/{id}")
    public ResponseEntity<CarouselSlideDto> getOne(@PathVariable UUID id) {
        return ResponseEntity.ok(carouselService.getSlideById(id));
    }

    @PostMapping("/admin/carousel")
    @PreAuthorize("hasAnyRole('ADMIN', 'EDITOR')")
    public ResponseEntity<CarouselSlideDto> create(
            @Valid @RequestBody CarouselSlideRequestDto request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(carouselService.createSlide(request));
    }

    @PutMapping("/admin/carousel/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'EDITOR')")
    public ResponseEntity<CarouselSlideDto> update(
            @PathVariable UUID id,
            @Valid @RequestBody CarouselSlideRequestDto request) {
        return ResponseEntity.ok(carouselService.updateSlide(id, request));
    }

    @DeleteMapping("/admin/carousel/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'EDITOR')")
    public ResponseEntity<Void> delete(@PathVariable UUID id) {
        carouselService.deleteSlide(id);
        return ResponseEntity.noContent().build();
    }
}
