package com.cobatab.cms.repository;

import com.cobatab.cms.entity.Block;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface BlockRepository extends JpaRepository<Block, UUID> {
    List<Block> findByPageIdOrderBySortOrderAsc(UUID pageId);
    void deleteByPageId(UUID pageId);
}
