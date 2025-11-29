package com.LibReserve.backend.repository;

import com.LibReserve.backend.domain.AdminNotificationHistory;
import com.LibReserve.backend.dto.AdminNotification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AdminNotificationHistoryRepository extends JpaRepository<AdminNotificationHistory, Long> {
    //특정 사용자의 읽지않은 알림 조회
    List<AdminNotificationHistory> findByUserIdAndIsReadFalse(Long userId);

    //특정 사용자의 모든 알림 조회
    List<AdminNotificationHistory> findByUserIdOrderByCreatedAtDesc(Long userId);
}