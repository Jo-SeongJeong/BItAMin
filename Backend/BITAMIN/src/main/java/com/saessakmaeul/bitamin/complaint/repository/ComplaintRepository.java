package com.saessakmaeul.bitamin.complaint.repository;

import com.saessakmaeul.bitamin.complaint.entity.Complaint;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ComplaintRepository extends JpaRepository<Complaint,Long> {
    List<Complaint> findAllByRespondentId(long id);
}
