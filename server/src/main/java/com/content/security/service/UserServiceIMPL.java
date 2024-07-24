package com.content.security.service;

import com.content.security.dto.EmployeeDTO;
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
import java.util.HashMap;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import java.util.stream.Stream;

@Service
@RequiredArgsConstructor
public class UserServiceIMPL implements UserService{

    private final UserRepository userRepository;
    private final ObjectMapper objectMapper;
    private final PasswordEncoder passwordEncoder;
    @Override
    public List<UserDTO> getAllUsers(HashMap<String,String> params) {

        List<User> userList = userRepository.findAll();

        if(!userList.isEmpty()){
            List<UserDTO> userDTOList = objectMapper.userListToUserDTOList(userList);

            if(params.isEmpty()){
                return userDTOList;
            }else{
                String fullname = params.get("fullname");
                String email = params.get("email");
                String usertypeid = params.get("usertypeid");
                String userstatusid = params.get("userstatusid");

                Stream<UserDTO> estreame = userDTOList.stream();

                if(usertypeid!=null) estreame = estreame.filter(e-> e.getUsertype().getId()==Integer.parseInt(usertypeid));
                if(userstatusid!=null) estreame = estreame.filter(e-> e.getUserstatus().getId()==Integer.parseInt(userstatusid));
                if(email!=null) estreame = estreame.filter(e-> e.getEmail().equals(email));
                if(fullname!=null) estreame = estreame.filter(e-> e.getEmployee().getFullname().contains(fullname));

                return estreame.collect(Collectors.toList());
            }
        }else{
            throw new ResourceNotFountException("Users Not Found!");
        }

    }

    @Override
    public UserDTO getUserById(Integer id) {
            User user = userRepository.findById(id).orElseThrow(() -> new ResourceNotFountException("User Does Not Exist"));
            UserDTO userDTO = objectMapper.userToUserDTO(user);
            return userDTO;
    }

    @Override
    public UserDTO saveUser(UserDTO userdto) {

        System.out.println(userdto.getEmail());

        if(!userRepository.existsByEmail(userdto.getEmail())){
            User user = objectMapper.userDTOToUser(userdto);

            user.setPassword(passwordEncoder.encode(user.getPassword()));
            user.setDocreated(Date.valueOf(LocalDate.now()));
            user.setTocreated(Time.valueOf(LocalTime.now()));

            userRepository.save(user);

            return userdto;
        }else{
            throw new ResourceAlreadyExistException("User Already Exist");
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

            user.setDocreated(userOpt.get().getDocreated());
            user.setTocreated(userOpt.get().getTocreated());

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
