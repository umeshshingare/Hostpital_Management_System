package com.hospital.management.dto;

import jakarta.validation.constraints.*;

public record PatientRequest(
        @NotBlank(message = "Name is required")
        @Size(max = 100, message = "Name must be at most 100 characters")
        String name,

        @NotNull(message = "Age is required")
        @Min(value = 1, message = "Age must be at least 1")
        @Max(value = 149, message = "Age must be at most 149")
        Integer age,

        @NotBlank(message = "Gender is required")
        @Pattern(regexp = "^(Male|Female|Other)$", message = "Gender must be Male, Female, or Other")
        String gender
) {
}
