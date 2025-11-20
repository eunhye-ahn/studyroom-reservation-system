
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

type Item = {
  id: number;
  readingRoomName: string;
  seatNumber: number;
  date: string;       // "YYYY-MM-DD"
  startTime: string;  // "HH:mm:ss"
  endTime: string;    // "HH:mm:ss"
};

export function ActiveReservationModal({
  item,
  onCancel,
  onClose,
  onGoMyPage,
}: {
  item: Item;
  onCancel: (id: number) => Promise<void>;
  onClose: () => void;
  onGoMyPage: () => void;
}) {
    dayjs.extend(relativeTime);
  const endISO = `${item.date}T${item.endTime}`;
  const endDateTime = dayjs(endISO);
  const now = dayjs();

  if(endDateTime.isBefore(now)){
    return null;
  }

  const remain = dayjs(endISO).fromNow(true); // 예: "2시간"



  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center">
      <div className="bg-white w-full max-w-md rounded-2xl p-6 space-y-4">
        <h2 className="text-lg font-semibold flex items-center justify-center">현재 이용 중인 예약</h2>
        <div className="border rounded-xl p-3">
          <div className="font-medium">
            {item.readingRoomName} · {item.seatNumber}번
          </div>
          <div className="text-sm text-gray-600">
            {item.date} {item.startTime} ~ {item.endTime}
          </div>
          <div className="text-sm">남은 시간: {remain} 남음</div>
        </div>
        <div className="flex justify-center gap-18">
          <button className="w-30 px-3 py-2 rounded-xl bg-[#2E22AC] text-white" onClick={() => onCancel(item.id)}>반납</button>
          <button className="w-30 px-3 py-2 rounded-xl " onClick={onClose}>닫기</button>
        </div>
      </div>
    </div>
  );
}
