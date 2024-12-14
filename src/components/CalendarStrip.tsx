import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { format, addDays, subDays, isSameDay, startOfDay } from "date-fns";

interface CalendarStripProps {
  date: Date;
  onSelect: (date: Date) => void;
}

export const CalendarStrip = ({ date, onSelect }: CalendarStripProps) => {
  const daysToShow = 13; // Show 13 days at a time
  const middleIndex = Math.floor(daysToShow / 2);
  
  // Calculate the start date as 6 days before the selected date
  const startDate = subDays(startOfDay(date), middleIndex);

  // Generate array of dates centered around the selected date
  const dates = Array.from({ length: daysToShow }, (_, i) =>
    addDays(startDate, i)
  );

  const moveDate = (direction: "forward" | "backward") => {
    const newDate = direction === "forward" 
      ? addDays(date, 1)
      : subDays(date, 1);
    onSelect(newDate);
  };

  return (
    <div className="flex flex-col items-center space-y-2 p-2 rounded-md border bg-white">
      <div className="text-sm font-medium text-gray-600">
        {format(date, "MMMM yyyy")}
      </div>
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => moveDate("backward")}
          className="h-8 w-8"
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div className="flex gap-1">
          {dates.map((d) => (
            <Button
              key={d.getTime()}
              variant={isSameDay(d, date) ? "default" : "ghost"}
              className={`h-8 w-8 p-0 ${
                isSameDay(d, date)
                  ? "bg-primary text-primary-foreground"
                  : "hover:bg-accent/50"
              }`}
              onClick={() => onSelect(d)}
            >
              {format(d, "d")}
            </Button>
          ))}
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => moveDate("forward")}
          className="h-8 w-8"
        >
          <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};