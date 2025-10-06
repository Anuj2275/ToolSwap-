package com.toolswap.toolswap.controller;

import com.toolswap.toolswap.config.AppUserDetails;
import com.toolswap.toolswap.dto.BookingRequestDTO;
import com.toolswap.toolswap.dto.BookingResponsetDTO;
import com.toolswap.toolswap.dto.BookingStatusUpdateRequestDTO;
import com.toolswap.toolswap.model.Booking;
import com.toolswap.toolswap.service.BookingService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/bookings")
@RequiredArgsConstructor
public class BookingController {

    private final BookingService bookingService;

    @PostMapping
    public ResponseEntity<BookingResponsetDTO> createBooking(@Valid @RequestBody BookingRequestDTO request, @AuthenticationPrincipal AppUserDetails userDetails){
        Booking newBooking = bookingService.createBooking(request,userDetails.getUsername());

        return new ResponseEntity<>(converToDto(newBooking), HttpStatus.CREATED);
    }

    @GetMapping("/my-bookings")
    public ResponseEntity<List<BookingResponsetDTO>> getMyBookings(@AuthenticationPrincipal AppUserDetails userDetails){
        List<BookingResponsetDTO> bookings = bookingService.getMyBookings(userDetails.getUsername()).stream()
                .map(this::converToDto)
                .toList();

        return ResponseEntity.ok(bookings);
    }

    @PutMapping("/{bookingId}/status")
    public ResponseEntity<BookingResponsetDTO> updateBookingStatus(
            @PathVariable Long bookingId,
            @Valid @RequestBody BookingStatusUpdateRequestDTO request,
            @AuthenticationPrincipal AppUserDetails userDetails
            ){
        Booking updatedBooking = bookingService.updateBookStatus(bookingId,request.getStatus(),userDetails.getUsername());

        return ResponseEntity.ok(converToDto(updatedBooking));
    }

    private BookingResponsetDTO converToDto(Booking booking) {
        BookingResponsetDTO dto = new BookingResponsetDTO();
        dto.setId(booking.getId());
        dto.setStartDate(booking.getStartDate());
        dto.setEndDate(booking.getEndDate());
        dto.setStatus(booking.getStatus());
        dto.setCreatedAt(booking.getCreatedAt());

        BookingResponsetDTO.ToolResponseDTO toolDto = new BookingResponsetDTO.ToolResponseDTO();
        toolDto.setId(booking.getTool().getId());
        toolDto.setName(booking.getTool().getName());
        toolDto.setImageUrl(booking.getTool().getImageUrl());
        dto.setTool(toolDto);

        BookingResponsetDTO.UserDTO borrowerDto = new BookingResponsetDTO.UserDTO();
        borrowerDto.setId(booking.getBorrower().getId());
        borrowerDto.setName(booking.getBorrower().getName());
        dto.setBorrower(borrowerDto);

        BookingResponsetDTO.UserDTO ownerDto = new BookingResponsetDTO.UserDTO();
        ownerDto.setId(booking.getTool().getOwner().getId());
        ownerDto.setName(booking.getTool().getOwner().getName());
        dto.setOwner(ownerDto);

        return dto;
    }

}
