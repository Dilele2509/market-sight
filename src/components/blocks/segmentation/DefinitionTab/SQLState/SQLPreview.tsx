import { Card } from "@/components/ui/card";
import { useSegmentData } from "@/context/SegmentDataContext";

interface Attribute {
  name: string;
  type: string;
}

interface Condition {
  type: string;
  field: string;
  operator: string;
  value?: string;
  value2?: string;

  // Event-specific fields
  eventType?: string;
  eventName?: string;
  frequency?: string;
  count?: number;
  timePeriod?: string;
  timeValue?: number;
}

interface ConditionGroup {
  id: number;
  type: "group";
  operator: "AND" | "OR";
  conditions: (Condition | ConditionGroup)[];
}

// const generateSQLPreview = (
//   selectedDataset: any,
//   conditions: Condition[],
//   attributes: Attribute[],
//   rootOperator: string
// ): string => {
//   let tableName = selectedDataset.name.toLowerCase();

//   if (selectedDataset?.schema && selectedDataset.schema !== "public") {
//     tableName = `${selectedDataset.schema}.${tableName}`;
//   }

//   let sql = `SELECT * FROM ${tableName}`;
//   const conditionClauses: string[] = [];

//   conditions.forEach((condition) => {
//     if (condition.type === "attribute" && condition.field && condition.operator) {
//       let clause = "";
//       const attribute = attributes.find((attr) => attr.name === condition.field);
//       const attributeType = attribute ? attribute.type : "text";
//       const isNumeric = attributeType === "number";

//       switch (condition.operator) {
//         case "equals":
//           clause = isNumeric
//             ? `${condition.field} = ${condition.value}`
//             : `${condition.field} = '${condition.value}'`;
//           break;
//         case "not_equals":
//           clause = isNumeric
//             ? `${condition.field} != ${condition.value}`
//             : `${condition.field} != '${condition.value}'`;
//           break;
//         case "contains":
//           clause = `${condition.field} LIKE '%${condition.value}%'`;
//           break;
//         case "not_contains":
//           clause = `${condition.field} NOT LIKE '%${condition.value}%'`;
//           break;
//         case "starts_with":
//           clause = `${condition.field} LIKE '${condition.value}%'`;
//           break;
//         case "ends_with":
//           clause = `${condition.field} LIKE '%${condition.value}'`;
//           break;
//         case "is_null":
//           clause = `${condition.field} IS NULL`;
//           break;
//         case "is_not_null":
//           clause = `${condition.field} IS NOT NULL`;
//           break;
//         case "greater_than":
//           clause = isNumeric
//             ? `${condition.field} > ${condition.value}`
//             : `${condition.field} > '${condition.value}'`;
//           break;
//         case "less_than":
//           clause = isNumeric
//             ? `${condition.field} < ${condition.value}`
//             : `${condition.field} < '${condition.value}'`;
//           break;
//         case "between":
//           if (condition.value && condition.value2) {
//             clause = isNumeric
//               ? `${condition.field} BETWEEN ${condition.value} AND ${condition.value2}`
//               : `${condition.field} BETWEEN '${condition.value}' AND '${condition.value2}'`;
//           }
//           break;
//       }

//       if (clause) {
//         conditionClauses.push(clause);
//       }
//     }
//   });

//   if (conditionClauses.length > 0) {
//     sql += `\nWHERE ${conditionClauses.join(`\n  ${rootOperator} `)}`;
//   } else {
//     sql += "\nWHERE 1=1";
//   }

//   sql += "\nLIMIT 100";
//   return sql;
// };
const generateSQLPreview = (
  selectedDataset: any,
  conditions: Condition[],
  conditionGroups: any[],
  attributes: Attribute[],
  rootOperator: string
): string => {
  let tableName = selectedDataset.name.toLowerCase();
  if (selectedDataset?.schema && selectedDataset.schema !== "public") {
    tableName = `${selectedDataset.schema}.${tableName}`;
  }

  const getClause = (condition: Condition): string | null => {
    const attr = attributes.find((a) => a.name === condition.field);
    const type = attr?.type || "text";
    const isNumeric = type === "number";

    switch (condition.operator) {
      case "equals":
        return `${condition.field} = ${isNumeric ? condition.value : `'${condition.value}'`}`;
      case "not_equals":
        return `${condition.field} != ${isNumeric ? condition.value : `'${condition.value}'`}`;
      case "contains":
        return `${condition.field} LIKE '%${condition.value}%'`;
      case "not_contains":
        return `${condition.field} NOT LIKE '%${condition.value}%'`;
      case "starts_with":
        return `${condition.field} LIKE '${condition.value}%'`;
      case "ends_with":
        return `${condition.field} LIKE '%${condition.value}'`;
      case "is_null":
        return `${condition.field} IS NULL`;
      case "is_not_null":
        return `${condition.field} IS NOT NULL`;
      case "greater_than":
        return `${condition.field} > ${isNumeric ? condition.value : `'${condition.value}'`}`;
      case "less_than":
        return `${condition.field} < ${isNumeric ? condition.value : `'${condition.value}'`}`;
      case "between":
        return condition.value && condition.value2
          ? `${condition.field} BETWEEN ${isNumeric ? condition.value : `'${condition.value}'`} AND ${isNumeric ? condition.value2 : `'${condition.value2}'`}`
          : null;
      default:
        return null;
    }
  };

  const buildClauses = (nodes: any[], operator: string): string => {
    const parts = nodes.map((node) => {
      if (node.type === "group") {
        return buildClauses(node.conditions, node.operator);
      } else {
        const clause = getClause(node);
        return clause ? `(${clause})` : null;
      }
    }).filter(Boolean);

    return parts.length > 1 ? `(${parts.join(` ${operator} `)})` : parts[0] || '';
  };

  // Gộp conditions và groups thành một array chung để xử lý đệ quy
  const combinedNodes = [
    ...conditions,
    ...conditionGroups.map((group) => ({ ...group, type: "group" })),
  ];

  const whereClause = buildClauses(combinedNodes, rootOperator);

  return [
    `SELECT * FROM ${tableName}`,
    whereClause ? `WHERE ${whereClause}` : "WHERE 1=1",
    `LIMIT 100`,
  ].join("\n");
};

export { generateSQLPreview };


const SQLPreview = ({
}) => {
  const { selectedDataset, conditions, attributes, rootOperator, conditionGroups } = useSegmentData();

  return (
    <>
      <h5 className="text-lg font-semibold mb-2">SQL Preview</h5>
      <Card className="border border-gray-300 bg-gray-100 p-4 rounded-md font-mono whitespace-pre-wrap">
        {generateSQLPreview(selectedDataset, conditions, conditionGroups, attributes, rootOperator)}
      </Card>
    </>
  );
};

export default SQLPreview;
