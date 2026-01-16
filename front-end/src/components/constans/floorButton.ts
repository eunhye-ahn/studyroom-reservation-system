import { FloorButton, FloorId } from "../../types/type";

export const FLOOR_BUTTONS: Record<FloorId, FloorButton[]> = {
    1: [
        { id: "1", x: 550, y: 486, w: 90, h: 30, label: "책마당", roomId: 1, image: "map/1_book_A.jpg" },
        { id: "2", x: 78, y: 372, w: 90, h: 30, label: "어울림마루", roomId: 6, image: "map/1_eulim_A.jpg" },
        { id: "5", x: 194, y: 239, w: 90, h: 30, label: "상상스테이지", roomId: 0, image: "map/test.jpg" },
        { id: "6", x: 560, y: 176, w: 90, h: 30, label: "미디어라운지", roomId: 3, image: "map/1_media_pc.jpg" },
    ],
    2: [
        { id: "7", x: 620, y: 135, w: 90, h: 30, label: "열람실 201호", roomId: 4, image: "map/2_study201.jpg" },
        { id: "8", x: 757, y: 146, w: 90, h: 30, label: "열람실 202호", roomId: 5, image: "map/2_study202.jpg" },
        { id: "11", x: 570, y: 518, w: 90, h: 30, label: "창의마루A", roomId: 2, image: "map/2_chang_A.jpg" },
        { id: "12", x: 24, y: 350, w: 90, h: 30, label: "창의마루B", roomId: 9, image: "map/2_chang_B.jpg" },
    ],
    3: [
        { id: "14", x: 72, y: 352, w: 97, h: 30, label: "해오름마루 A", roomId: 7, image: "map/3_hae_A.jpg" },
        { id: "15", x: 560, y: 525, w: 100, h: 30, label: "해오름마루 B", roomId: 8, image: "map/3_hae_B.jpg" },

    ],
    4: [
        { id: "20", x: 770, y: 348, w: 90, h: 30, label: "열람실 404호", roomId: 10, image: "map/4_study404.jpg" }

    ],

} as const;

