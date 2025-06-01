import { useEffect, useState } from "react";

interface ScoreBarProps {
    value: number; // giá trị từ 1 đến 5
    max?: number;  // mặc định là 5
    color?: string; // màu cho phần đã đạt được
}

const ScoreBar = ({ value, max = 5, color = "#4CAF50" }: ScoreBarProps) => {
    const [current, setCurrent] = useState(0);

    useEffect(() => {
        let timer: NodeJS.Timeout;

        if (current < value) {
            timer = setTimeout(() => {
                setCurrent((prev) => prev + 1);
            }, 150); // mỗi 150ms tăng 1 ô
        }

        return () => clearTimeout(timer);
    }, [current, value]);

    return (
        <div className="flex space-x-1">
            {Array.from({ length: max }).map((_, idx) => (
                <div
                    key={idx}
                    className="h-2 w-4 rounded-sm transition-all duration-300"
                    style={{
                        backgroundColor: idx < current ? color : "#e0e0e0",
                    }}
                />
            ))}
        </div>
    );
};

export default ScoreBar;
