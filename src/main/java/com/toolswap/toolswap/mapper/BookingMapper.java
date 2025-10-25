package com.toolswap.toolswap.mapper;

import com.toolswap.toolswap.dto.BookingResponsetDTO;
import com.toolswap.toolswap.model.Booking;

public class BookingMapper {

    public static BookingResponsetDTO toDto(Booking booking) {
        if (booking == null) {
            return null;
        }

        BookingResponsetDTO dto = new BookingResponsetDTO();
        dto.setId(booking.getId());
        dto.setStartDate(booking.getStartDate());
        dto.setEndDate(booking.getEndDate());
        dto.setStatus(booking.getStatus());
        dto.setCreatedAt(booking.getCreatedAt());

        // Nested Tool DTO
        if (booking.getTool() != null) {
            BookingResponsetDTO.ToolResponseDTO toolDto = new BookingResponsetDTO.ToolResponseDTO();
            toolDto.setId(booking.getTool().getId());
            toolDto.setName(booking.getTool().getName());
            toolDto.setImageUrl(booking.getTool().getImageUrl());
            dto.setTool(toolDto);

            // Nested Owner DTO (within Tool)
            if (booking.getTool().getOwner() != null) {
                BookingResponsetDTO.UserDTO ownerDto = new BookingResponsetDTO.UserDTO();
                ownerDto.setId(booking.getTool().getOwner().getId());
                ownerDto.setName(booking.getTool().getOwner().getName());
                dto.setOwner(ownerDto);
            }
        }

        // Nested Borrower DTO
        if (booking.getBorrower() != null) {
            BookingResponsetDTO.UserDTO borrowerDto = new BookingResponsetDTO.UserDTO();
            borrowerDto.setId(booking.getBorrower().getId());
            borrowerDto.setName(booking.getBorrower().getName());
            dto.setBorrower(borrowerDto);
        }

        return dto;
    }
}