package com.content.security.service;

import com.content.security.dto.EmployeeDTO;
import com.content.security.dto.VehicleDTO;
import com.content.security.entity.Vehicle;
import com.content.security.exception.ResourceAlreadyExistException;
import com.content.security.exception.ResourceNotFountException;
import com.content.security.repository.VehicleRepository;
import com.content.security.util.mapper.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import java.util.stream.Stream;

@Service
@RequiredArgsConstructor
public class VehicleServiceIMPL implements VehicleService {

    private final VehicleRepository vehicleRepository;
    private final ObjectMapper objectMapper;

    @Override
    public List<VehicleDTO> getVehicles(HashMap<String, String> params) {
        List<Vehicle> vehicles = vehicleRepository.findAll();

        if (!vehicles.isEmpty()) {
            List<VehicleDTO> vehicleDTOList = objectMapper.vehicleListToDtoList(vehicles);

            if (params.isEmpty()) {
                return vehicleDTOList;
            } else {
                String number = params.get("number");
                String mohid = params.get("mohid");
                String vehiclestatusid = params.get("vehiclestatusid");
                String vehicletypeid = params.get("vehicletypeid");

                Stream<VehicleDTO> vstreame = vehicleDTOList.stream();

                if (mohid != null) vstreame = vstreame.filter(e -> e.getMoh().getId() == Integer.parseInt(mohid));
                if (vehiclestatusid != null)
                    vstreame = vstreame.filter(e -> e.getVehiclestatus().getId() == Integer.parseInt(vehiclestatusid));
                if (vehicletypeid != null)
                    vstreame = vstreame.filter(e -> e.getVehicletype().getId() == Integer.parseInt(vehicletypeid));
                if (number != null) vstreame = vstreame.filter(e -> e.getNumber().equals(number));


                return vstreame.collect(Collectors.toList());
            }
        } else {
            throw new ResourceNotFountException("Vehicles Not Found");
        }
    }

    @Override
    public VehicleDTO saveVehicle(VehicleDTO vehicleDTO) {

        if (vehicleDTO != null) {

            if (vehicleRepository.existsByNumber(vehicleDTO.getNumber())) {
                throw new ResourceAlreadyExistException("Number Already Exist!");
            }

            Vehicle vh = objectMapper.vehicleDtoToVehicle(vehicleDTO);
            vehicleRepository.save(vh);
            return vehicleDTO;
        } else {
            throw new ResourceNotFountException("Vehicle Data Not Found!");
        }
    }

    @Override
    public VehicleDTO updateVehicle(VehicleDTO vehicleDTO) {
        Vehicle vh = vehicleRepository.findById(vehicleDTO.getId()).orElseThrow(() -> new ResourceNotFountException("Vehicle Not Found!"));

        if (!vh.getNumber().equals(vehicleDTO.getNumber()) && vehicleRepository.existsByNumber(vehicleDTO.getNumber())) {
            throw new ResourceAlreadyExistException("Number Already Exist!");
        }

        Vehicle vehicle = objectMapper.vehicleDtoToVehicle(vehicleDTO);
        vehicleRepository.save(vehicle);
        return vehicleDTO;

    }

    @Override
    public void deleteVehicle(Integer id) {
        if (vehicleRepository.existsById(id)) {
            vehicleRepository.deleteById(id);
        } else {
            throw new ResourceNotFountException("Vehicle Not Found!");
        }
    }
}
