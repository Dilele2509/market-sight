
import { DashboardShell } from "@/components/layout/DashboardShell";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useState } from "react";

// Mock data - replace with actual data from your backend
const tables = [
  {
    name: "customers",
    schema: `
type Customer {
  id: UUID
  firstName: String
  lastName: String
  email: String
  lastPurchaseDate: DateTime
  totalOrders: Int
  totalSpent: Decimal
  createdAt: DateTime
}`,
    fields: [
      { name: "id", type: "UUID", description: "Unique identifier" },
      { name: "firstName", type: "String", description: "Customer's first name" },
      { name: "lastName", type: "String", description: "Customer's last name" },
      { name: "email", type: "String", description: "Email address" },
      { name: "lastPurchaseDate", type: "DateTime", description: "Date of last purchase" },
      { name: "totalOrders", type: "Int", description: "Total number of orders" },
      { name: "totalSpent", type: "Decimal", description: "Total amount spent" },
      { name: "createdAt", type: "DateTime", description: "Account creation date" },
    ]
  },
  {
    name: "orders",
    schema: `
type Order {
  id: UUID
  customerId: UUID
  orderDate: DateTime
  totalAmount: Decimal
  status: String
  items: OrderItem[]
}`,
    fields: [
      { name: "id", type: "UUID", description: "Unique identifier" },
      { name: "customerId", type: "UUID", description: "Reference to customer" },
      { name: "orderDate", type: "DateTime", description: "Date of order" },
      { name: "totalAmount", type: "Decimal", description: "Total order amount" },
      { name: "status", type: "String", description: "Order status" },
    ]
  }
];

export default function DataModeling() {
  const [selectedTable, setSelectedTable] = useState(tables[0]);
  return (
    <DashboardShell>
      <div className="flex flex-col gap-6">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Data Modeling</h1>
          <p className="text-muted-foreground">
            Manage and explore your data schema for segmentation
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Schema Explorer</CardTitle>
            <CardDescription>
              View and analyze your data structure
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="visual" className="w-full">
              <TabsList>
                <TabsTrigger value="visual">Visual Schema</TabsTrigger>
                <TabsTrigger value="code">Code View</TabsTrigger>
              </TabsList>

              <div className="mt-4 space-y-4">
                <Select onValueChange={(value) => {
                  const table = tables.find(t => t.name === value);
                  if (table) setSelectedTable(table);
                }}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a table" />
                  </SelectTrigger>
                  <SelectContent className="bg-card border-[0.5px] border-card-foreground shadow-lg rounded-md z-50">
                    {tables.map((table) => (
                      <SelectItem className="hover:bg-background hover:rounded-md cursor-pointer" key={table.name} value={table.name}>
                        {table.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <TabsContent value="visual" className="mt-4">
                  <Card>
                    <ScrollArea className="h-[400px]">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Field Name</TableHead>
                            <TableHead>Type</TableHead>
                            <TableHead>Description</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {selectedTable.fields.map((field) => (
                            <TableRow key={field.name}>
                              <TableCell className="font-medium">{field.name}</TableCell>
                              <TableCell>
                                <Badge className="text-black" variant="secondary">{field.type}</Badge>
                              </TableCell>
                              <TableCell className="text-muted-foreground">
                                {field.description}
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </ScrollArea>
                  </Card>
                </TabsContent>

                <TabsContent value="code">
                  <Card className="bg-muted">
                    <ScrollArea className="h-[400px]">
                      <pre className="p-4 text-sm">
                        {selectedTable.schema}
                      </pre>
                    </ScrollArea>
                  </Card>
                </TabsContent>
              </div>
            </Tabs>
          </CardContent>
        </Card>

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Data Quality</CardTitle>
              <CardDescription>
                Overview of your data quality metrics
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span>Completeness</span>
                  <Badge variant="outline">98%</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span>Consistency</span>
                  <Badge variant="outline">95%</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span>Validity</span>
                  <Badge variant="outline">99%</Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Relationships</CardTitle>
              <CardDescription>
                Table relationships and dependencies
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {tables.map((table) => (
                  <div key={table.name} className="flex items-center gap-2">
                    <Badge>{table.name}</Badge>
                    <span className="text-muted-foreground">→</span>
                    <span className="text-sm">
                      {table.fields.filter(f => f.type === "UUID" && f.name !== "id")
                        .map(f => f.name.replace("Id", ""))
                        .join(", ")}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardShell>
  );
}
