package com.hospital.management.dto;

import com.hospital.management.entity.Patient;

import java.time.Instant;

public record PatientResponse(
        Long id,
        String name,
        Integer age,
        String gender,
        Instant createdAt
) {
    public static PatientResponse from(Patient patient) {
        return new PatientResponse(
                patient.getId(),
                patient.getName(),
                patient.getAge(),
                patient.getGender(),
                patient.getCreatedAt()
        );
    }
}
