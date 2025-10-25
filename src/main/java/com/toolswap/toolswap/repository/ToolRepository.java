package com.toolswap.toolswap.repository;

import com.toolswap.toolswap.model.Tool;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ToolRepository extends JpaRepository<Tool,Long> {
    List<Tool> findByOwnerId(Long ownerId);
}
