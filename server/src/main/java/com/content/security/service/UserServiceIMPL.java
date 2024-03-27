package com.content.security.service;

import com.content.security.dto.UserDTO;
import com.content.security.entity.User;
import com.content.security.exception.ResourceAlreadyExistException;
import com.content.security.exception.ResourceNotFountException;

import com.content.security.repository.UserRepository;
import com.content.security.util.mapper.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.sql.Date;
import java.sql.Time;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class UserServiceIMPL implements UserService{

    private final UserRepository userRepository;
    private final ObjectMapper objectMapper;
    private final PasswordEncoder passwordEncoder;
    @Override
    public List<UserDTO> getAllUsers() {

        List<User> userList = userRepository.findAll();
        List<UserDTO> userDTOList = objectMapper.userListToUserDTOList(userList);
        return userDTOList;
    }

    @Override
    public UserDTO getUserById(Integer id) {
            User user = userRepository.findById(id).orElseThrow(() -> new ResourceNotFountException("User Does Not Exist"));
            UserDTO userDTO = objectMapper.userToUserDTO(user);
            return userDTO;
    }

    @Override
    public UserDTO saveUser(UserDTO userdto) {

        if(!userRepository.existsByEmail(userdto.getEmail())){
            User user = objectMapper.userDTOToUser(userdto);

            user.setPassword(passwordEncoder.encode(user.getPassword()));
            user.setDocreated(Date.valueOf(LocalDate.now()));
            user.setTocreated(Time.valueOf(LocalTime.now()));

            userRepository.save(user);

            return userdto;
        }else{
            throw new ResourceAlreadyExistException("User Does Not Exist");
        }

    }

    @Override
    public String updateUser(UserDTO userdto) {

        Optional<User> userOpt = userRepository.findById(userdto.getId());

        if(userRepository.existsById(userdto.getId())){
            User user = objectMapper.userDTOToUser(userdto);

            if(user.getPassword() != userOpt.get().getPassword()){
                user.setPassword(passwordEncoder.encode(user.getPassword()));
            }

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
            User user = userRepository.findByEmail(email).orElseThrow(() -> new ResourceNotFountException("User Does Not Exist"));
            UserDTO userDTO = objectMapper.userToUserDTO(user);
            return userDTO;
        }



}
