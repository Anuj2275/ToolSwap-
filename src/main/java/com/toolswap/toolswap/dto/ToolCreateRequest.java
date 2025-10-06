package com.toolswap.toolswap.dto;

import jakarta.validation.constraints.NotEmpty;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ToolCreateRequest {
    @NotEmpty(message = "Tool name is required")
    private String name;

    @NotEmpty(message = "Category is required")
    private String category;

    @NotEmpty(message = "Description is required")
    private String description;

}
