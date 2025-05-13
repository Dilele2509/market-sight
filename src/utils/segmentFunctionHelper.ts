type Condition = {
    type: "attribute" | "event" | "group";
    field?: string;
    operator?: string;
    value?: any;
    value2?: any;
    columnKey?: string;
    relatedColKey?: string;
    relatedDataset?: string;
    joinWithKey?: string;
    relatedConditions?: any[];
    relatedAttributeConditions?: relatedConditions[];
};

type RelatedAttributeCondition = {
    id: number,
    field: string,
    operator: string,
    value: string,
    value2: string
}

type relatedConditions = {
    id: number,
    type: string,
    relatedDataset: string,
    joinWithKey: string
    fields: any
    operator: 'AND' | 'OR'
    relatedAttributeConditions: RelatedAttributeCondition[]
}

type GroupCondition = {
    type: "group";
    operator: "AND" | "OR";
    conditions: Condition[];
};

type Attribute = {
    name: string;
    type: string;
};

function getClause(tableName: string, condition: any): string {
    const { field, operator, value, value2 } = condition;

    switch (operator) {
        case "equals":
            return `${tableName}.${field} = '${value}'`;
        case "not_equals":
            return `${tableName}.${field} != '${value}'`;
        case "greater_than":
            return `${tableName}.${field} > ${value}`;
        case "less_than":
            return `${tableName}.${field} < ${value}`;
        case "is_null":
            return `${tableName}.${field} IS NULL`;
        case "is_not_null":
            return `${tableName}.${field} IS NOT NULL`;
        case "contains":
            return `${tableName}.${field} LIKE '%${value}%'`;
        case "starts_with":
            return `${tableName}.${field} LIKE '${value}%'`;
        case "ends_with":
            return `${tableName}.${field} LIKE '%${value}'`;
        case "between":
            return `${tableName}.${field} BETWEEN ${value} AND ${value2}`;
        default:
            return "";
    }
}

function getClauseEvent(parentTable: string, eventCondition: any): string {
    const {
        relatedColKey,
        columnKey,
        count,
        frequency,
        timeValue,
        timePeriod,
        relatedConditions,
        attributeConditions,
        eventType,
    } = eventCondition;

    const baseTable = "transactions";
    const whereClauses: string[] = [`${baseTable}.${columnKey} = ${parentTable}.${relatedColKey}`];

    // Time condition
    if (timeValue && timePeriod) {
        const timeColumn = `${baseTable}.transaction_date`;
        const unit = timePeriod.toLowerCase(); // 'days', 'hours', etc.
        whereClauses.push(`${timeColumn} >= NOW() - INTERVAL '${timeValue} ${unit}'`);
    }

    if (attributeConditions && attributeConditions.length > 0) {
        for (const attr of attributeConditions) {
            whereClauses.push(getClause(baseTable, attr));
        }
    }

    const joins: string[] = [];
    const relatedWhere: string[] = [];

    for (const rel of relatedConditions || []) {
        const relTable = rel.relatedDataset;
        const joinKey = rel.joinWithKey;
        joins.push(`INNER JOIN ${relTable} ON ${baseTable}.${joinKey} = ${relTable}.${joinKey}`);

        for (const attr of rel.relatedAttributeConditions || []) {
            relatedWhere.push(getClause(relTable, attr));
        }
    }

    const allWhere = [...whereClauses, ...relatedWhere].map(w => `(${w})`).join(" AND ");
    const joinSQL = joins.join(" ");

    if (eventType === "performed") {
        let countCondition = "";
        switch (frequency) {
            case "at_least":
                countCondition = `HAVING COUNT(*) >= ${count}`;
                break;
            case "exactly":
                countCondition = `HAVING COUNT(*) = ${count}`;
                break;
            case "at_most":
                countCondition = `HAVING COUNT(*) <= ${count}`;
                break;
        }

        return `
EXISTS (
  SELECT 1
  FROM ${baseTable}
  ${joinSQL}
  WHERE ${allWhere}
  GROUP BY ${baseTable}.${columnKey}
  ${countCondition}
)`.trim();
    }

    if (eventType === "not_performed") {
        return `
NOT EXISTS (
  SELECT 1
  FROM ${baseTable}
  ${joinSQL}
  WHERE ${allWhere}
)`.trim();
    }

    if (eventType === "first_time" || eventType === "last_time") {
        const timeAgg = eventType === "first_time" ? "MIN" : "MAX";

        return `
EXISTS (
  SELECT 1
  FROM ${baseTable}
  ${joinSQL}
  WHERE ${allWhere}
  GROUP BY ${baseTable}.${columnKey}
  HAVING ${timeAgg}(${baseTable}.transaction_date) >= NOW() - INTERVAL '${timeValue} ${timePeriod.toLowerCase()}'
)`.trim();
    }

    return ""; // fallback
}

function buildClauses(conditions: (string | null)[], operator: string): string {
    const valid = conditions.filter(Boolean);
    if (!valid.length) return "";
    return valid.map((c) => `(${c})`).join(` ${operator} `);
}

function buildGroupClause(group: GroupCondition, tableName: string): string {
    const clauses = group.conditions.map((cond) => {
        if (cond.type === "group") {
            return buildGroupClause(cond as GroupCondition, tableName);
        } else if (cond.type === "attribute") {
            return getClause(tableName, cond);
        } else if (cond.type === "event") {
            return getClauseEvent(tableName, cond);
        }
        return null;
    });

    return buildClauses(clauses, group.operator);
}

function generateSQLPreview(
    selectedDataset: any,
    conditions: Condition[],
    conditionGroups: GroupCondition[],
    attributes: Attribute[],
    rootOperator: string
): string {
    const tableName = selectedDataset.name;
    const whereClauses: string[] = [];

    for (const condition of conditions) {
        if (condition.type === "attribute") {
            whereClauses.push(getClause(tableName, condition));
        } else if (condition.type === "event") {
            // tao bỏ JOIN
            whereClauses.push(getClauseEvent(tableName, condition));
        }
    }

    for (const group of conditionGroups) {
        const groupClause = buildGroupClause(group, tableName);
        if (groupClause) {
            whereClauses.push(groupClause);
        }
    }

    const whereClause = buildClauses(whereClauses, rootOperator) || "1=1";

    return `
SELECT *
FROM ${tableName}
WHERE ${whereClause};
    `.trim();
}


const highlightSQLWithTailwind = (sql: string): string => {
    const keywords = [
        "SELECT", "FROM", "WHERE", "INNER JOIN", "RIGHT JOIN", "INNER JOIN", "OUTER JOIN", "GROUP BY",
        "HAVING", "ORDER BY", "NOT EXISTS", "EXISTS", "AND", "OR", "ON", "AS", "IN", "BETWEEN"
    ];

    let highlighted = sql;
    for (const keyword of keywords) {
        const regex = new RegExp(`\\b${keyword}\\b`, "gi");
        highlighted = highlighted.replace(
            regex,
            match => `<span class="text-blue-500 font-semibold">${match.toUpperCase()}</span>`
        );
    }

    return highlighted;
}

export { generateSQLPreview, highlightSQLWithTailwind };

export const defineDatasetName = (value: string) => {
    switch (value.toLowerCase()) {
        case 'customers':
            return 'Customer Profile';
        case 'transactions':
            return 'Transactions';
        case 'stores':
            return 'Stores';
        case 'product_lines':
            return 'Product Line';
        default:
            return 'Customer Profile';
    }
};
