package com.content.security.service;

import com.content.security.dto.UserStatusDTO;

import java.util.List;

public interface UserStatusService {
    List<UserStatusDTO> getAll();
}
