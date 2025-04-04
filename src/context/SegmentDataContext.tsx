import React, { createContext, useState, useContext, ReactNode } from "react";

interface SegmentDataContextProps {
    segmentName: string;
    setSegmentName: React.Dispatch<React.SetStateAction<string>>;
    segmentId: string;
    setSegmentId: React.Dispatch<React.SetStateAction<string>>;
    attributes: any[];
    setAttributes: React.Dispatch<React.SetStateAction<any[]>>;
    selectedDataset: any;
    setSelectedDataset: React.Dispatch<React.SetStateAction<any>>;
    datasets: Record<string, any>;
    setDatasets: React.Dispatch<React.SetStateAction<Record<string, any>>>;
    previewData: any[];
    setPreviewData: React.Dispatch<React.SetStateAction<any[]>>;
    rootOperator: string;
    setRootOperator: React.Dispatch<React.SetStateAction<string>>;
    conditions: any[];
    setConditions: React.Dispatch<React.SetStateAction<any[]>>;
    conditionGroups: any[];
    setConditionGroups: React.Dispatch<React.SetStateAction<any[]>>;
    description: string;
    setDescription: React.Dispatch<React.SetStateAction<string>>;
    estimatedSize: any;
    setEstimatedSize: React.Dispatch<React.SetStateAction<any>>;
    editableSql: string;
    setEditableSql: React.Dispatch<React.SetStateAction<string>>;
    sqlError: any;
    setSqlError: React.Dispatch<React.SetStateAction<any>>;
    initialConditions: any[];
    setInitialConditions: React.Dispatch<React.SetStateAction<any[]>>;
    initialConditionGroups: any[];
    setInitialConditionGroups: React.Dispatch<React.SetStateAction<any[]>>;
    initialRootOperator: string;
    setInitialRootOperator: React.Dispatch<React.SetStateAction<string>>;
    initialSegmentName: string;
    setInitialSegmentName: React.Dispatch<React.SetStateAction<string>>;
    initialDescription: string;
    setInitialDescription: React.Dispatch<React.SetStateAction<string>>;
    relatedDatasets: any;
    setRelatedDatasets: React.Dispatch<React.SetStateAction<any>>;
    inclusions: any[];
    setInclusions: React.Dispatch<React.SetStateAction<any[]>>;
    exclusions: any[];
    setExclusions: React.Dispatch<React.SetStateAction<any[]>>;
    availableSegments: any;
    setAvailableSegments: Record<string, any>;
    selectionMode: string
    setSelectionMode: React.Dispatch<React.SetStateAction<string>>;
    connectionUrl: string;
    setConnectionUrl: React.Dispatch<React.SetStateAction<string>>;
    CONNECTION_STORAGE_KEY: string;
    CONNECTION_EXPIRY_KEY: string;
    ONE_HOUR_MS: number;
    query: string;
    setQuery: React.Dispatch<React.SetStateAction<string>>;
    selectedTable: string;
    setSelectedTable: React.Dispatch<React.SetStateAction<string>>;
    tables: Record<string, any>;
    setTables: React.Dispatch<React.SetStateAction<Record<string, any>>>;
    results: any
    setResults: React.Dispatch<React.SetStateAction<any>>;
    error: any
    setError: React.Dispatch<React.SetStateAction<any>>;
    file: any
    setFile: React.Dispatch<React.SetStateAction<any>>;
    displayUrl: string
    setDisplayUrl: React.Dispatch<React.SetStateAction<string>>;
}

const SegmentDataContext = createContext<SegmentDataContextProps | undefined>(undefined);

