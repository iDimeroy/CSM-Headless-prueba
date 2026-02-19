package com.cobatab.cms.service;

import com.cobatab.cms.dto.CarouselSlideDto;
import com.cobatab.cms.dto.CarouselSlideRequestDto;
import com.cobatab.cms.entity.CarouselSlide;
import com.cobatab.cms.repository.CarouselSlideRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class CarouselService {

    private final CarouselSlideRepository repo;

    // ── Public ─────────────────────────────────────────────────

    public List<CarouselSlideDto> getActiveSlides() {
        return repo.findActiveSlides(Instant.now()).stream()
                .map(this::toDto)
                .toList();
    }

    // ── Admin ──────────────────────────────────────────────────

    public List<CarouselSlideDto> getAllSlides() {
        return repo.findAllByOrderByOrdenAsc().stream()
                .map(this::toDto)
                .toList();
    }

    public CarouselSlideDto getSlideById(UUID id) {
        return toDto(findOrThrow(id));
    }

    @Transactional
    public CarouselSlideDto createSlide(CarouselSlideRequestDto req) {
        CarouselSlide slide = CarouselSlide.builder()
                .titulo(req.titulo())
                .descripcion(req.descripcion())
                .imagenUrl(req.imagenUrl())
                .fechaInicio(req.fechaInicio())
                .fechaFinal(req.fechaFinal())
                .botonTexto(req.botonTexto())
                .botonUrl(req.botonUrl())
                .orden(req.orden())
                .estado(req.estado() != null ? req.estado() : "DRAFT")
                .build();
        return toDto(repo.save(slide));
    }

    @Transactional
    public CarouselSlideDto updateSlide(UUID id, CarouselSlideRequestDto req) {
        CarouselSlide slide = findOrThrow(id);
        slide.setTitulo(req.titulo());
        slide.setDescripcion(req.descripcion());
        slide.setImagenUrl(req.imagenUrl());
        slide.setFechaInicio(req.fechaInicio());
        slide.setFechaFinal(req.fechaFinal());
        slide.setBotonTexto(req.botonTexto());
        slide.setBotonUrl(req.botonUrl());
        slide.setOrden(req.orden());
        if (req.estado() != null)
            slide.setEstado(req.estado());
        return toDto(repo.save(slide));
    }

    @Transactional
    public void deleteSlide(UUID id) {
        CarouselSlide slide = findOrThrow(id);
        repo.delete(slide);
    }

    // ── Helpers ────────────────────────────────────────────────

    private CarouselSlide findOrThrow(UUID id) {
        return repo.findById(id)
                .orElseThrow(() -> new jakarta.persistence.EntityNotFoundException(
                        "Slide no encontrado: " + id));
    }

    private CarouselSlideDto toDto(CarouselSlide s) {
        return new CarouselSlideDto(
                s.getId(), s.getTitulo(), s.getDescripcion(),
                s.getImagenUrl(), s.getFechaInicio(), s.getFechaFinal(),
                s.getBotonTexto(), s.getBotonUrl(),
                s.getOrden(), s.getEstado(),
                s.getCreatedAt(), s.getUpdatedAt());
    }
}
