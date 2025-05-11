"use client"

import { useContext, useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { RfmTreemap } from "@/components/blocks/RFM/rfm-treemap"
import { RfmSegmentTable } from "@/components/blocks/RFM/rfm-segment-table"
import { Badge } from "@/components/ui/badge"
import { axiosPrivate } from "@/API/axios"
import AuthContext from "@/context/AuthContext"
import { format } from "date-fns"
import { useLifeContext } from "@/context/LifecycleContext"
import DateRangePicker from "@/components/blocks/customerLifecycle/date-range-picker"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Button } from "@/components/ui/button"
import { Download } from "lucide-react"

// orders = value * f
// revenue = value * f * m * 10
// RFM segment data
// const rfmData = [
//   { name: "Champions", value: 7960, percentage: "13%", r: 5, f: 5, m: 5, days: 145, orders: 39800, revenue: 1990000 },
//   { name: "Loyal Customers", value: 8603, percentage: "14%", r: 3, f: 5, m: 5, days: 579, orders: 43015, revenue: 2150750 },
//   { name: "Potential Loyalist", value: 4569, percentage: "7%", r: 5, f: 3, m: 3, days: 399, orders: 13707, revenue: 1233090 },
//   { name: "New Customers", value: 2672, percentage: "4%", r: 5, f: 1, m: 1, days: 279, orders: 2672, revenue: 26720 },
//   { name: "Promising", value: 4546, percentage: "7%", r: 4, f: 1, m: 1, days: 507, orders: 4546, revenue: 45460 },
//   { name: "Need Attention", value: 8741, percentage: "14%", r: 3, f: 2, m: 3, days: 683, orders: 17482, revenue: 524460 },
//   { name: "About to Sleep", value: 480, percentage: "1%", r: 3, f: 1, m: 3, days: 679, orders: 480, revenue: 14400 },
//   { name: "Can't lose them", value: 954, percentage: "2%", r: 2, f: 5, m: 5, days: 826, orders: 4770, revenue: 238500 },
//   { name: "At Risk", value: 4954, percentage: "8%", r: 2, f: 4, m: 3, days: 881, orders: 19816, revenue: 594480 },
//   { name: "Hibernating", value: 19053, percentage: "30%", r: 1, f: 2, m: 1, days: 928, orders: 38106, revenue: 381060 },
// ]
interface segment_stats_interface {
  "segment": string,
  "count": number,
  "percentage": number
}

interface rfm_scores_interface {
  "customer_id": string,
  "business_id": number,
  "recency_value": number,
  "frequency_value": number,
  "monetary_value": number,
  "r_score": number,
  "f_score": number,
  "m_score": number,
  "segment": string,
  "last_updated": string
}

interface RFMInterface {
  "analyzed_customers": number,
  "period": {
    "start_date": string,
    "end_date": string
  },
  "segment_stats": segment_stats_interface[],
  "rfm_scores": rfm_scores_interface[]
}

export default function RFM() {
  const { token } = useContext(AuthContext)
  const [rfmData, setRfmData] = useState<RFMInterface>()
  const { startDate, endDate } = useLifeContext();
  // useEffect(() => {
  //   console.log('rfm: ', rfmData);
  //   console.log('segment stats: ', rfmData?.segment_stats);
  // }, [rfmData])

  const fetchDataRfm = async () => {
    try {
      await axiosPrivate.post('/rfm/analyze-period',
        { start_date: format(startDate, "yyyy-MM-dd"), end_date: format(endDate, "yyyy-MM-dd") },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((res) => {
          setRfmData(res.data?.data);
        })
    } catch (error) {
      console.error(error.message)
    }
  }

  useEffect(() => {
    fetchDataRfm()
  }, [startDate, endDate]);


  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div className="flex flex-col space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">RFM Segments</h1>
          <p className="text-muted-foreground">Customer segmentation based on Recency, Frequency, and Monetary value</p>
        </div>
        <div className="flex items-center gap-4">
          <DateRangePicker />
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline" className="bg-primary" size="icon">
                  <Download className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                Click to sync data
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>

      {rfmData ? <div className="space-y-6">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Customers</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{rfmData?.analyzed_customers}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Champions</CardTitle>
              <Badge className="bg-teal-800 text-secondary-light">
                {rfmData?.segment_stats.find(item => item.segment === "Champions")?.percentage}%
              </Badge>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">
                {rfmData?.segment_stats.find(item => item.segment === "Champions")?.count}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">At Risk</CardTitle>
              <Badge className="bg-red-500 text-secondary-light">
                {rfmData?.segment_stats.find(item => item.segment === "At Risk")?.percentage}%
              </Badge>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">
                {rfmData?.segment_stats.find(item => item.segment === "At Risk")?.count}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Hibernating</CardTitle>
              <Badge className="bg-cyan-600 text-secondary-light">
                {rfmData?.segment_stats.find(item => item.segment === "Hibernating")?.percentage}%
              </Badge>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{rfmData?.segment_stats.find(item => item.segment === "Hibernating")?.count}</div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>RFM Segments</CardTitle>
            <CardDescription>
              RFM stands for Recency, Frequency, and Monetary value, each corresponding to some key customer trait: number
              of days since the last order, total number of orders and Lifetime Value. Customers are bucketed in 5 groups
              on each score to be placed on the map below and each associated with one of ten customer segments.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="treemap" className="space-y-4">
              <TabsList>
                <TabsTrigger value="treemap">Treemap</TabsTrigger>
                <TabsTrigger value="table">Table</TabsTrigger>
              </TabsList>
              <TabsContent value="treemap" className="space-y-4">
                {rfmData?.segment_stats.length > 0 &&
                  <RfmTreemap
                    rfmData={rfmData?.segment_stats}
                  />}
              </TabsContent>
              <TabsContent value="table">
                {rfmData?.rfm_scores.length > 0 && <RfmSegmentTable
                  rfmData={rfmData?.rfm_scores}
                />}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div> : (
        <div className="flex flex-col items-center justify-center py-20 space-y-4">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-card-foreground"></div>
          <p className="text-sm text-muted-foreground">Loading data...</p>
        </div>)}
    </div>
  )
}
