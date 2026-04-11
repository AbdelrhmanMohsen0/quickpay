package com.lodex.transactionservice.dao;

import com.lodex.transactionservice.model.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface UserDAO extends JpaRepository<User, UUID> {
    User findByPhoneNumber(String phoneNumber);
}
