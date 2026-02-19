package com.cobatab.cms.repository;

import com.cobatab.cms.entity.CarouselSlide;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

public interface CarouselSlideRepository extends JpaRepository<CarouselSlide, UUID> {

    List<CarouselSlide> findAllByOrderByOrdenAsc();

    @Query("SELECT s FROM CarouselSlide s WHERE s.estado = 'PUBLISHED' " +
            "AND (s.fechaInicio IS NULL OR s.fechaInicio <= :now) " +
            "AND (s.fechaFinal IS NULL OR s.fechaFinal >= :now) " +
            "ORDER BY s.orden ASC")
    List<CarouselSlide> findActiveSlides(Instant now);
}
