package com.festival.infrastructure.persistence.repository;

import com.festival.entity.DeviceToken;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DeviceTokenRepository extends JpaRepository<DeviceToken, Long> {

    List<DeviceToken> findByUsuarioIdAndActivoTrue(Long usuarioId);

    List<DeviceToken> findByActivoTrue();

    boolean existsByTokenFcm(String tokenFcm);
}
