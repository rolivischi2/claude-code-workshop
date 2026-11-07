package com.example.transit.office;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface OfficeRepository extends JpaRepository<CustomsOffice, String> {

  List<CustomsOffice> findAllByOrderByCodeAsc();
}
