package com.hospital.management.service;

import com.hospital.management.dto.AppointmentRequest;
import com.hospital.management.dto.AppointmentResponse;
import com.hospital.management.entity.Appointment;
import com.hospital.management.entity.Doctor;
import com.hospital.management.entity.Patient;
import com.hospital.management.exception.ConflictException;
import com.hospital.management.exception.ResourceNotFoundException;
import com.hospital.management.repository.AppointmentRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

@Service
public class AppointmentService {

    private final AppointmentRepository appointmentRepository;
    private final PatientService patientService;
    private final DoctorService doctorService;

    public AppointmentService(
            AppointmentRepository appointmentRepository,
            PatientService patientService,
            DoctorService doctorService
    ) {
        this.appointmentRepository = appointmentRepository;
        this.patientService = patientService;
        this.doctorService = doctorService;
    }

    @Transactional(readOnly = true)
    public List<AppointmentResponse> findAll() {
        return appointmentRepository.findAllWithDetails().stream()
                .map(AppointmentResponse::from)
                .toList();
    }

    @Transactional
    public AppointmentResponse create(AppointmentRequest request) {
        Patient patient = patientService.getEntity(request.patientId());
        Doctor doctor = doctorService.getEntity(request.doctorId());

        if (appointmentRepository.existsByDoctorIdAndAppointmentDate(
                doctor.getId(), request.appointmentDate())) {
            throw new ConflictException("Doctor is not available on the selected date");
        }

        Appointment appointment = new Appointment();
        appointment.setPatient(patient);
        appointment.setDoctor(doctor);
        appointment.setAppointmentDate(request.appointmentDate());

        return AppointmentResponse.from(appointmentRepository.save(appointment));
    }

    @Transactional
    public void delete(Long id) {
        if (!appointmentRepository.existsById(id)) {
            throw new ResourceNotFoundException("Appointment not found with id: " + id);
        }
        appointmentRepository.deleteById(id);
    }

    @Transactional(readOnly = true)
    public long countUpcoming() {
        return appointmentRepository.findAll().stream()
                .filter(a -> !a.getAppointmentDate().isBefore(LocalDate.now()))
                .count();
    }
}
