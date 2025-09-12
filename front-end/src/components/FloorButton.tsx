import { FLOOR_BUTTONS } from "../constans/floorButton";
import { FloorId } from "../api/type";

export type FloorButtonProps = {
    floor: FloorId | null;
    onButtonClick?: (buttonId: string) => void
};

const FloorButtons: React.FC<FloorButtonProps> = ({ floor, onButtonClick }) => {
    if (!floor) return null;

    return (
        <g>
            {FLOOR_BUTTONS[floor]?.map((b) => (
                <g key={`${floor}-${b.id}`}
                    onClick={(e) => {
                        e.stopPropagation();
                        onButtonClick?.(b.id);
                    }}
                    style={{ cursor: "pointer" }}>
                    <rect x={b.x} y={b.y} width={b.w} height={b.h} rx="3" fill="rgba(46,34,172,1)" />
                    <text x={b.x + 10} y={b.y + b.h / 2 + 4} fill="white" fontSize="12" fontWeight="bold">
                        {b.label}
                    </text>
                </g>

            ))}
        </g>
    )
}

export default FloorButtons;