import { ResponseData } from "@/types/aichat";
import { Segment } from "@/types/segmentTypes";
import { Condition } from "@/utils/segmentFunctionHelper";
import React, { createContext, useState, useContext, ReactNode, useEffect } from "react";

interface AiChatContextProps {
    editSegment: Segment;
    setEditSegment: React.Dispatch<React.SetStateAction<Segment>>;
    segmentName: string;
    setSegmentName: React.Dispatch<React.SetStateAction<string>>;
    segmentId: string;
    setSegmentId: React.Dispatch<React.SetStateAction<string>>;
    attributes: any[];
    setAttributes: React.Dispatch<React.SetStateAction<any[]>>;
    sqlQuery: string;
    setSqlQuery: React.Dispatch<React.SetStateAction<string>>
    previewData: any[];
    setPreviewData: React.Dispatch<React.SetStateAction<any[]>>;
    rootOperator: string;
    setRootOperator: React.Dispatch<React.SetStateAction<string>>;
    conditions: Condition[];
    setConditions: React.Dispatch<React.SetStateAction<Condition[]>>;
    conditionGroups: any[];
    setConditionGroups: React.Dispatch<React.SetStateAction<any[]>>;
    responseData: ResponseData,
    setResponseData: React.Dispatch<React.SetStateAction<ResponseData>>;
    hasTypedSqlOnce: boolean,
    setHasTypedSqlOnce: React.Dispatch<React.SetStateAction<boolean>>;
    inputMessage: string;
    setInputMessage: React.Dispatch<React.SetStateAction<string>>;
}

const AiChatContext = createContext<AiChatContextProps | undefined>(undefined);


export const AiChatContextProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [inputMessage, setInputMessage] = useState("")
    const [hasTypedSqlOnce, setHasTypedSqlOnce] = useState(false)
    const [responseData, setResponseData] = useState<ResponseData | null>(null)
    const [editSegment, setEditSegment] = useState(null);
    const [segmentName, setSegmentName] = useState<string>("High Value Users (new)");
    const [segmentId, setSegmentId] = useState<string>("segment:high-value-users-new");
    const [attributes, setAttributes] = useState<any[]>([]);
    const [sqlQuery, setSqlQuery] = useState<string>("")
    const [previewData, setPreviewData] = useState<any[]>([]);
    const [rootOperator, setRootOperator] = useState<string>("AND");
    const [conditions, setConditions] = useState<Condition[]>([]);
    const [conditionGroups, setConditionGroups] = useState<any[]>([]);

    return (
        <AiChatContext.Provider
            value={{
                editSegment,
                setEditSegment,
                segmentName,
                setSegmentName,
                segmentId,
                setSegmentId,
                attributes,
                setAttributes,
                sqlQuery,
                setSqlQuery,
                previewData,
                setPreviewData,
                rootOperator,
                setRootOperator,
                conditions,
                setConditions,
                conditionGroups,
                setConditionGroups,
                responseData,
                setResponseData,
                hasTypedSqlOnce,
                setHasTypedSqlOnce,
                inputMessage,
                setInputMessage
            }}
        >
            {children}
        </AiChatContext.Provider>
    );
};

export const useAiChatContext = () => {
    const context = useContext(AiChatContext);
    if (!context) {
        throw new Error("useSegment must be used within a AiChatContext");
    }
    return context;
};
