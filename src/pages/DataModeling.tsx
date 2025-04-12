
import { DashboardShell } from "@/components/layout/DashboardShell";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useState, useEffect, useContext } from "react";
import { axiosPrivate } from "@/API/axios";
import AuthContext from "@/context/AuthContext";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import CodeMirror from '@uiw/react-codemirror';
import { sql } from '@codemirror/lang-sql';
import { useSegmentData } from "@/context/SegmentDataContext";
import { useSegmentToggle } from "@/context/SegmentToggleContext";
import { formatCellValue } from "@/components/blocks/segmentation/DefinitionTab/InforSetupState/PreviewDialog";


export default function DataModeling() {
  const { token } = useContext(AuthContext)
  const [tables, setTables] = useState<any>({});
  const [selectedTable, setSelectedTable] = useState<any>({});
  const [query, setQuery] = useState('');
  const [results, setResults] = useState(null);

  const { CONNECTION_EXPIRY_KEY, CONNECTION_STORAGE_KEY, setError } = useSegmentData();
  const { setLoading, loading } = useSegmentToggle();

  const generateSchemaPattern = (tableName: string) => {
    return tableName ? `SELECT * FROM ${tableName} LIMIT 5;` : '';
  };

  useEffect(() => {
    axiosPrivate.get('/data/tables', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then((response) => {
        //console.log(response.data.data);
        if (response.status === 200) {
          toast.success(response.data.message)
          setTables(response.data.data)
          const firstTableName = Object.keys(response.data.data)[0];
          setSelectedTable({
            table: firstTableName,
            fields: response.data.data[firstTableName]
          });
          setQuery(generateSchemaPattern(firstTableName));
        } else {
          toast.error(response.data.message)
        }
      })
      .catch((error) => {
        console.error(error)
        toast.error(error)
      })
  }, [])

  const handleExecuteQuery = async () => {
    if (!selectedTable || !query) {
      toast.error('Please select a table and enter a query');
      return;
    }

    if (!CONNECTION_EXPIRY_KEY) {
      toast.error('Please provide all database connection details');
      return;
    }

    const connectionUrl = localStorage.getItem(CONNECTION_STORAGE_KEY);
    if (!connectionUrl) {
      toast.error('No database connection found');
      return;
    }

    const url = new URL(connectionUrl);
    const username = url.username;
    const password = url.password;
    const host = url.hostname;
    const port = url.port;
    const database = url.pathname.replace('/', '');

    setLoading(true);
    setError(null);

    try {
      const requestData = {
        table: selectedTable.table,
        query,
        connection_details: {
          host,
          port,
          database,
          username,
          password
        }
      };
      //console.log('Sending request data:', requestData);


      const response = await axiosPrivate.post(`/data/query`, requestData, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (response.data.success) {
        setResults({
          data: response.data.data,
          columns: response.data.columns,
          row_count: response.data.row_count
        });

        if (response.data.inserted_count > 0) {
          toast.success(
            `Query executed successfully! Retrieved ${response.data.row_count} rows and inserted ${response.data.inserted_count} rows into data warehouse.`
          );
        } else {
          toast.warning(
            `Query executed successfully! Retrieved ${response.data.row_count} rows but could not insert into data warehouse.`
          );
        }
      } else {
        setError('Query executed but returned no results');
        toast.warning('Query returned no results');
      }
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to execute query';
      setError(errorMessage);
      toast.error(`Query error: ${errorMessage}`);
      console.error('Query execution failed:', err);
    } finally {
      setLoading(false);
    }
  };

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
                <Select
                  defaultValue={tables && selectedTable > 0 ? selectedTable : ''}
                  onValueChange={(value) => {
                    const table = tables[value];
                    if (table) {
                      setSelectedTable({
                        table: value,
                        fields: table
                      });
                      setQuery(generateSchemaPattern(value));
                    }
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={tables && Object.keys(tables).length > 0 ? Object.keys(tables)[0] : ''} />
                  </SelectTrigger>
                  <SelectContent className="bg-card border-[0.5px] border-card-foreground shadow-lg rounded-md z-50">
                    {tables && Object.entries(tables).map(([tableName]) => (
                      <SelectItem
                        className="hover:bg-background hover:rounded-md cursor-pointer"
                        key={tableName}
                        value={tableName}
                      >
                        {tableName}
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
                            <TableHead>Datatype</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {selectedTable && selectedTable.fields
                            ? Object.entries(selectedTable.fields).map(([fieldName, fieldType]) => (
                              <TableRow key={fieldName}>
                                <TableCell>{String(fieldName)}</TableCell>
                                <TableCell>
                                  <Badge className="w-fit pl-3 pr-3 bg-primary text-secondary-light rounded-xl">
                                    {String(fieldType)}
                                  </Badge>
                                </TableCell>
                              </TableRow>
                            ))
                            : (
                              <TableRow>
                                <TableCell colSpan={2}>No available fields</TableCell>
                              </TableRow>
                            )
                          }
                        </TableBody>
                      </Table>
                    </ScrollArea>
                  </Card>
                </TabsContent>

                <TabsContent className="space-y-4" value="code">
                  <Card className="bg-muted">
                    <ScrollArea className="h-[400px]">
                      <div className="p-4">
                        <div className="rounded-lg overflow-hidden border border-border focus-within:ring-0 focus-within:ring-transparent">
                          <CodeMirror
                            value={query}
                            height="300px"
                            extensions={[sql()]}
                            theme="dark"
                            onChange={(value) => setQuery(value)}
                          />
                        </div>
                        <div className="mt-4 flex justify-end">
                          <Button onClick={handleExecuteQuery} disabled={loading}>
                            {loading ? (
                              <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Executing...
                              </>
                            ) : (
                              'Execute Query'
                            )}
                          </Button>
                        </div>
                      </div>
                    </ScrollArea>

                  </Card>
                  {selectedTable && (
                    <div className="p-4 mb-4 border rounded-md bg-muted">
                      <h2 className="text-lg font-semibold mb-1">
                        Table Schema: {selectedTable.table}
                      </h2>
                      <p className="text-sm text-muted-foreground mb-2">Available fields:</p>
                      <div className="flex flex-wrap gap-2">
                        {selectedTable?.fields &&
                          Object.keys(selectedTable.fields).map((field: string) => (
                            <span
                              key={field}
                              className="border border-border rounded-full px-3 py-1 text-sm"
                            >
                              {field}
                            </span>
                          ))}
                      </div>
                    </div>
                  )}

                  {results?.data && (
                    <div className="mt-4 border rounded-md overflow-hidden">
                      <div className="max-h-[440px] overflow-auto">
                        <Table className="w-full text-sm">
                          <TableHeader className="bg-muted">
                            <TableRow>
                              {results.columns.map((column: string) => (
                                <TableHead key={column} className="font-semibold px-4 py-2 text-left">
                                  {column}
                                </TableHead>
                              ))}
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {results.data.map((row: any, rowIndex: number) => (
                              <TableRow key={rowIndex} className="hover:bg-muted/50">
                                {results.columns.map((column: string) => (
                                  <TableCell key={`${rowIndex}-${column}`} className="px-4 py-2">
                                    {formatCellValue(row[column])}
                                  </TableCell>
                                ))}
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                      <div className="border-t px-4 py-2 text-sm text-muted-foreground">
                        Total rows: {results.row_count}
                      </div>
                    </div>
                  )}
                </TabsContent>
              </div>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </DashboardShell>
  );
}
