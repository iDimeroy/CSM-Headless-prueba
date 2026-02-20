package com.cobatab.cms.repository;

import com.cobatab.cms.entity.Block;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

public interface BlockRepository extends JpaRepository<Block, UUID> {
    List<Block> findByPageIdOrderBySortOrderAsc(UUID pageId);

    @Modifying
    @Transactional
    void deleteByPageId(UUID pageId);
}
