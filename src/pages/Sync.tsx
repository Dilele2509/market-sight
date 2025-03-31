
import { DashboardShell } from "@/components/layout/DashboardShell";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Database, FileSpreadsheet, Box, ArrowRight } from "lucide-react";

const sources = [
  {
    title: "Database",
    description: "Connect directly to your database",
    icon: Database,
    sources: ["PostgreSQL", "MySQL", "MongoDB", "Snowflake"],
  },
  {
    title: "Spreadsheets",
    description: "Import data from spreadsheet files",
    icon: FileSpreadsheet,
    sources: ["Google Sheets", "Excel", "CSV"],
  },
  {
    title: "Other Sources",
    description: "Connect to other data sources",
    icon: Box,
    sources: ["Shopify", "WooCommerce", "Custom API"],
  },
];

export default function ImportData() {
  return (
    <DashboardShell>
      <div className="flex flex-col gap-6">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Data Sources</h1>
          <p className="text-muted-foreground">
            Connect and sync your data from various sources to power your analytics
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {sources.map((source) => (
            <Card key={source.title} className="relative group hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-center gap-2 mb-2">
                  <source.icon className="w-5 h-5 text-primary" />
                  <CardTitle className="text-lg">{source.title}</CardTitle>
                </div>
                <CardDescription>{source.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {source.sources.map((item) => (
                    <Button
                      key={item}
                      variant="outline"
                      className="w-full justify-between group/btn hover:border-primary"
                    >
                      {item}
                      <ArrowRight className="w-4 h-4 opacity-0 group-hover/btn:opacity-100 transition-opacity" />
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Sync History</CardTitle>
            <CardDescription>View your recent data synchronization activities</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-sm text-muted-foreground text-center py-8">
              No sync history available. Connect a data source to get started.
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardShell>
  );
}
