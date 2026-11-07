package com.example.transit.guarantee;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface GuaranteeRepository extends JpaRepository<Guarantee, String> {

  List<Guarantee> findAllByOrderByGrnAsc();
}