export const SegmentDataProvider: React.FC<{ children: ReactNode; editSegment?: any }> = ({ children, editSegment }) => {
    const isEditMode = !!editSegment;
    const [segmentName, setSegmentName] = useState<string>(editSegment?.name || "High Value Users (new)");
    const [segmentId, setSegmentId] = useState<string>(editSegment?.id || "segment:high-value-users-new");
    const [attributes, setAttributes] = useState<any[]>([]);
    const [selectedDataset, setSelectedDataset] = useState<string>(editSegment?.dataset || {
        name: "customers",
        fields: [
            "customer_id",
            "first_name",
            "last_name",
            "email",
            "phone",
            "gender",
            "birth_date",
            "registration_date",
            "address",
            "city"
        ],
        description: "Customer information",
        schema: "public"
    });
    // const [selectedDataset, setSelectedDataset] = useState<string>(editSegment?.dataset || 'Customer Profile');
    const [datasets, setDatasets] = useState<Record<string, any>>({
        "Customer Profile": {
            name: "customers", description: "Customer information", fields: [
                "customer_id",
                "first_name",
                "last_name",
                "email",
                "phone",
                "gender",
                "birth_date",
                "registration_date",
                "address",
                "city"
            ], schema: "public"
        },
        "Transactions": {
            name: "transactions", description: "Transaction records", fields: [
                "transaction_id",
                "customer_id",
                "store_id",
                "transaction_date",
                "total_amount",
                "payment_method",
                "product_line_id",
                "quantity",
                "unit_price"
            ], schema: "public"
        },
        "Stores": {
            name: "stores", description: "Store information", fields: [
                "store_id",
                "store_name",
                "address",
                "city",
                "store_type",
                "opening_date",
                "region"
            ], schema: "public"
        },
        "Product Line": {
            name: "product_lines", description: "Product information", fields: [
                "product_line_id",
                "name",
                "category",
                "subcategory",
                "brand",
                "unit_cost"
            ], schema: "public"
        },
    });

    const [previewData, setPreviewData] = useState<any[]>([]);
    const [rootOperator, setRootOperator] = useState<string>(editSegment?.rootOperator || "AND");
    const [conditions, setConditions] = useState<any[]>(editSegment?.conditions || [
        { id: 1, type: "attribute", field: "email", operator: "is_not_null", value: null }
    ]);
    const [conditionGroups, setConditionGroups] = useState<any[]>(editSegment?.conditionGroups || [
        { id: 2, type: "group", operator: "AND", conditions: [{ id: 3, type: "event", eventType: "performed", eventName: "New Canvas", frequency: "at_least", count: 3, timePeriod: "days", timeValue: 90 }] }
    ]);
    const [description, setDescription] = useState<string>(editSegment?.description || "");
    const [estimatedSize, setEstimatedSize] = useState<any>(
        editSegment
            ? { count: editSegment.size, percentage: Math.round((editSegment.size / 400) * 100) }
            : { count: 88, percentage: 22 }
    );

    const [editableSql, setEditableSql] = useState<string>("");
    const [sqlError, setSqlError] = useState<any>(null);

    const [initialConditions, setInitialConditions] = useState([]);
    const [initialConditionGroups, setInitialConditionGroups] = useState([]);
    const [initialRootOperator, setInitialRootOperator] = useState('AND');
    const [initialSegmentName, setInitialSegmentName] = useState('High Value Users (new)');
    const [initialDescription, setInitialDescription] = useState('');

    // General state
    const [relatedDatasets, setRelatedDatasets] = useState({
        "Customer Profile": ["Transactions", "Events"],
        "Transactions": ["Customer Profile", "Stores", "Product Line"],
        "Stores": ["Transactions"],
        "Product Line": ["Transactions"]
    });

    const [inclusions, setInclusions] = useState([]);
    const [exclusions, setExclusions] = useState([]);
    const [availableSegments, setAvailableSegments] = useState([
        { id: "segment:recent-customers", name: "Recent Customers", count: 456 },
        { id: "segment:vip-users", name: "VIP Users", count: 123 },
        { id: "segment:high-spenders", name: "High Spenders", count: 78 }
    ]);

    const [selectionMode, setSelectionMode] = useState("include"); // 'include' or 'exclude'


    const [connectionUrl, setConnectionUrl] = useState();
    const CONNECTION_STORAGE_KEY = 'postgres_connection';
    const CONNECTION_EXPIRY_KEY = 'postgres_connection_expiry';
    const ONE_HOUR_MS = 60 * 60 * 1000; // 1 hour in milliseconds

    const [selectedTable, setSelectedTable] = useState('');
    const [query, setQuery] = useState('');
    const [tables, setTables] = useState<Record<string, any>>({});
    const [results, setResults] = useState(null);
    const [error, setError] = useState(null);
    const [file, setFile] = useState(null);
    const [displayUrl, setDisplayUrl] = useState('');


    return (
        <SegmentDataContext.Provider
            value={{
                segmentName,
                setSegmentName,
                segmentId,
                setSegmentId,
                attributes,
                setAttributes,
                selectedDataset,
                setSelectedDataset,
                datasets,
                setDatasets,
                previewData,
                setPreviewData,
                rootOperator,
                setRootOperator,
                conditions,
                setConditions,
                conditionGroups,
                setConditionGroups,
                description,
                setDescription,
                estimatedSize,
                setEstimatedSize,
                editableSql,
                setEditableSql,
                sqlError,
                setSqlError,
                initialConditions,
                setInitialConditions,
                initialConditionGroups,
                setInitialConditionGroups,
                initialRootOperator,
                setInitialRootOperator,
                initialSegmentName,
                setInitialSegmentName,
                initialDescription,
                setInitialDescription,
                relatedDatasets,
                setRelatedDatasets,
                inclusions,
                setInclusions,
                exclusions,
                setExclusions,
                availableSegments,
                setAvailableSegments,
                selectionMode,
                setSelectionMode,
                connectionUrl,
                setConnectionUrl,
                CONNECTION_STORAGE_KEY,
                CONNECTION_EXPIRY_KEY,
                ONE_HOUR_MS,
                selectedTable,
                setSelectedTable,
                query,
                setQuery,
                tables,
                setTables,
                results,
                setResults,
                error,
                setError,
                file,
                setFile,
                displayUrl,
                setDisplayUrl
            }}
        >
            {children}
        </SegmentDataContext.Provider>
    );
};

export const useSegmentData = () => {
    const context = useContext(SegmentDataContext);
    if (!context) {
        throw new Error("useSegment must be used within a SegmentProvider");
    }
    return context;
};
