package com.toolswap.toolswap.controller;

import com.toolswap.toolswap.config.AppUserDetails;
import com.toolswap.toolswap.dto.BookingRequestDTO;
import com.toolswap.toolswap.dto.BookingResponsetDTO;
import com.toolswap.toolswap.dto.BookingStatusUpdateRequestDTO;
import com.toolswap.toolswap.mapper.BookingMapper;
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

        return new ResponseEntity<>(BookingMapper.toDto(newBooking), HttpStatus.CREATED);
    }

    @GetMapping("/my-bookings")
    public ResponseEntity<List<BookingResponsetDTO>> getMyBookings(@AuthenticationPrincipal AppUserDetails userDetails){
        List<BookingResponsetDTO> bookings = bookingService.getMyBookings(userDetails.getUsername()).stream()
                .map(BookingMapper::toDto)
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

        return ResponseEntity.ok(BookingMapper.toDto(updatedBooking));
    }



}
