import { addMonths, subMonths } from "date-fns";
import { createContext, useContext, useState } from "react";

export type calendarContextType = {
    currentDate: Date,
    handleToday: () => void,
    handlePreviousMonth: () => void,
    handleNextMonth: () => void
}

const defaultValues: calendarContextType = {
    currentDate: new Date,
    handleToday: () => { },
    handlePreviousMonth: () => { },
    handleNextMonth: () => { },
}

export const CalendarContext = createContext<calendarContextType>(defaultValues);

export const CalendarProvider = ({ children }: { children: React.ReactNode }) => {
    const [currentDate, setCurrentDate] = useState<Date>(new Date);
    // Önceki ay
    const handlePreviousMonth = () => {
        setCurrentDate(subMonths(currentDate, 1));
    };

    // Sonraki ay
    const handleNextMonth = () => {
        setCurrentDate(addMonths(currentDate, 1));
    };

    // Bugüne git
    const handleToday = () => {
        setCurrentDate(new Date());
    };

    const value = {
        currentDate,
        handlePreviousMonth,
        handleToday,
        handleNextMonth,
    }
    return (
        <CalendarContext value={value}>
            {children}
        </CalendarContext>
    )
}

export const useCalendar = (): calendarContextType => {
    const context = useContext(CalendarContext);
    if (!context) {
        throw new Error('useTasks must be used within a TaskProvider');
    }
    return context;
};
