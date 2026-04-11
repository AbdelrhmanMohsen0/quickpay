package com.core.authservice.util;

import com.core.authservice.repository.UserRepository;
import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;
import org.springframework.beans.factory.annotation.Autowired;

public class UniquePhoneNumberValidator implements ConstraintValidator<UniquePhoneNumber, String> {

    @Autowired
    private UserRepository userRepository;

    @Override
    public boolean isValid(String phoneNumber, ConstraintValidatorContext context) {
        if (phoneNumber == null || phoneNumber.isEmpty()) return true;
        return !userRepository.existsByPhoneNumber(phoneNumber);
    }
}
