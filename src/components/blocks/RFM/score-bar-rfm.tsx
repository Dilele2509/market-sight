interface ScoreBarProps {
    value: number; // giá trị từ 1 đến 5
    max?: number;  // mặc định là 5
    color?: string; // màu cho phần đã đạt được
}

const ScoreBar = ({ value, max = 5, color = "#4CAF50" }: ScoreBarProps) => {
    return (
        <div className="flex space-x-1">
            {Array.from({ length: max }).map((_, idx) => (
                <div
                    key={idx}
                    className="h-2 w-4 rounded-sm"
                    style={{
                        backgroundColor: idx < value ? color : "#e0e0e0",
                    }}
                />
            ))}
        </div>
    );
};

export default ScoreBar