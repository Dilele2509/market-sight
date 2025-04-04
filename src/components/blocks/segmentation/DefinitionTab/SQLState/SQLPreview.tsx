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
}

interface Dataset {
  name?: string;
  schema?: string;
}

const generateSQLPreview = (
  selectedDataset: any,
  conditions: Condition[],
  attributes: Attribute[],
  rootOperator: string
): string => {
  let tableName = selectedDataset.name.toLowerCase();

  if (selectedDataset?.schema && selectedDataset.schema !== "public") {
    tableName = `${selectedDataset.schema}.${tableName}`;
  }

  let sql = `SELECT * FROM ${tableName}`;
  const conditionClauses: string[] = [];

  conditions.forEach((condition) => {
    if (condition.type === "attribute" && condition.field && condition.operator) {
      let clause = "";
      const attribute = attributes.find((attr) => attr.name === condition.field);
      const attributeType = attribute ? attribute.type : "text";
      const isNumeric = attributeType === "number";

      switch (condition.operator) {
        case "equals":
          clause = isNumeric
            ? `${condition.field} = ${condition.value}`
            : `${condition.field} = '${condition.value}'`;
          break;
        case "not_equals":
          clause = isNumeric
            ? `${condition.field} != ${condition.value}`
            : `${condition.field} != '${condition.value}'`;
          break;
        case "contains":
          clause = `${condition.field} LIKE '%${condition.value}%'`;
          break;
        case "not_contains":
          clause = `${condition.field} NOT LIKE '%${condition.value}%'`;
          break;
        case "starts_with":
          clause = `${condition.field} LIKE '${condition.value}%'`;
          break;
        case "ends_with":
          clause = `${condition.field} LIKE '%${condition.value}'`;
          break;
        case "is_null":
          clause = `${condition.field} IS NULL`;
          break;
        case "is_not_null":
          clause = `${condition.field} IS NOT NULL`;
          break;
        case "greater_than":
          clause = isNumeric
            ? `${condition.field} > ${condition.value}`
            : `${condition.field} > '${condition.value}'`;
          break;
        case "less_than":
          clause = isNumeric
            ? `${condition.field} < ${condition.value}`
            : `${condition.field} < '${condition.value}'`;
          break;
        case "between":
          if (condition.value && condition.value2) {
            clause = isNumeric
              ? `${condition.field} BETWEEN ${condition.value} AND ${condition.value2}`
              : `${condition.field} BETWEEN '${condition.value}' AND '${condition.value2}'`;
          }
          break;
      }

      if (clause) {
        conditionClauses.push(clause);
      }
    }
  });

  if (conditionClauses.length > 0) {
    sql += `\nWHERE ${conditionClauses.join(`\n  ${rootOperator} `)}`;
  } else {
    sql += "\nWHERE 1=1";
  }

  sql += "\nLIMIT 100";
  return sql;
};

export { generateSQLPreview };


const SQLPreview = ({
}) => {
  const {selectedDataset, conditions, attributes, rootOperator} = useSegmentData();

  return (
    <>
      <h5 className="text-lg font-semibold mb-2">SQL Preview</h5>
      <Card className="border border-gray-300 bg-gray-100 p-4 rounded-md font-mono whitespace-pre-wrap">
        {generateSQLPreview(selectedDataset, conditions, attributes, rootOperator)}
      </Card>
    </>
  );
};

export default SQLPreview;
