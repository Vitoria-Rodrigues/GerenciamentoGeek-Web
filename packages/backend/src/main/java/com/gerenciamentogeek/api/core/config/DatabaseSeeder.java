package com.gerenciamentogeek.api.core.config;

import com.gerenciamentogeek.api.features.cargo.Cargo;
import com.gerenciamentogeek.api.features.cargo.CargoRepository;
import com.gerenciamentogeek.api.features.funcionario.Funcionario;
import com.gerenciamentogeek.api.features.funcionario.FuncionarioRepository;
import com.gerenciamentogeek.api.features.login.Login;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;

@Component
public class DatabaseSeeder implements CommandLineRunner {

    @Autowired
    private FuncionarioRepository funcionarioRepository;

    @Autowired
    private CargoRepository cargoRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Value("${api.admin.name}")
    private String adminNome;

    @Value("${api.admin.login}")
    private String adminLogin;

    @Value("${api.admin.pass}")
    private String adminPass;

    @Override
    public void run(String... args) throws Exception {
        if (cargoRepository.count() == 0) {
            Cargo cargoAdmin = new Cargo("Administrador", new BigDecimal("5000.00"));
            Cargo cargoGerente = new Cargo("Gerente", new BigDecimal("4000.00"));
            Cargo cargoAtendente = new Cargo("Atendente", new BigDecimal("3000.00"));
            Cargo cargoCaixa = new Cargo("Caixa", new BigDecimal("2000.00"));

            cargoRepository.save(cargoAdmin);
            cargoRepository.save(cargoGerente);
            cargoRepository.save(cargoAtendente);
            cargoRepository.save(cargoCaixa);

            if (funcionarioRepository.count() == 0) {
                Login loginAdmin = new Login(adminLogin, passwordEncoder.encode(adminPass));

                Funcionario admin = new Funcionario(
                        adminNome,
                        "000.000.000-00",
                        "Rua Admin",
                        "00000-000",
                        "1",
                        "Sede",
                        "00000000000",
                        loginAdmin,
                        cargoAdmin
                );

                loginAdmin.setFuncionario(admin);
                funcionarioRepository.save(admin);
            }
        }
    }
}