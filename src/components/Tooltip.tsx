import React, {ReactNode, useState} from "react";

type TooltipProps = {
    text: string;
    children: ReactNode;
};

const Tooltip = ({text, children}: TooltipProps) => {
    const [tooltipState, setTooltipState] = useState<{ visible: boolean; x: number; y: number }>({
        visible: false,
        x: 0,
        y: 0,
    });

    const handleMouseEnter = (e: React.MouseEvent) => {
        setTooltipState({
            visible: true,
            x: e.clientX,
            y: e.clientY,
        });
    };

    const handleMouseMove = (e: React.MouseEvent) => {
        setTooltipState((prev) => ({
            ...prev,
            x: e.clientX,
            y: e.clientY,
        }));
    };

    const handleMouseLeave = () => {
        setTooltipState({
            visible: false,
            x: 0,
            y: 0,
        });
    };

    return (
        <>
            <div
                onMouseEnter={handleMouseEnter}
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
            >
                {children}
            </div>

            {tooltipState.visible && (
                <div
                    className="absolute bg-blue-600 text-white px-2 py-1 text-xl rounded shadow-lg pointer-events-none"
                    style={{
                        top: tooltipState.y - 25,
                        left: tooltipState.x,
                        transform: "translate(-50%, -50%)",
                        zIndex: 999,
                    }}
                >
                    {text}
                </div>
            )}
        </>
    );
};

export default Tooltip;
