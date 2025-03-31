// src/types/segmentTypes.ts

/** Định nghĩa kiểu dữ liệu cho một segment */
export interface Segment {
    id: string;
    name: string;
    dataset: string;
    last_updated: string;
    size: number;
    status: string;
    description?: string;
    rootOperator: string;
    conditions: any[]; 
    conditionGroups: any[]; 
}

// /** Định nghĩa kiểu dữ liệu cho một segment */
// export interface SegmentList {
//     id: string;
//     name: string;
//     dataset: string;
//     last_updated: string;
//     size: number;
//     status: string;
//   }


/** Props của component SegmentBuilder */
export interface SegmentBuilderProps {
    onBack: (updatedSegment?: Segment) => void;
    editSegment?: Segment;
}

/** Props của component SegmentsList */
export interface SegmentsListProps {
    segments?: Segment[];
    onCreateSegment?: () => void;
    onEditSegment?: (segment: Segment) => void;
}
