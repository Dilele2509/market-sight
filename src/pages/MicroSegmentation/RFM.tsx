"use client"

import { useContext, useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { RfmTreemap } from "@/components/blocks/RFM/rfm-treemap"
import { RfmSegmentTable } from "@/components/blocks/RFM/rfm-segment-table"
import { Badge } from "@/components/ui/badge"
import { axiosPrivate } from "@/API/axios"
import AuthContext from "@/context/AuthContext"

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


export default function RFM() {
  const [activeTab, setActiveTab] = useState("overview")
  const { token } = useContext(AuthContext)
  const [rfmData, setRfmData] = useState([])
  useEffect(() => {
    console.log('rfm: ', rfmData);
  }, [rfmData])
  useEffect(() => {
    axiosPrivate('/rfm/rfm-statistic', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        const rawData = res.data?.data || [];

        const formattedData = rawData.map((item) => ({
          name: item.segment,
          value: item.customer_count,
          percentage: item.percentage + '%',
          r: item.r_score,
          f: item.f_score,
          m: item.m_score,
          days: item.recency_value,
          orders: item.frequency_value,
          revenue: item.total_monetary,
        }));

        console.log('formattedData', formattedData);

        setRfmData(formattedData);
      })
      .catch((err) => {
        console.error('RFM fetch error:', err);
      });
  }, []);


  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">RFM Segments</h1>
        <p className="text-muted-foreground">Customer segmentation based on Recency, Frequency, and Monetary value</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Customers</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">62,532</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Champions</CardTitle>
            <Badge className="bg-teal-500">13%</Badge>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">7,960</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">At Risk</CardTitle>
            <Badge className="bg-pink-400">8%</Badge>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">4,954</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Hibernating</CardTitle>
            <Badge className="bg-indigo-400">30%</Badge>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">19,053</div>
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
              {rfmData.length > 0 && <RfmTreemap
                rfmData={rfmData}
              />}
            </TabsContent>
            <TabsContent value="table">
              {rfmData.length>0 && <RfmSegmentTable
                rfmData={rfmData}
              />}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
