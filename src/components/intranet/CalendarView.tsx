
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Trash, AlertCircle } from "lucide-react";
import { toast } from "sonner";

interface CalendarEvent {
  id: string;
  title: string;
  description: string;
  image?: string | null;
  date: string;
  createdAt: string;
  createdBy: string;
}

interface CalendarViewProps {
  isAdmin: boolean;
  onSelectPost: (id: string) => void;
}

const CalendarView = ({ isAdmin, onSelectPost }: CalendarViewProps) => {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [filteredEvents, setFilteredEvents] = useState<CalendarEvent[]>([]);

  useEffect(() => {
    // Load events from localStorage
    const storedEvents = localStorage.getItem('andcont_events');
    if (storedEvents) {
      setEvents(JSON.parse(storedEvents));
    } else {
      // Example initial data
      const today = new Date();
      const initialEvents = [
        {
          id: '1',
          title: 'Reunião de Equipe',
          description: 'Reunião mensal de alinhamento de objetivos',
          date: today.toISOString().split('T')[0],
          createdAt: today.toISOString(),
          createdBy: 'Administrador'
        }
      ];
      localStorage.setItem('andcont_events', JSON.stringify(initialEvents));
      setEvents(initialEvents);
    }
  }, []);

  useEffect(() => {
    if (!selectedDate) return;
    
    // Filter events by the selected date
    const dateString = selectedDate.toISOString().split('T')[0];
    const filtered = events.filter(event => event.date === dateString);
    setFilteredEvents(filtered);
  }, [selectedDate, events]);

  const handleDelete = (id: string) => {
    const updatedEvents = events.filter(event => event.id !== id);
    setEvents(updatedEvents);
    localStorage.setItem('andcont_events', JSON.stringify(updatedEvents));
    
    // Update filtered events
    if (selectedDate) {
      const dateString = selectedDate.toISOString().split('T')[0];
      const filtered = updatedEvents.filter(event => event.date === dateString);
      setFilteredEvents(filtered);
    }
    
    toast.success("Evento removido com sucesso!");
  };

  // Date formatter
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };
  
  // Create a map of dates with events for highlighting
  const eventDateMap = events.reduce((acc: Record<string, number>, event) => {
    const date = event.date;
    acc[date] = (acc[date] || 0) + 1;
    return acc;
  }, {});

  // Days with events for highlighting in the calendar - FIX: Correctly parse date strings to Date objects
  const eventDays = Object.keys(eventDateMap).map(dateStr => {
    // Ensure we properly create Date objects from ISO date strings (YYYY-MM-DD)
    const [year, month, day] = dateStr.split('-').map(Number);
    // Create date with adjusted month (0-based index)
    return new Date(year, month - 1, day);
  });
  
  // Custom modifiers for the calendar - needs to follow react-day-picker format
  const modifiers = {
    event: eventDays
  };

  return (
    <div className="flex flex-col md:flex-row gap-6">
      <div className="md:w-1/2 bg-gradient-to-br from-andcont-orange/30 to-andcont-yellow/30 backdrop-blur-xl p-6 border border-white/30 rounded-lg">
        <Calendar
          mode="single"
          selected={selectedDate}
          onSelect={setSelectedDate}
          className="text-white"
          modifiers={modifiers}
          modifiersClassNames={{
            event: "text-andcont-yellow border border-andcont-yellow bg-andcont-orange/30",
            today: "text-white border-andcont-orange bg-andcont-orange/30"
          }}
        />
      </div>
      
      <div className="md:w-1/2">
        <div className="bg-gradient-to-br from-andcont-orange/30 to-andcont-yellow/30 backdrop-blur-xl p-6 border border-white/30 rounded-lg h-full">
          <h3 className="text-xl font-bold text-white mb-4">
            Eventos: {selectedDate ? formatDate(selectedDate.toISOString()) : ''}
          </h3>
          
          {filteredEvents.length === 0 ? (
            <div className="text-center py-8">
              <AlertCircle className="mx-auto h-8 w-8 text-white/60 mb-3" />
              <p className="text-white/80">
                Nenhum evento para esta data
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredEvents.map(event => (
                <div 
                  key={event.id} 
                  className="bg-black/15 backdrop-blur-xl rounded-lg p-4 hover:bg-black/20 transition-all cursor-pointer border border-white/20"
                  onClick={() => onSelectPost(event.id)}
                  role="button"
                >
                  <div className="flex justify-between items-start">
                    <h4 className="font-medium text-white">{event.title}</h4>
                    
                    {isAdmin && (
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(event.id);
                        }}
                        className="text-white/70 hover:text-red-300 hover:bg-white/10"
                      >
                        <Trash size={14} />
                      </Button>
                    )}
                  </div>
                  
                  {event.image && (
                    <div className="mt-3 mb-3">
                      <img 
                        src={event.image} 
                        alt={event.title} 
                        className="w-full h-auto max-h-32 object-contain rounded-md border border-white/20"
                      />
                    </div>
                  )}
                  
                  <p className="mt-2 text-white/90 text-sm">
                    {event.description}
                  </p>
                  
                  <div className="mt-2 text-xs text-white/70">
                    Por: {event.createdBy}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CalendarView;
