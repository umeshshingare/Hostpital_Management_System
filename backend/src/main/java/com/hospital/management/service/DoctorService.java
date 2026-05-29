package com.hospital.management.service;

import com.hospital.management.dto.DoctorRequest;
import com.hospital.management.dto.DoctorResponse;
import com.hospital.management.entity.Doctor;
import com.hospital.management.exception.ResourceNotFoundException;
import com.hospital.management.repository.DoctorRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class DoctorService {

    private final DoctorRepository doctorRepository;

    public DoctorService(DoctorRepository doctorRepository) {
        this.doctorRepository = doctorRepository;
    }

    @Transactional(readOnly = true)
    public List<DoctorResponse> findAll() {
        return doctorRepository.findAll().stream()
                .map(DoctorResponse::from)
                .toList();
    }

    @Transactional(readOnly = true)
    public DoctorResponse findById(Long id) {
        return DoctorResponse.from(getEntity(id));
    }

    @Transactional
    public DoctorResponse create(DoctorRequest request) {
        Doctor doctor = new Doctor();
        doctor.setName(request.name().trim());
        doctor.setSpecialization(request.specialization().trim());
        return DoctorResponse.from(doctorRepository.save(doctor));
    }

    @Transactional(readOnly = true)
    public Doctor getEntity(Long id) {
        return doctorRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Doctor not found with id: " + id));
    }
}
