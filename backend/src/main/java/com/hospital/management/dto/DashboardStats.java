package com.hospital.management.dto;

public record DashboardStats(
        long patientCount,
        long doctorCount,
        long appointmentCount,
        long upcomingAppointments
) {
}
