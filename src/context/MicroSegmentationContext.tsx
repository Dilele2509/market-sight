import { createContext, useContext, useState } from "react";

const MicroSegmentationContext = createContext<any>(null);

export function MicroSegmentationProvider({ children }) {
    const [selectedSegment, setSelectedSegment] = useState(null);
    const [segmentationName, setSegmentationName] = useState("");

    return (
        <MicroSegmentationContext.Provider value={{ selectedSegment, setSelectedSegment, segmentationName, setSegmentationName }}>
            {children}
        </MicroSegmentationContext.Provider>
    );
}

export function useMicroSegmentation() {
    return useContext(MicroSegmentationContext);
}
