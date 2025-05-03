import React, { createContext, useState, useContext, ReactNode, useEffect } from "react";

interface LifecycleContextProps {
    date: Date;
    setDate: React.Dispatch<React.SetStateAction<Date>>;
    timeRange: number;
    setTimeRange: React.Dispatch<React.SetStateAction<number>>;
    startDate: Date;
    setStartDate: React.Dispatch<React.SetStateAction<Date>>;
}

const LifecycleContext = createContext<LifecycleContextProps | undefined>(undefined);


export const LifecycleContextProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [date, setDate] = useState<Date>(new Date()) 
    const [timeRange, setTimeRange] = useState<number>(1) // timeRange = 1 thang
    const [startDate, setStartDate] = useState<Date>()

    return (
        <LifecycleContext.Provider
            value={{
                date,
                setDate,
                timeRange,
                setTimeRange,
                startDate,
                setStartDate
            }}
        >
            {children}
        </LifecycleContext.Provider>
    );
};

export const useLifeContext = () => {
    const context = useContext(LifecycleContext);
    if (!context) {
        throw new Error("useSegment must be used within a SegmentProvider");
    }
    return context;
};
