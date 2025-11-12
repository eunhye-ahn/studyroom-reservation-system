package com.LibReserve.backend.service;

import com.LibReserve.backend.domain.ReadingRoom;
import com.LibReserve.backend.domain.Seat;
import com.LibReserve.backend.dto.SeatResponse;
import com.LibReserve.backend.dto.SeatStatusDto;
import com.LibReserve.backend.dto.SeatStatusMessage;
import com.LibReserve.backend.repository.SeatRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.messaging.simp.SimpMessagingTemplate;


import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class SeatService {

    private final SeatRepository seatRepository;
    private final SimpMessagingTemplate messagingTemplate; //메시지 보내는 도구

    /**
     * 특정 열람실에 지정된 개수만큼 좌석 자동 생성 (1 ~ count)
     */
    @Transactional
    public int createSeats(ReadingRoom room, int count){
        List<Seat> batch = new ArrayList<>();
        for (int i = 1; i <= count; i++) {
            if (seatRepository.existsByReadingRoomIdAndNumber(room.getId(), i)) continue;
            Seat s = new Seat();
            s.setReadingRoom(room);
            s.setNumber(i);
            s.setAvailable(true);
            batch.add(s);
        }
        seatRepository.saveAll(batch);
        return batch.size();
    }

}
