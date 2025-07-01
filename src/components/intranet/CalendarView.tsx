
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Trash, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { useTheme } from "@/contexts/ThemeContext";
import { supabase } from "@/integrations/supabase/client";

interface CalendarEvent {
  id: string;
  title: string;
  content: string;
  image_url?: string | null;
  event_date: string;
  created_at: string;
  created_by: string;
}

interface CalendarViewProps {
  isAdmin: boolean;
  onSelectPost: (id: string) => void;
}

const CalendarView = ({ isAdmin, onSelectPost }: CalendarViewProps) => {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [filteredEvents, setFilteredEvents] = useState<CalendarEvent[]>([]);
  const { selectedGradient } = useTheme();

  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = async () => {
    try {
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .order('event_date', { ascending: true });

      if (error) {
        console.error('Error loading events:', error);
        return;
      }

      console.log('CalendarView - Loaded events:', data);
      setEvents(data || []);
    } catch (error) {
      console.error('Error loading events:', error);
    }
  };

  useEffect(() => {
    if (!selectedDate) return;
    
    // Filter events by the selected date
    const dateString = selectedDate.toISOString().split('T')[0];
    const filtered = events.filter(event => {
      const eventDate = new Date(event.event_date).toISOString().split('T')[0];
      return eventDate === dateString;
    });
    setFilteredEvents(filtered);
  }, [selectedDate, events]);

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from('events')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting event:', error);
        toast.error("Erro ao remover evento");
        return;
      }

      // Remove from local state
      const updatedEvents = events.filter(event => event.id !== id);
      setEvents(updatedEvents);
      
      // Update filtered events
      if (selectedDate) {
        const dateString = selectedDate.toISOString().split('T')[0];
        const filtered = updatedEvents.filter(event => {
          const eventDate = new Date(event.event_date).toISOString().split('T')[0];
          return eventDate === dateString;
        });
        setFilteredEvents(filtered);
      }
      
      toast.success("Evento removido com sucesso!");
    } catch (error) {
      console.error('Error deleting event:', error);
      toast.error("Erro ao remover evento");
    }
  };

  // Date formatter
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };
  
  // Create array of dates with events for highlighting
  const eventDays = events.map(event => {
    const eventDate = new Date(event.event_date);
    // Ensure we're working with the correct date without timezone issues
    return new Date(eventDate.getFullYear(), eventDate.getMonth(), eventDate.getDate());
  });
  
  console.log('CalendarView - Event days for highlighting:', eventDays);
  
  // Custom modifiers for the calendar
  const modifiers = {
    event: eventDays
  };
  
  // Dynamic calendar style based on selected theme
  const calendarContainerClass = `bg-gradient-to-br ${selectedGradient.calendarColor} backdrop-blur-xl p-6 border border-white/30 rounded-lg`;
  const calendarEventListClass = `bg-gradient-to-br ${selectedGradient.calendarColor} backdrop-blur-xl p-6 border border-white/30 rounded-lg h-full`;

  return (
    <div className="flex flex-col md:flex-row gap-6">
      <div className="md:w-1/2">
        <div className={calendarContainerClass}>
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={setSelectedDate}
            className="text-white"
            modifiers={modifiers}
            modifiersClassNames={{
              event: "bg-andcont-purple/30 text-white font-bold border-2 border-andcont-purple/60 rounded-full",
              today: "text-white border border-white/50 bg-primary/50"
            }}
          />
        </div>
      </div>
      
      <div className="md:w-1/2">
        <div className={calendarEventListClass}>
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
                  
                  {event.image_url && (
                    <div className="mt-3 mb-3">
                      <img 
                        src={event.image_url} 
                        alt={event.title} 
                        className="w-full h-auto max-h-32 object-contain rounded-md border border-white/20"
                      />
                    </div>
                  )}
                  
                  <p className="mt-2 text-white/90 text-sm">
                    {event.content}
                  </p>
                  
                  <div className="mt-2 text-xs text-white/70">
                    Data: {formatDate(event.event_date)}
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

