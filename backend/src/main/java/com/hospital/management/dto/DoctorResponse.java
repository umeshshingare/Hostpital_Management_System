package com.hospital.management.dto;

import com.hospital.management.entity.Doctor;

import java.time.Instant;

public record DoctorResponse(
        Long id,
        String name,
        String specialization,
        Instant createdAt
) {
    public static DoctorResponse from(Doctor doctor) {
        return new DoctorResponse(
                doctor.getId(),
                doctor.getName(),
                doctor.getSpecialization(),
                doctor.getCreatedAt()
        );
    }
}
