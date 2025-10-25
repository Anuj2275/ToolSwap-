package com.toolswap.toolswap.mapper;

import com.toolswap.toolswap.dto.ToolResponse;
import com.toolswap.toolswap.model.Tool;

public class ToolMapper {

    public static ToolResponse toDto(Tool tool) {
        if (tool == null) {
            return null;
        }

        ToolResponse toolResponse = new ToolResponse();
        toolResponse.setId(tool.getId());
        toolResponse.setName(tool.getName());
        toolResponse.setCategory(tool.getCategory());
        toolResponse.setDescription(tool.getDescription());
        toolResponse.setImageUrl(tool.getImageUrl());

        if (tool.getOwner() != null) {
            ToolResponse.OwnerDTO ownerDTO = new ToolResponse.OwnerDTO();
            ownerDTO.setId(tool.getOwner().getId());
            ownerDTO.setName(tool.getOwner().getName());
            ownerDTO.setEmail(tool.getOwner().getEmail());

            toolResponse.setOwner(ownerDTO);
        }

        return toolResponse;
    }
}