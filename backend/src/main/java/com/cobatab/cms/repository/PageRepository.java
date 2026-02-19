package com.cobatab.cms.repository;

import com.cobatab.cms.entity.Page;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface PageRepository extends JpaRepository<Page, UUID> {

    Optional<Page> findBySlug(String slug);

    Optional<Page> findBySlugAndStatus(String slug, String status);

    List<Page> findAllByOrderByCreatedAtDesc();

    @Query("SELECT p FROM Page p LEFT JOIN FETCH p.blocks LEFT JOIN FETCH p.author WHERE p.slug = :slug AND p.status = 'PUBLISHED'")
    Optional<Page> findPublishedPageWithBlocks(String slug);
}
