import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { X, Plus } from "lucide-react";

interface Segment {
    id: string;
    name: string;
    count: number;
}

interface InclusionExclusionProps {
    inclusions: Segment[];
    exclusions: Segment[];
    handleRemoveInclusion: (id: string) => void;
    handleRemoveExclusion: (id: string) => void;
    handleOpenSegmentSelector: (type: "include" | "exclude") => void;
}

const InclusionExclusion = ({
    inclusions,
    exclusions,
    handleRemoveInclusion,
    handleRemoveExclusion,
    handleOpenSegmentSelector,
}: InclusionExclusionProps) => {
    return (
        <div className="mt-4 mb-4">
            <h2 className="text-lg font-semibold">Include or Exclude Other Segments</h2>

            {/* Inclusions */}
            <div className="mb-3">
                <h3 className="text-base font-medium mb-2">Include records that are in:</h3>

                {inclusions.length > 0 ? (
                    <div className="mb-2 flex flex-wrap gap-2">
                        {inclusions.map((segment) => (
                            <Badge
                                key={segment.id}
                                variant="outline"
                                className="flex items-center gap-1 px-2 py-1 text-sm border-primary"
                            >
                                {segment.name} ({segment.count})
                                <button
                                    className="ml-1 text-primary hover:text-red-500"
                                    onClick={() => handleRemoveInclusion(segment.id)}
                                >
                                    <X className="w-3 h-3" />
                                </button>
                            </Badge>
                        ))}
                    </div>
                ) : (
                    <p className="text-sm italic text-muted-foreground mb-2">No inclusions defined</p>
                )}

                <Button
                    variant="outline"
                    size="sm"
                    className="text-sm"
                    onClick={() => handleOpenSegmentSelector("include")}
                >
                    <Plus className="w-4 h-4 mr-2" /> Add segment inclusion
                </Button>
            </div>

            {/* Exclusions */}
            <div>
                <h3 className="text-base font-medium mb-2">Exclude records that are in:</h3>

                {exclusions.length > 0 ? (
                    <div className="mb-2 flex flex-wrap gap-2">
                        {exclusions.map((segment) => (
                            <Badge
                                key={segment.id}
                                variant="outline"
                                className="flex items-center gap-1 px-2 py-1 text-sm border-error"
                            >
                                {segment.name} ({segment.count})
                                <button
                                    className="ml-1 text-error hover:text-error"
                                    onClick={() => handleRemoveExclusion(segment.id)}
                                >
                                    <X className="w-3 h-3" />
                                </button>
                            </Badge>
                        ))}
                    </div>
                ) : (
                    <p className="text-sm italic text-muted-foreground mb-2">No exclusions defined</p>
                )}

                <Button
                    variant="outline"
                    size="sm"
                    className="text-sm"
                    onClick={() => handleOpenSegmentSelector("exclude")}
                >
                    <Plus className="w-4 h-4 mr-2" /> Add segment exclusion
                </Button>
            </div>
        </div>
    );
};

export default InclusionExclusion;
