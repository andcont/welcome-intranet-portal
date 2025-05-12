
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";

interface EventDateFieldProps {
  date: Date | undefined;
  onChange: (date: Date | undefined) => void;
}

const EventDateField = ({ date, onChange }: EventDateFieldProps) => {
  return (
    <div>
      <Label htmlFor="date" className="text-white block mb-2">Data</Label>
      <div className="bg-black/15 rounded-md p-3 border border-white/30">
        <Calendar
          mode="single"
          selected={date}
          onSelect={onChange}
          className="bg-transparent text-white mx-auto"
        />
      </div>
    </div>
  );
};

export default EventDateField;
