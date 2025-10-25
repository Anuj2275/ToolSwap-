package com.toolswap.toolswap.dto;

import jakarta.validation.constraints.NotEmpty;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ToolResponse {

    private Long id;
    private String name;
    private String category;
    private String description;
    private String imageUrl;
    private OwnerDTO owner;

    @Getter
    @Setter
    public static class OwnerDTO{
        private Long id;
        private String name;
        private String email;

    }

}
