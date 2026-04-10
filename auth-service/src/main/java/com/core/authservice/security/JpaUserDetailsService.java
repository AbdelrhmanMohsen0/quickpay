package com.core.authservice.security;

import com.core.authservice.domain.User;
import com.core.authservice.repository.UserRepository;
import lombok.RequiredArgsConstructor;

import org.jspecify.annotations.NonNull;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;

@RequiredArgsConstructor
public class JpaUserDetailsService implements UserDetailsService {

    private final UserRepository userRepository;

    @Override
    public @NonNull UserDetails loadUserByUsername(@NonNull String phoneNumber) throws UsernameNotFoundException {
        User user = userRepository.findByPhoneNumber(phoneNumber)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with phoneNumber: " + phoneNumber));
        return new SecurityUser(user);
    }
}
