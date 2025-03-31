import { useState } from "react";
import SegmentsList from "@/components/blocks/segmentation/SegmentsList";
import SegmentBuilder from "@/components/blocks/segmentation/SegmentBuilder";
import { Segment } from "@/types/segmentTypes";

export default function UserCreate() {
  const [showSegmentBuilder, setShowSegmentBuilder] = useState<boolean>(false);
  const [selectedSegment, setSelectedSegment] = useState<Segment | null>(null);
  const [segments, setSegments] = useState<Segment[]>([]);

  const handleEditSegment = (segment: Segment) => {
    console.log("🖊️ [App] Editing segment:", segment);
    setSelectedSegment(segment);
    setShowSegmentBuilder(true);
  };

  const handleBackFromBuilder = (updatedSegment?: Segment) => {
    setSelectedSegment(null);
    setShowSegmentBuilder(false);
  };

  return (
    <>
      {showSegmentBuilder ? (
        <SegmentBuilder onBack={handleBackFromBuilder} editSegment={selectedSegment} />
      ) : (
        <SegmentsList
          segments={segments}
          onCreateSegment={() => {
            setSelectedSegment(null);
            setShowSegmentBuilder(true);
          }}
          onEditSegment={handleEditSegment}
        />
      )}
    </>
  );
}
