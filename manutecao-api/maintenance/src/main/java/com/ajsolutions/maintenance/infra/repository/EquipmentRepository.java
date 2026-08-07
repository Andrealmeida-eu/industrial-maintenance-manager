package com.ajsolutions.barber.infra.repository;

import com.ajsolutions.barber.infra.entities.Equipment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface EquipmentRepository extends JpaRepository<Equipment, Long> {
    @Query("""
    select distinct e
    from Equipment e
    left join fetch e.ordensServico os
    left join fetch os.historico h
    left join fetch e.historicoOperacional ho
    where e.id = :id
""")
    Optional<Equipment> buscarDetalhadoPorId(@Param("id") Long id);


}
