
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
}

const CalendarView = ({ isAdmin }: CalendarViewProps) => {
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

  // Dias com eventos para destacar no calendário
  const eventDates = events.map(event => new Date(event.date));
  
  // Formatador de datas
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  return (
    <div className="flex flex-col md:flex-row gap-6">
      <div className="md:w-1/2 bg-black/20 backdrop-blur-lg p-6 rounded-lg border border-white/10">
        <Calendar
          mode="single"
          selected={selectedDate}
          onSelect={setSelectedDate}
          className="bg-black/10 rounded-md text-white"
          modifiers={{
            event: eventDates
          }}
          modifiersStyles={{
            event: { 
              fontWeight: "bold",
              backgroundColor: "rgba(255, 255, 255, 0.2)",
              color: "white"
            }
          }}
        />
      </div>
      
      <div className="md:w-1/2">
        <div className="bg-black/20 backdrop-blur-lg p-6 rounded-lg border border-white/10 h-full">
          <h3 className="text-xl font-bold text-white mb-4">
            Eventos: {selectedDate ? formatDate(selectedDate.toISOString()) : ''}
          </h3>
          
          {filteredEvents.length === 0 ? (
            <div className="text-center py-8">
              <AlertCircle className="mx-auto h-8 w-8 text-white/60 mb-3" />
              <p className="text-white/70">
                Nenhum evento para esta data
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredEvents.map(event => (
                <div 
                  key={event.id} 
                  className="bg-black/10 backdrop-blur-lg rounded-lg p-4 border border-white/10"
                >
                  <div className="flex justify-between items-start">
                    <h4 className="font-medium text-white">{event.title}</h4>
                    
                    {isAdmin && (
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => handleDelete(event.id)}
                        className="text-white/70 hover:text-white hover:bg-white/10"
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
                        className="w-full h-auto max-h-32 object-contain rounded-md border border-white/10"
                      />
                    </div>
                  )}
                  
                  <p className="mt-2 text-white/80 text-sm">
                    {event.description}
                  </p>
                  
                  <div className="mt-2 text-xs text-white/50">
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
