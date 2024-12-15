import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { format, addDays, subDays, isSameDay, startOfDay } from "date-fns";
import { useIsMobile } from "@/hooks/use-mobile";

interface CalendarStripProps {
  date: Date;
  onSelect: (date: Date) => void;
}

export const CalendarStrip = ({ date, onSelect }: CalendarStripProps) => {
  const isMobile = useIsMobile();
  const daysToShow = isMobile ? 7 : 13; // Show fewer days on mobile
  const middleIndex = Math.floor(daysToShow / 2);
  
  // Calculate the start date
  const startDate = subDays(startOfDay(date), middleIndex);

  // Generate array of dates centered around the selected date
  const dates = Array.from({ length: daysToShow }, (_, i) =>
    addDays(startDate, i)
  );

  const moveDate = (direction: "forward" | "backward") => {
    const newDate = direction === "forward" 
      ? addDays(date, daysToShow)
      : subDays(date, daysToShow);
    onSelect(newDate);
  };

  const today = startOfDay(new Date());

  return (
    <div className="flex flex-col items-center space-y-2 p-2 rounded-md border bg-white/80 backdrop-blur-sm w-full">
      <div className="text-sm font-medium text-gray-600">
        {format(date, "MMMM yyyy")}
      </div>
      <div className="flex items-center gap-2 w-full justify-between">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => moveDate("backward")}
          className="h-8 w-8 shrink-0"
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div className="grid grid-cols-7 gap-1 md:flex md:gap-1">
          {dates.map((d) => (
            <Button
              key={d.getTime()}
              variant={isSameDay(d, date) ? "default" : "ghost"}
              className={`h-8 w-8 p-0 ${
                isSameDay(d, date)
                  ? "bg-primary text-primary-foreground"
                  : "hover:bg-accent/50"
              } ${
                isSameDay(d, today)
                  ? "underline underline-offset-4 decoration-2"
                  : ""
              }`}
              onClick={() => onSelect(d)}
            >
              <span className="text-xs md:text-sm">
                {format(d, "d")}
              </span>
            </Button>
          ))}
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => moveDate("forward")}
          className="h-8 w-8 shrink-0"
        >
          <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};