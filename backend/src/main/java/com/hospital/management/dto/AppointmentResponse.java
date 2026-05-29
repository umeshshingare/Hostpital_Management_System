package com.hospital.management.dto;

import com.hospital.management.entity.Appointment;

import java.time.Instant;
import java.time.LocalDate;

public record AppointmentResponse(
        Long id,
        Long patientId,
        String patientName,
        Long doctorId,
        String doctorName,
        String doctorSpecialization,
        LocalDate appointmentDate,
        Instant createdAt
) {
    public static AppointmentResponse from(Appointment appointment) {
        return new AppointmentResponse(
                appointment.getId(),
                appointment.getPatient().getId(),
                appointment.getPatient().getName(),
                appointment.getDoctor().getId(),
                appointment.getDoctor().getName(),
                appointment.getDoctor().getSpecialization(),
                appointment.getAppointmentDate(),
                appointment.getCreatedAt()
        );
    }
}
