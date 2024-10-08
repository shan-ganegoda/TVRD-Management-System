package com.content.security.service;

import com.content.security.dto.UserDTO;
import com.content.security.entity.User;

import java.util.HashMap;
import java.util.List;

public interface UserService {
    List<UserDTO> getAllUsers(HashMap<String,String> params);

    UserDTO getUserById(Integer id);

    UserDTO saveUser(UserDTO userdto);

    String updateUser(UserDTO userdto);

    String deleteUser(Integer id);

    UserDTO getUserByEmail(String email);

    String checkUser(String email);
}
