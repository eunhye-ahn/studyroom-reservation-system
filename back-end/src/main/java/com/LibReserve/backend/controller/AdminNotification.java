package com.LibReserve.backend.controller;

import com.LibReserve.backend.domain.AdminNotificationHistory;
import com.LibReserve.backend.repository.AdminNotificationHistoryRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RequestMapping("api/notifications")
@RestController
@Slf4j
@RequiredArgsConstructor
public class AdminNotification {
    private final AdminNotificationHistoryRepository notificationHistoryRepository;

    //읽지않은알림조회
    @GetMapping("/unread")
    public ResponseEntity<List<AdminNotificationHistory>> getUnreadNotifications(
            @RequestParam(required = false) Long userId
    ) {
//        if(userId == null) {
//
//        }
        List<AdminNotificationHistory> notifications =
                notificationHistoryRepository.findByUserIdAndIsReadFalse(userId);
        log.info("사용자 {}의 읽지 않은 알림 {} 건 조회",userId, notifications.size());
        return ResponseEntity.ok(notifications);

    }

    //알림 읽음 처리
    @PostMapping("/{notificationId}/read")
    public ResponseEntity<String> markAsRead(@PathVariable Long notificationId) {
        AdminNotificationHistory notification = notificationHistoryRepository.findById(notificationId)
                .orElseThrow(()-> new IllegalArgumentException("알림을 찾을 수 없습니다:"+notificationId));
        notification.setRead(true);
        notificationHistoryRepository.save(notification);

        log.info("알림 {} 읽음 처리 완료",notificationId);
        return ResponseEntity.ok("알림 읽음 처리 완료");
    }
}
