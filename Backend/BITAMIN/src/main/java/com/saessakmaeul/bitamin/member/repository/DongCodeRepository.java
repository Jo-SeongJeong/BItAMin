package com.saessakmaeul.bitamin.member.repository;

import com.saessakmaeul.bitamin.member.dto.response.DongCodeResponse;
import com.saessakmaeul.bitamin.member.entity.DongCode;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface DongCodeRepository extends JpaRepository<DongCode, String> {

    @Query("SELECT new com.saessakmaeul.bitamin.member.dto.response.DongCodeResponse (d.sidoName, d.gugunName, d.dongName, d.xCoordinate, d.yCoordinate, d.lat, d.lng) FROM DongCode d WHERE d.dongCode = :dongCode")
    Optional<DongCodeResponse> findNamesByDongCode(@Param("dongCode") String dongCode);


    @Query("SELECT d.dongCode FROM DongCode d WHERE d.sidoName = :sidoName AND (:gugunName IS NULL AND d.gugunName IS NULL OR d.gugunName = :gugunName) AND (:dongName IS NULL AND d.dongName IS NULL OR d.dongName = :dongName)")
    Optional<String> findDongCode(@Param("sidoName") String sidoName, @Param("gugunName") String gugunName, @Param("dongName") String dongName);

    @Query("SELECT DISTINCT d.sidoName FROM DongCode d WHERE d.sidoName IS NOT NULL")
    List<String> findDistinctSidoNames();

    @Query("SELECT DISTINCT d.gugunName FROM DongCode d WHERE d.sidoName = :sidoName AND d.gugunName IS NOT NULL")
    List<String> findGugunNamesBySidoName(@Param("sidoName") String sidoName);

    @Query("SELECT DISTINCT d.dongName FROM DongCode d WHERE d.sidoName = :sidoName AND d.gugunName = :gugunName AND d.dongName IS NOT NULL")
    List<String> findDongNamesBySidoNameAndGugunName(@Param("sidoName") String sidoName, @Param("gugunName") String gugunName);

}
