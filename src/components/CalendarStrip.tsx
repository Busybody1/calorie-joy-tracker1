import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { format, addDays, subDays, isSameDay } from "date-fns";

interface CalendarStripProps {
  date: Date;
  onSelect: (date: Date) => void;
}

export const CalendarStrip = ({ date, onSelect }: CalendarStripProps) => {
  const daysToShow = 13; // Show 13 days (8-20)
  const startDate = new Date(2024, 11, 8); // December 8, 2024

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
        December 2024
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