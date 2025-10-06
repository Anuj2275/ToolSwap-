package com.toolswap.toolswap.dto;

import com.toolswap.toolswap.model.BookingStatus;
import jakarta.validation.constraints.Future;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
public class BookingResponsetDTO {
    private Long id;
    private ToolResponseDTO tool;
    private UserDTO borrower;
    private UserDTO owner;
    private LocalDateTime startDate;
    private LocalDateTime endDate;
    private BookingStatus status;
    private LocalDateTime createdAt;

    @Getter
    @Setter
    public static class ToolResponseDTO{
        private Long id;
        private String name;
        private String imageUrl;
    }

    @Getter
    @Setter
    public static class UserDTO{
        private Long id;
        private String name;
    }


}
