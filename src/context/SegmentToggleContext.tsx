import React, { createContext, useState, useContext, ReactNode } from "react";

interface SegmentToggleContextProps {
    logged: boolean;
    setLogged: React.Dispatch<React.SetStateAction<boolean>>;
    isEditMode: boolean;
    loading: boolean;
    setLoading: React.Dispatch<React.SetStateAction<boolean>>;
    isDisableRelatedAdd: boolean;
    setIsDisableRelatedAdd: React.Dispatch<React.SetStateAction<boolean>>;
    previewLoading: boolean;
    setPreviewLoading: React.Dispatch<React.SetStateAction<boolean>>;
    previewOpen: boolean;
    setPreviewOpen: React.Dispatch<React.SetStateAction<boolean>>;
    hasUnsavedChanges: boolean;
    setHasUnsavedChanges: React.Dispatch<React.SetStateAction<boolean>>;
    sqlDialogOpen: boolean;
    setSqlDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
    discardConfirmOpen: boolean;
    setDiscardConfirmOpen: React.Dispatch<React.SetStateAction<boolean>>;
    showDescriptionField: boolean;
    setShowDescriptionField: React.Dispatch<React.SetStateAction<boolean>>
    copySuccess: boolean;
    setCopySuccess: React.Dispatch<React.SetStateAction<boolean>>
    segmentSelectorOpen: boolean;
    setSegmentSelectorOpen: React.Dispatch<React.SetStateAction<boolean>>
    connectionDialog: boolean;
    setConnectionDialog: React.Dispatch<React.SetStateAction<boolean>>
}

const SegmentToggleContext = createContext<SegmentToggleContextProps | undefined>(undefined);

export const SegmentToggleProvider: React.FC<{ children: ReactNode; editSegment?: any }> = ({ children, editSegment }) => {
    const isEditMode = !!editSegment;
    const [logged, setLogged] = useState<boolean>(() => {
        return localStorage.getItem('user') !== null;
    });
    const [loading, setLoading] = useState<boolean>(false);

    const [isDisableRelatedAdd, setIsDisableRelatedAdd] = useState(false)

    const [previewLoading, setPreviewLoading] = useState<boolean>(false);
    const [previewOpen, setPreviewOpen] = useState<boolean>(false);
    const [hasUnsavedChanges, setHasUnsavedChanges] = useState<boolean>(false);

    const [sqlDialogOpen, setSqlDialogOpen] = useState<boolean>(false);
    const [discardConfirmOpen, setDiscardConfirmOpen] = useState(false);

    const [showDescriptionField, setShowDescriptionField] = useState(editSegment ? !!editSegment.description : false);
    const [copySuccess, setCopySuccess] = useState(false);

    // Dialog states
    const [segmentSelectorOpen, setSegmentSelectorOpen] = useState(false);

    const [connectionDialog, setConnectionDialog] = useState(false);


    return (
        <SegmentToggleContext.Provider
            value={{
                isEditMode,
                logged,
                setLogged,
                loading,
                setLoading,
                isDisableRelatedAdd,
                setIsDisableRelatedAdd,
                previewLoading,
                setPreviewLoading,
                previewOpen,
                setPreviewOpen,
                hasUnsavedChanges,
                setHasUnsavedChanges,
                sqlDialogOpen,
                setSqlDialogOpen,
                discardConfirmOpen,
                setDiscardConfirmOpen,
                showDescriptionField,
                setShowDescriptionField,
                copySuccess,
                setCopySuccess,
                segmentSelectorOpen,
                setSegmentSelectorOpen,
                connectionDialog,
                setConnectionDialog
            }}
        >
            {children}
        </SegmentToggleContext.Provider>
    );
};

export const useSegmentToggle = () => {
    const context = useContext(SegmentToggleContext);
    if (!context) {
        throw new Error("useSegment must be used within a SegmentProvider");
    }
    return context;
};
