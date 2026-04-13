package com.core.userservice.service;

import com.core.userservice.domain.User;
import com.core.userservice.dto.UserDTO;
import com.core.userservice.dto.UserNameUpdateRequest;
import com.core.userservice.dto.UserStatusUpdateRequest;
import com.core.userservice.exception.UserNotFoundException;
import com.core.userservice.mapper.UserMapper;
import com.core.userservice.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final UserMapper userMapper;
    public static final int USERS_SEARCH_RESULTS_LIMIT = 10;

    public UserDTO getUserById(UUID id) {
        User user = userRepository.findById(id).orElseThrow(() -> new UserNotFoundException("User not found"));
        return userMapper.toDTO(user);
    }

    @Transactional
    public UserDTO updateUserName(UUID id, UserNameUpdateRequest userNameUpdateRequest) {
        User user = userRepository.findById(id).orElseThrow(() -> new UserNotFoundException("User not found"));
        user.setFirstName(userNameUpdateRequest.firstName());
        user.setLastName(userNameUpdateRequest.lastName());
        return userMapper.toDTO(user);
    }

    @Transactional
    public UserDTO updateUserStatus(UUID id, UserStatusUpdateRequest userStatusUpdateRequest) {
        User user = userRepository.findById(id).orElseThrow(() -> new UserNotFoundException("User not found"));
        user.setStatus(userStatusUpdateRequest.userStatus());
        return userMapper.toDTO(user);
    }

    public List<UserDTO> getUsersByKeyword(String keyword, int limit) {
        return userRepository.findByKeyword(keyword, PageRequest.of(0, limit))
                .stream()
                .map(userMapper::toDTO)
                .toList();
    }
}
