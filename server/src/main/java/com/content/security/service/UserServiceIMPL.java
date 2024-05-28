package com.content.security.service;

import com.content.security.dto.UserDTO;
import com.content.security.entity.User;
import com.content.security.exception.ResourceNotFountException;

import com.content.security.repository.UserRepository;
import com.content.security.util.mapper.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class UserServiceIMPL implements UserService{

    private final UserRepository userRepository;
    private final ObjectMapper objectMapper;
    @Override
    public List<UserDTO> getAllUsers() {

        List<User> userList = userRepository.findAll();
        List<UserDTO> userDTOList = objectMapper.userListToUserDTOList(userList);
        return userDTOList;
    }

    @Override
    public UserDTO getUserById(Integer id) {
        if(userRepository.existsById(id)){
            Optional<User> user = userRepository.findById(id);
            UserDTO userDTO = objectMapper.userToUserDTO(user);

            return userDTO;
        }else{
            throw new ResourceNotFountException("User Does Not Exist");
        }
    }

    @Override
    public String saveUser(UserDTO userdto) {

        if(userRepository.existsByEmail(userdto.getEmail())){
            User user = objectMapper.userDTOToUser(userdto);
            userRepository.save(user);

            return "User Successfully Saved";
        }else{
            throw new ResourceNotFountException("User Does Not Exist");
        }

    }

    @Override
    public String updateUser(UserDTO userdto) {
        if(userRepository.existsById(userdto.getId())){
            User user = objectMapper.userDTOToUser(userdto);
            userRepository.save(user);

            return userdto.getEmail() + " Updated Successfully!";
        }else{
            throw new ResourceNotFountException("User Does Not Exist");
        }
    }

    @Override
    public String deleteUser(Integer id) {

        if(userRepository.existsById(id)){
            userRepository.deleteById(id);

            return "User Deleted Successfully! ";
        }else{
            throw new ResourceNotFountException("User Does Not Exist");
        }
    }

    @Override
    public UserDTO getUserByEmail(String email) {
        if(userRepository.existsByEmail(email)){
            Optional<User> user = userRepository.findByEmail(email);
            UserDTO userDTO = objectMapper.userToUserDTO(user);
            return userDTO;
        }else{
            throw new ResourceNotFountException("User Does Not Exist");
        }
    }


}
