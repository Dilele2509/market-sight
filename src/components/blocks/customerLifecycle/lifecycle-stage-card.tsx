import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ReactNode, useEffect } from "react"

interface LifecycleStageCardProps {
    title: string
    count: any
    metrics: any
    color: string
}

export function LifecycleStageCard({ title, count, metrics, color }: LifecycleStageCardProps) {
    const colorMap = {
        new: "hsl(var(--chart-1))",
        early: "hsl(var(--chart-2))",
        mature: "hsl(var(--chart-3))",
        loyal: "hsl(var(--chart-4))",
    };

    const UPPERCASE_WORDS = ['avg', 'aov', 'arpu'];

    const formatMetricName = (name: string): string => {
        const words = name.split('_');
        const hasPer = words.includes('per');

        const firstWord = words[0];
        const formattedFirstWord = UPPERCASE_WORDS.includes(firstWord)
            ? firstWord.toUpperCase()
            : firstWord.charAt(0).toUpperCase() + firstWord.slice(1);

        const restWords = words.slice(1).map(word => (word === 'per' ? '/' : word));

        const allWords = [formattedFirstWord, ...restWords];

        const displayWords = hasPer ? allWords : allWords.slice(0, 3);

        return displayWords.join(' ');
    };

    // useEffect(()=>{
    //     console.log(metrics);
    // },[])

    return (
        <Card>
            <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                        <div
                            className="h-3 w-3 rounded-full"
                            style={{ backgroundColor: `${colorMap[color]}` }}
                        />
                        <CardTitle className="text-sm font-medium">{title}</CardTitle>
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold mb-4">{count}</div>
                <div className="space-y-2">
                    {Object.entries(metrics).map(([key, value], index) => {
                        const numValue = typeof value === 'number'
                            ? (Number.isInteger(value) ? value : value.toFixed(2))
                            : value;

                        return (
                            <div key={index} className="flex justify-between text-sm">
                                <span className="text-muted-foreground">{formatMetricName(key)}</span>
                                <span className="font-medium">{numValue as ReactNode}</span>
                            </div>
                        );
                    })}
                </div>
            </CardContent>
        </Card>
    )
}
