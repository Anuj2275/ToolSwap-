package com.toolswap.toolswap.service;

import com.toolswap.toolswap.model.Booking;
import com.toolswap.toolswap.model.BookingStatus;
import com.toolswap.toolswap.repository.BookingRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class NotificationService {

    private final BookingRepository bookingRepository;
    private final EmailService emailService;

    // This runs once every day at 8:00 AM.
    // Cron format: (second, minute, hour, day-of-month, month, day-of-week)
    @Scheduled(cron = "0 0 8 * * *")
    public void sendReturnReminders() {
        System.out.println("Running scheduled job: Sending return reminders...");

        // Find all approved bookings ending in the next 24 hours
        LocalDateTime now = LocalDateTime.now();
        LocalDateTime in24Hours = now.plusHours(24);

        List<Booking> upcomingReturns = bookingRepository.findByStatusAndEndDateBetween(
                BookingStatus.APPROVED,
                now,
                in24Hours
        );

        if (upcomingReturns.isEmpty()) {
            System.out.println("No upcoming returns to notify.");
            return;
        }

        for (Booking booking : upcomingReturns) {
            String to = booking.getBorrower().getEmail();
            String subject = "ToolSwap Reminder: Your tool borrow period is ending soon!";
            String text = "Hi " + booking.getBorrower().getName() + ",\n\n"
                    + "This is a reminder that your borrow period for the tool '" + booking.getTool().getName() + "' "
                    + "is ending in the next 24 hours (Due: " + booking.getEndDate().toString() + ").\n\n"
                    + "Please coordinate with " + booking.getTool().getOwner().getName() + " to return it on time.\n\n"
                    + "Thanks,\nThe ToolSwap Team";

            emailService.sendSimpleMessage(to, subject, text);
        }

        System.out.println("Sent " + upcomingReturns.size() + " return reminders.");
    }
}