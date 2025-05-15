import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useSegmentData } from "@/context/SegmentDataContext";
import { useSegmentToggle } from "@/context/SegmentToggleContext";
import { convertSQLToSegment } from "@/utils/segmentFunctionConvert";

export default function SQLDialog() {
    const { setSqlError, setEditableSql, editableSql, setRootOperator, setConditions, setConditionGroups, sqlError } = useSegmentData();
    const { setSqlDialogOpen, sqlDialogOpen } = useSegmentToggle();

    // Function to close SQL dialog
    const handleCloseSqlDialog = () => {
        setSqlDialogOpen(false);
    };

    // Function to handle SQL changes
    const handleSqlChange = (value) => {
        //console.log(value);
        setEditableSql(value);
        setSqlError(null);
    };

    const handleApplySqlChanges = () => {
        // try {
        //     const sqlQuery = editableSql.trim();

        //     const whereMatch = sqlQuery.match(/WHERE\s+(.*?)(?:\s+LIMIT|\s*$)/is);
        //     if (!whereMatch || !whereMatch[1]) {
        //         setSqlError("Could not find valid WHERE clause in SQL query");
        //         return;
        //     }

        //     const whereClause = whereMatch[1].trim();

        //     if (whereClause === '1=1') {
        //         toast.info("No conditions to parse in SQL query");
        //         handleCloseSqlDialog();
        //         return;
        //     }

        //     let idCounter = 1;

        //     const tokenize = (input: string): string[] => {
        //         const tokens: string[] = [];
        //         const regex = /\s*(AND|OR|\(|\)|[^()\s]+(?:\s+[^()\s]+)*)\s*/gi;
        //         let match;
        //         while ((match = regex.exec(input)) !== null) {
        //             tokens.push(match[1]);
        //         }
        //         return tokens;
        //     };

        //     const parseCondition = (tokens: string[]): any => {
        //         const stack: any[] = [];

        //         const parseGroup = (): any => {
        //             const group: any = {
        //                 id: idCounter++,
        //                 type: "group",
        //                 operator: "AND",
        //                 conditions: []
        //             };

        //             while (tokens.length > 0) {
        //                 const token = tokens.shift();

        //                 if (!token) continue;

        //                 if (token === '(') {
        //                     group.conditions.push(parseGroup());
        //                 } else if (token === ')') {
        //                     return group;
        //                 } else if (token.toUpperCase() === 'AND' || token.toUpperCase() === 'OR') {
        //                     group.operator = token.toUpperCase();
        //                 } else {
        //                     // Parse single condition
        //                     const statement = token.trim();

        //                     const condition: any = { id: idCounter++, type: 'attribute' };

        //                     if (/IS\s+NULL/i.test(statement)) {
        //                         const m = statement.match(/(\w+)\s+IS\s+NULL/i);
        //                         if (m) {
        //                             condition.field = m[1];
        //                             condition.operator = 'is_null';
        //                             condition.value = null;
        //                             condition.value2 = null;
        //                         }
        //                     } else if (/IS\s+NOT\s+NULL/i.test(statement)) {
        //                         const m = statement.match(/(\w+)\s+IS\s+NOT\s+NULL/i);
        //                         if (m) {
        //                             condition.field = m[1];
        //                             condition.operator = 'is_not_null';
        //                             condition.value = null;
        //                         }
        //                     } else if (/NOT\s+LIKE/i.test(statement)) {
        //                         const m = statement.match(/(\w+)\s+NOT\s+LIKE\s+['"](.*?)['"]/i);
        //                         if (m) {
        //                             condition.field = m[1];
        //                             condition.operator = 'not_contains';
        //                             condition.value = m[2].replace(/%/g, '');
        //                         }
        //                     } else if (/LIKE/i.test(statement)) {
        //                         const m = statement.match(/(\w+)\s+LIKE\s+['"](.*?)['"]/i);
        //                         if (m) {
        //                             condition.field = m[1];
        //                             const pattern = m[2];
        //                             if (pattern.startsWith('%') && pattern.endsWith('%')) {
        //                                 condition.operator = 'contains';
        //                                 condition.value = pattern.slice(1, -1);
        //                             } else if (pattern.startsWith('%')) {
        //                                 condition.operator = 'ends_with';
        //                                 condition.value = pattern.slice(1);
        //                             } else if (pattern.endsWith('%')) {
        //                                 condition.operator = 'starts_with';
        //                                 condition.value = pattern.slice(0, -1);
        //                             }
        //                         }
        //                     } else if (/BETWEEN/i.test(statement)) {
        //                         const m = statement.match(/(\w+)\s+BETWEEN\s+['"]?(.*?)['"]?\s+AND\s+['"]?(.*?)['"]?/i);
        //                         if (m) {
        //                             condition.field = m[1];
        //                             condition.operator = 'between';
        //                             condition.value = m[2];
        //                             condition.value2 = m[3];
        //                         }
        //                     } else if (/!=/.test(statement)) {
        //                         const m = statement.match(/(\w+)\s*!=\s*['"]?(.*?)['"]?$/i);
        //                         if (m) {
        //                             condition.field = m[1];
        //                             condition.operator = 'not_equals';
        //                             condition.value = m[2];
        //                         }
        //                     } else if (/=/.test(statement)) {
        //                         const m = statement.match(/(\w+)\s*=\s*['"]?(.*?)['"]?$/i);
        //                         if (m) {
        //                             condition.field = m[1];
        //                             condition.operator = 'equals';
        //                             condition.value = m[2];
        //                         }
        //                     } else if (/>/.test(statement)) {
        //                         const m = statement.match(/(\w+)\s*>\s*['"]?(.*?)['"]?$/i);
        //                         if (m) {
        //                             condition.field = m[1];
        //                             condition.operator = 'greater_than';
        //                             condition.value = m[2];
        //                         }
        //                     } else if (/<\s*/.test(statement)) {
        //                         const m = statement.match(/(\w+)\s*<\s*['"]?(.*?)['"]?$/i);
        //                         if (m) {
        //                             condition.field = m[1];
        //                             condition.operator = 'less_than';
        //                             condition.value = m[2];
        //                         }
        //                     } else {
        //                         condition.field = 'unparsed';
        //                         condition.operator = 'equals';
        //                         condition.value = statement;
        //                     }

        //                     group.conditions.push(condition);
        //                 }
        //             }

        //             return group;
        //         };

        //         return parseGroup();
        //     };

        //     const tokens = tokenize(whereClause);
        //     const parsedRoot = parseCondition(tokens);

        //     if (parsedRoot.type === 'group') {
        //         setRootOperator(parsedRoot.operator);
        //         setConditions(parsedRoot.conditions);
        //         setConditionGroups([parsedRoot]);
        //     } else {
        //         setRootOperator('AND');
        //         setConditions([parsedRoot]);
        //         setConditionGroups([]);
        //     }

        //     toast.success("SQL conditions applied successfully");
        //     handleCloseSqlDialog();
        // } catch (error: any) {
        //     console.error("Error parsing SQL:", error);
        //     setSqlError("Failed to parse SQL query: " + error.message);
        // }
        const sqlQuery = editableSql.trim();
        try {
            console.log(convertSQLToSegment(sqlQuery))
            setConditions(convertSQLToSegment(sqlQuery).conditions)
            setConditionGroups(convertSQLToSegment(sqlQuery).groupConditions)
            setRootOperator(convertSQLToSegment(sqlQuery).rootOperator)
        } catch (error) {
            console.log(error);
        } finally {
            handleCloseSqlDialog()
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