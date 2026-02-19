package com.cobatab.cms.config;

import com.cobatab.cms.entity.User;
import com.cobatab.cms.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
@Slf4j
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        userRepository.findByUsername("admin").ifPresent(admin -> {
            // Re-encode the password with the app's BCrypt encoder
            // to ensure the hash matches what Spring Security expects
            if (!passwordEncoder.matches("admin", admin.getPasswordHash())) {
                String correctHash = passwordEncoder.encode("admin");
                admin.setPasswordHash(correctHash);
                userRepository.save(admin);
                log.info("Admin password hash updated to match 'admin'");
            }
        });
    }
}
