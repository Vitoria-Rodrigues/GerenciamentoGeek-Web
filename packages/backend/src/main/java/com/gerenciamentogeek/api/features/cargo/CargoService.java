package com.gerenciamentogeek.api.features.cargo;

import com.gerenciamentogeek.api.features.cargo.dto.CargoResponse;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class CargoService {
    private final CargoRepository cargoRepository;

    public CargoService(CargoRepository cargoRepository) {
        this.cargoRepository = cargoRepository;
    }

    public List<CargoResponse> listarCargo() {
        List<Cargo> cargos = cargoRepository.findAll();
        if (cargos.isEmpty()) {
            throw new RuntimeException("Cargo não encontrado");
        }
        return cargos.stream().map(CargoResponse::new).toList();
    }

    public CargoResponse buscarPorId(Long id) {
        Cargo cargo = cargoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Cargo não encontrado"));
        return new CargoResponse(cargo);
    }
}