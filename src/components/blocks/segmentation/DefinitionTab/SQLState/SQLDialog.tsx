import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useSegmentData } from "@/context/SegmentDataContext";
import { useSegmentToggle } from "@/context/SegmentToggleContext";

export default function SQLDialog() {
    const {setSqlError,setEditableSql, editableSql, setRootOperator, setConditions, setConditionGroups, sqlError} = useSegmentData();
    const {setSqlDialogOpen, sqlDialogOpen} = useSegmentToggle();

    // Function to close SQL dialog
    const handleCloseSqlDialog = () => {
        setSqlDialogOpen(false);
    };

    // Function to handle SQL changes
    const handleSqlChange = (value) => {
        setEditableSql(value);
        // Clear any previous errors when user edits
        setSqlError(null);
    };

    const handleApplySqlChanges = () => {
        try {
            // Simple SQL parser to extract conditions from WHERE clause
            const sqlQuery = editableSql.trim();

            // Extract WHERE clause
            const whereClauseMatch = sqlQuery.match(/WHERE\s+(.*?)(?:\s+LIMIT|\s*$)/is);

            if (!whereClauseMatch || !whereClauseMatch[1]) {
                setSqlError("Could not find valid WHERE clause in SQL query");
                return;
            }

            let whereClause = whereClauseMatch[1].trim();

            // Skip parsing if WHERE clause is just 1=1
            if (whereClause === '1=1') {
                toast.info("No conditions to parse in SQL query");
                handleCloseSqlDialog();
                return;
            }

            // Split by AND/OR operators
            // This is a simplified parser and won't handle complex nested conditions
            const conditionOperator = whereClause.toUpperCase().includes(' AND ') ? 'AND' : 'OR';
            const conditionStatements = whereClause.split(new RegExp(`\\s+${conditionOperator}\\s+`, 'i'));

            // Set root operator based on SQL
            setRootOperator(conditionOperator);

            // Parse each condition
            const newConditions = conditionStatements.map((statement, index) => {
                const id = index + 1; // Simple ID assignment

                // Try to match different SQL patterns
                let fieldMatch, operatorType, valueMatch;

                // Parse IS NULL or IS NOT NULL
                if (/IS\s+NULL/i.test(statement)) {
                    fieldMatch = statement.match(/(\w+)\s+IS\s+NULL/i);
                    if (fieldMatch) {
                        return {
                            id,
                            type: 'attribute',
                            field: fieldMatch[1],
                            operator: 'is_null',
                            value: null
                        };
                    }
                }

                if (/IS\s+NOT\s+NULL/i.test(statement)) {
                    fieldMatch = statement.match(/(\w+)\s+IS\s+NOT\s+NULL/i);
                    if (fieldMatch) {
                        return {
                            id,
                            type: 'attribute',
                            field: fieldMatch[1],
                            operator: 'is_not_null',
                            value: null
                        };
                    }
                }

                // Parse LIKE conditions
                if (/LIKE/i.test(statement)) {
                    fieldMatch = statement.match(/(\w+)\s+LIKE\s+['"](.*)["']/i);
                    if (fieldMatch) {
                        const pattern = fieldMatch[2];

                        if (pattern.startsWith('%') && pattern.endsWith('%')) {
                            return {
                                id,
                                type: 'attribute',
                                field: fieldMatch[1],
                                operator: 'contains',
                                value: pattern.slice(1, -1)
                            };
                        } else if (pattern.startsWith('%')) {
                            return {
                                id,
                                type: 'attribute',
                                field: fieldMatch[1],
                                operator: 'ends_with',
                                value: pattern.slice(1)
                            };
                        } else if (pattern.endsWith('%')) {
                            return {
                                id,
                                type: 'attribute',
                                field: fieldMatch[1],
                                operator: 'starts_with',
                                value: pattern.slice(0, -1)
                            };
                        }
                    }
                }

                // Parse NOT LIKE conditions
                if (/NOT\s+LIKE/i.test(statement)) {
                    fieldMatch = statement.match(/(\w+)\s+NOT\s+LIKE\s+['"](.*)["']/i);
                    if (fieldMatch) {
                        return {
                            id,
                            type: 'attribute',
                            field: fieldMatch[1],
                            operator: 'not_contains',
                            value: fieldMatch[2].replace(/%/g, '')
                        };
                    }
                }

                // Parse BETWEEN conditions
                if (/BETWEEN/i.test(statement)) {
                    fieldMatch = statement.match(/(\w+)\s+BETWEEN\s+(.*)\s+AND\s+(.*)/i);
                    if (fieldMatch) {
                        const value1 = fieldMatch[2].trim().replace(/['"]/g, '');
                        const value2 = fieldMatch[3].trim().replace(/['"]/g, '');

                        return {
                            id,
                            type: 'attribute',
                            field: fieldMatch[1],
                            operator: 'between',
                            value: value1,
                            value2: value2
                        };
                    }
                }

                // Parse equals conditions
                const equalsMatch = statement.match(/(\w+)\s*=\s*['"]?([^'"]*?)['"]?$/i);
                if (equalsMatch) {
                    return {
                        id,
                        type: 'attribute',
                        field: equalsMatch[1],
                        operator: 'equals',
                        value: equalsMatch[2]
                    };
                }

                // Parse not equals conditions
                const notEqualsMatch = statement.match(/(\w+)\s*!=\s*['"]?([^'"]*?)['"]?$/i);
                if (notEqualsMatch) {
                    return {
                        id,
                        type: 'attribute',
                        field: notEqualsMatch[1],
                        operator: 'not_equals',
                        value: notEqualsMatch[2]
                    };
                }

                // Parse greater than conditions
                const greaterThanMatch = statement.match(/(\w+)\s*>\s*['"]?([^'"]*?)['"]?$/i);
                if (greaterThanMatch) {
                    return {
                        id,
                        type: 'attribute',
                        field: greaterThanMatch[1],
                        operator: 'greater_than',
                        value: greaterThanMatch[2]
                    };
                }

                // Parse less than conditions
                const lessThanMatch = statement.match(/(\w+)\s*<\s*['"]?([^'"]*?)['"]?$/i);
                if (lessThanMatch) {
                    return {
                        id,
                        type: 'attribute',
                        field: lessThanMatch[1],
                        operator: 'less_than',
                        value: lessThanMatch[2]
                    };
                }

                // If we couldn't parse this condition, return a placeholder
                return {
                    id,
                    type: 'attribute',
                    field: 'unparsed_field',
                    operator: 'equals',
                    value: statement.trim()
                };
            });

            // Update conditions state
            setConditions(newConditions);
            //console.log("New Conditions:", newConditions);

            // Clear condition groups to avoid conflicts
            setConditionGroups([]);

            toast.success("SQL conditions applied successfully");
            handleCloseSqlDialog();
        } catch (error) {
            console.error("Error parsing SQL:", error);
            setSqlError("Failed to parse SQL query: " + error.message);
        }
    };


    return (
        sqlDialogOpen && (
            <Dialog open={sqlDialogOpen} onOpenChange={handleCloseSqlDialog}>
                <DialogContent className="max-w-2xl w-full">
                    <DialogHeader>
                        <DialogTitle>SQL Query Editor</DialogTitle>
                        <DialogDescription>
                            Edit the SQL query below to modify your segment conditions. Changes will be reflected in the segment builder.
                        </DialogDescription>
                    </DialogHeader>
                    <Textarea
                        className="w-full h-40 font-mono text-sm whitespace-pre-wrap mt-2"
                        value={editableSql}
                        onChange={(e) => handleSqlChange(e.target.value)}
                        placeholder="Enter SQL query here..."
                    />
                    {sqlError && <p className="text-red-500 text-sm mt-2">{sqlError}</p>}
                    <p className="text-xs text-gray-500 mt-1">
                        Note: SQL parsing is limited to simple conditions. Complex queries may not parse correctly.
                    </p>
                    <DialogFooter>
                        <Button variant="ghost" onClick={handleCloseSqlDialog}>
                            Cancel
                        </Button>
                        <Button variant="default" onClick={handleApplySqlChanges}>
                            Apply Changes
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        )
    );
}