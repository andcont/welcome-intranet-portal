
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import { useTheme } from "@/contexts/ThemeContext";
import { pt } from "date-fns/locale";

interface EventDateFieldProps {
  date: Date | undefined;
  onChange: (date: Date | undefined) => void;
}

const EventDateField = ({ date, onChange }: EventDateFieldProps) => {
  const { selectedGradient } = useTheme();
  
  return (
    <div>
      <Label htmlFor="date" className="text-white block mb-2">Data</Label>
      <div className={`bg-gradient-to-br ${selectedGradient.calendarColor} bg-opacity-30 rounded-md p-3 border border-white/30`}>
        <Calendar
          mode="single"
          selected={date}
          onSelect={onChange}
          className="bg-transparent text-white mx-auto"
          locale={pt}
          modifiersClassNames={{
            today: "text-white border border-white/50 bg-primary/50"
          }}
        />
      </div>
    </div>
  );
};

export default EventDateField;
