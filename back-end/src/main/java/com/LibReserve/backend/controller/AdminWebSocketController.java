package com.LibReserve.backend.controller;

import com.LibReserve.backend.domain.Seat;
import com.LibReserve.backend.dto.AdminControlRequest;
import com.LibReserve.backend.dto.AdminNotification;
import com.LibReserve.backend.dto.SeatStatusMessage;
import com.LibReserve.backend.service.SeatService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

@Slf4j
@Controller
@RequiredArgsConstructor
public class AdminWebSocketController {
    private final SeatService seatService;
    private final SimpMessagingTemplate messagingTemplate;


    private static final String ADMIN_PASSWORD = "1234";

    @MessageMapping("/admin/control")
    public void handleAdminControl(AdminControlRequest request){

        //관리자 권한 확인
        if (!ADMIN_PASSWORD.equals(request.getAdminPassword())) {
            log.warn("잘못된 관리자 비밀번호");
            return;  // 권한 없으면 무시
        }
        //액션별 처리핸들러 불러오기
        if("FORCE_RETURN".equals(request.getAction())) {
            handleForceReturn(request.getSeatId()); //강제반납
        } else if ("ANNOUNCEMENT".equals(request.getAction())) {
            handleAnnouncement(request.getMessage()); //긴급공지
        }
    }

    private void handleForceReturn(Long seatId) {
        try{
            //db에서 좌석 찾기
            Seat seat = seatService.getSeatById(seatId);

            //해당 좌석의 사용여부 확인
            boolean wasOccupied = !seat.isAvailable();

            //좌석 사용가능으로 만들기
            seat.setAvailable(true);
            seatService.saveSeat(seat);

            //메시지 생성(모두에게 반납됨을 알리도록 브로드캐스트)
            SeatStatusMessage statusUpdate = new SeatStatusMessage(
                    seatId,
                    SeatStatusMessage.SeatStatus.AVAILABLE,
                    "관리자에 의해 반납됨"
            );
            messagingTemplate.convertAndSend("/topic/seats", statusUpdate);

            //해당좌석 사용자에게 개별 알림
            if(wasOccupied){
                AdminNotification notification = new AdminNotification(
                        "FORCE_RETURNED",
                        "관리자에 의해 좌석" + seatId + "번이 강제 반납되었습니다",
                        seatId
                );
                messagingTemplate.convertAndSend("/topic/seat/"+ seatId, notification);

            }
            log.info("좌석 {}번 강제 반납 완료",  seatId);

        }catch (Exception e){
            log.error("강제반납처리오류:{}", e.getMessage());
        }
    }

    //전체에게 보낼 것임
    private void handleAnnouncement(String message) {
        //객체 생성
        AdminNotification notification = new AdminNotification(
                "ANNOUNCEMENT",
                message,
                null
        );

        //모든 클라이언트에게 브로드캐스트
        messagingTemplate.convertAndSend("/topic/announcements", notification);

        log.info("긴급공지 전송완료:{}", message);
    }
}
