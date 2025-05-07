
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
    // Carregar eventos do localStorage
    const storedEvents = localStorage.getItem('andcont_events');
    if (storedEvents) {
      setEvents(JSON.parse(storedEvents));
    } else {
      // Dados iniciais de exemplo
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
    
    // Filtrar eventos pela data selecionada
    const dateString = selectedDate.toISOString().split('T')[0];
    const filtered = events.filter(event => event.date === dateString);
    setFilteredEvents(filtered);
  }, [selectedDate, events]);

  const handleDelete = (id: string) => {
    const updatedEvents = events.filter(event => event.id !== id);
    setEvents(updatedEvents);
    localStorage.setItem('andcont_events', JSON.stringify(updatedEvents));
    
    // Atualizar eventos filtrados
    if (selectedDate) {
      const dateString = selectedDate.toISOString().split('T')[0];
      const filtered = updatedEvents.filter(event => event.date === dateString);
      setFilteredEvents(filtered);
    }
    
    toast.success("Evento removido com sucesso!");
  };

  // Create a map of dates with events for highlighting
  const eventDateMap = events.reduce((acc: Record<string, number>, event) => {
    const date = event.date;
    acc[date] = (acc[date] || 0) + 1;
    return acc;
  }, {});

  // Days with events for highlighting in the calendar
  const eventDays = Object.keys(eventDateMap).map(dateStr => new Date(dateStr));
  
  // Formatador de datas
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };
  
  // Custom modifiers for the calendar
  const modifiers = {
    event: eventDays
  };
  
  const modifiersStyles = {
    event: { 
      fontWeight: "bold",
      backgroundColor: "#4299e1", // Blue color for events
      color: "white",
      borderRadius: "50%"
    }
  };

  return (
    <div className="flex flex-col md:flex-row gap-6">
      <div className="md:w-1/2 bg-white p-6 rounded-lg border border-gray-200 shadow-lg">
        <Calendar
          mode="single"
          selected={selectedDate}
          onSelect={setSelectedDate}
          className="rounded-md"
          modifiers={modifiers}
          modifiersStyles={modifiersStyles}
        />
      </div>
      
      <div className="md:w-1/2">
        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-lg h-full">
          <h3 className="text-xl font-bold text-gray-800 mb-4">
            Eventos: {selectedDate ? formatDate(selectedDate.toISOString()) : ''}
          </h3>
          
          {filteredEvents.length === 0 ? (
            <div className="text-center py-8">
              <AlertCircle className="mx-auto h-8 w-8 text-gray-400 mb-3" />
              <p className="text-gray-500">
                Nenhum evento para esta data
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredEvents.map(event => (
                <div 
                  key={event.id} 
                  className="bg-gray-50 rounded-lg p-4 border border-gray-200 hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => onSelectPost(event.id)}
                  role="button"
                >
                  <div className="flex justify-between items-start">
                    <h4 className="font-medium text-gray-800">{event.title}</h4>
                    
                    {isAdmin && (
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(event.id);
                        }}
                        className="text-gray-500 hover:text-red-600 hover:bg-red-50"
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
                        className="w-full h-auto max-h-32 object-contain rounded-md border border-gray-200"
                      />
                    </div>
                  )}
                  
                  <p className="mt-2 text-gray-600 text-sm">
                    {event.description}
                  </p>
                  
                  <div className="mt-2 text-xs text-gray-500">
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
