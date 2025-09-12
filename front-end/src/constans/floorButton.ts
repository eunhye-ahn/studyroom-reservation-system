import {FloorButton, FloorId} from "../api/type";

export const FLOOR_BUTTONS: Record<FloorId, FloorButton[]> = {
    1: [
        { id: "1", x: 550, y: 486, w: 90, h: 30, label: "책마당", roomId:1, image:"map/1_book_A.jpg" },
        { id: "2", x: 78, y: 372, w: 90, h: 30, label: "어울림마루", roomId:6, image:"map/1_eulim_A.jpg" },
        { id: "3", x: 828, y: 351, w: 90, h: 30, label: "통합상황실", roomId:1, image:"map/test.jpg" },
        { id: "4", x: 719, y: 385, w: 138, h: 30, label: "스마트그룹스터디실", roomId:0, image:"map/test.jpg" },
        { id: "5", x: 194, y: 239, w: 90, h: 30, label: "상상스테이지", roomId:0, image:"map/test.jpg"  },
        { id: "6", x: 560, y: 176, w: 90, h: 30, label: "미디어라운지", roomId:3, image:"map/1_media_pc.jpg" },
    ],
    2: [
        { id: "7", x: 620, y: 135, w: 90, h: 30, label: "열람실 201호", roomId:4, image:"map/2_study201.jpg" },
        { id: "8", x: 757, y: 146, w: 90, h: 30, label: "열람실 202호", roomId:5, image:"map/2_study202.jpg" },
        { id: "9", x: 500, y: 308, w: 60, h: 30, label: "복사실", roomId:0, image:"map/test.jpg" },
        { id: "10", x: 590, y: 318, w: 75, h: 30, label: "개인캐럴", roomId:0, image:"map/test.jpg" },
        { id: "11", x: 570, y: 518, w: 90, h: 30, label: "창의마루A", roomId:2, image:"map/2_chang_A.jpg" },
        { id: "12", x: 24, y: 350, w: 90, h: 30, label: "창의마루B", roomId:9, image:"map/2_chang_B.jpg" },
    ],
    3: [
        { id: "13", x: 204, y: 222, w: 90, h: 30, label: "범무고", roomId:"stage", image:"map/test.jpg" },
        { id: "14", x: 73, y: 353, w: 90, h: 30, label: "해오름마루 A", roomId:7, image:"map/3_hae_A.jpg" },
        { id: "15", x: 547, y: 523, w: 90, h: 30, label: "해오름마루 B", roomId:8, image:"map/3_hae_B.jpg" },
        { id: "16", x: 546, y: 188, w: 100, h: 30, label: "그룹스터디실", roomId:"stage", image:"map/test.jpg" },
        { id: "17", x: 553, y: 260, w: 120, h: 30, label: "학술정보지원팀", roomId:"stage", image:"map/test.jpg" },
        { id: "18", x: 757, y: 308, w: 90, h: 30, label: "한적서실", roomId:"stage", image:"map/test.jpg" },
        { id: "19", x: 783, y: 389, w: 90, h: 30, label: "관장실/과장실", roomId:"stage", image:"map/test.jpg" },

    ],
    4: [
        {id : "20", x: 783, y: 389, w: 90, h: 30, label: "열람실 404호", roomId:10, image:"map/4_study404.jpg"}

    ],

} as const;

