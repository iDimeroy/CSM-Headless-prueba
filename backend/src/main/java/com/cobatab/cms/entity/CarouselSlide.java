package com.cobatab.cms.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "carousel_slides")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CarouselSlide {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false)
    private String titulo;

    @Column(columnDefinition = "TEXT")
    private String descripcion;

    @Column(name = "imagen_url", length = 500)
    private String imagenUrl;

    @Column(name = "fecha_inicio")
    private Instant fechaInicio;

    @Column(name = "fecha_final")
    private Instant fechaFinal;

    @Column(name = "boton_texto", length = 50)
    private String botonTexto;

    @Column(name = "boton_url", length = 500)
    private String botonUrl;

    @Column(nullable = false)
    private Integer orden;

    @Column(nullable = false, length = 20)
    private String estado;

    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;

    @Column(name = "updated_at", nullable = false)
    private Instant updatedAt;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "created_by")
    private User createdBy;

    @PrePersist
    void prePersist() {
        createdAt = Instant.now();
        updatedAt = Instant.now();
        if (estado == null)
            estado = "DRAFT";
        if (orden == null)
            orden = 1;
    }

    @PreUpdate
    void preUpdate() {
        updatedAt = Instant.now();
    }
}
