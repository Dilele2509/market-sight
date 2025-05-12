import { dashboardDataInterface } from '@/pages/Index';
import { useState } from 'react';

interface MonthlyDetailDropdownProps {
    data: dashboardDataInterface[];
    currentData: dashboardDataInterface;
    resetCurrentData: React.Dispatch<React.SetStateAction<dashboardDataInterface>>;
}

export function MonthlyDetailDropdown({ data, currentData, resetCurrentData }: MonthlyDetailDropdownProps) {
    const getMonthYear = (dateString: string) => {
        const date = new Date(dateString);
        return `${date.toLocaleString('en-us', { month: 'long' })} ${date.getFullYear()}`;
    };

    const [selectedMonth, setSelectedMonth] = useState<string>(getMonthYear(currentData.period.end_date));


    const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const selected = event.target.value;
        setSelectedMonth(selected);
    
        const matchedItem = data.find(item =>
            getMonthYear(item.period.end_date) === selected
        );
    
        if (matchedItem) {
            resetCurrentData(matchedItem);
        }
    };    

    return (
        <div className='flex items-center gap-2'>
            <label htmlFor="month-select" className="min-w-fit text-sm font-medium text-gray-700">Select monthly detail:</label>
            <select
                id="month-select"
                value={selectedMonth}
                onChange={handleChange}
                className="block w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            >
                <option value="">Select a Month</option>
                {data.map((item, index) => {
                    const monthYear = getMonthYear(item.period.end_date);
                    return (
                        <option key={index} value={monthYear}>
                            {monthYear}
                        </option>
                    );
                })}
            </select>
        </div>
    );
}
