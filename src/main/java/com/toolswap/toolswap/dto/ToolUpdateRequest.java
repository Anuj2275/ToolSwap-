package com.toolswap.toolswap.dto;

import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ToolUpdateRequest {

    @Size(min = 1, message = "Tool name cannot be empty if provided")
    private String name;

    @Size(min = 1, message = "Category cannot be empty if provided")
    private String category;

    @Size(min = 1, message = "Description cannot be empty if provided")
    private String description;

}