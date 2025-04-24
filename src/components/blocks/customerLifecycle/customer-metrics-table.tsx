import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

export function CustomerMetricsTable() {
    return (
        <div className="overflow-auto">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead className="w-[180px]">Lifecycle Stage</TableHead>
                        <TableHead>GMV</TableHead>
                        <TableHead>Orders</TableHead>
                        <TableHead>Unique Customers</TableHead>
                        <TableHead>AOV</TableHead>
                        <TableHead>Avg Bill/User</TableHead>
                        <TableHead>ARPU</TableHead>
                        <TableHead>Orders/Day</TableHead>
                        <TableHead>Orders/Day/Store</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    <TableRow>
                        <TableCell className="font-medium">New Customers</TableCell>
                        <TableCell>$142,846</TableCell>
                        <TableCell>1,642</TableCell>
                        <TableCell>1,642</TableCell>
                        <TableCell>$87.00</TableCell>
                        <TableCell>$87.00</TableCell>
                        <TableCell>$87.00</TableCell>
                        <TableCell>54.7</TableCell>
                        <TableCell>1.8</TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell className="font-medium">Early-life Customers</TableCell>
                        <TableCell>$483,752</TableCell>
                        <TableCell>5,232</TableCell>
                        <TableCell>5,237</TableCell>
                        <TableCell>$92.45</TableCell>
                        <TableCell>$92.37</TableCell>
                        <TableCell>$92.37</TableCell>
                        <TableCell>174.4</TableCell>
                        <TableCell>5.8</TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell className="font-medium">Mature Customers</TableCell>
                        <TableCell>$3,031,245</TableCell>
                        <TableCell>34,910</TableCell>
                        <TableCell>12,468</TableCell>
                        <TableCell>$86.83</TableCell>
                        <TableCell>$243.12</TableCell>
                        <TableCell>$243.12</TableCell>
                        <TableCell>1,163.7</TableCell>
                        <TableCell>38.8</TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell className="font-medium">Loyal Customers</TableCell>
                        <TableCell>$2,130,345</TableCell>
                        <TableCell>25,507</TableCell>
                        <TableCell>5,545</TableCell>
                        <TableCell>$83.52</TableCell>
                        <TableCell>$384.19</TableCell>
                        <TableCell>$384.19</TableCell>
                        <TableCell>850.2</TableCell>
                        <TableCell>28.3</TableCell>
                    </TableRow>
                    <TableRow className="bg-muted/50">
                        <TableCell className="font-medium">Total</TableCell>
                        <TableCell className="font-medium">$5,788,188</TableCell>
                        <TableCell className="font-medium">67,291</TableCell>
                        <TableCell className="font-medium">24,892</TableCell>
                        <TableCell className="font-medium">$86.02</TableCell>
                        <TableCell className="font-medium">$232.53</TableCell>
                        <TableCell className="font-medium">$232.53</TableCell>
                        <TableCell className="font-medium">2,243.0</TableCell>
                        <TableCell className="font-medium">74.8</TableCell>
                    </TableRow>
                </TableBody>
            </Table>
        </div>
    )
}
