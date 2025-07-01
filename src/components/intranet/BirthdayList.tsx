
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { Cake, Calendar, Gift, Users } from "lucide-react";
import ProfileAvatar from "@/components/ui/ProfileAvatar";
import { format, isToday, isTomorrow, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";

interface Profile {
  id: string;
  name: string;
  email: string;
  role: string;
  department_id?: string;
  profile_image?: string;
  birthday?: string;
}

interface Department {
  id: string;
  name: string;
}

const BirthdayList = () => {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMonth, setSelectedMonth] = useState<number>(new Date().getMonth());

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [profilesResult, departmentsResult] = await Promise.all([
        supabase.from('profiles').select('*').order('name'),
        supabase.from('departments').select('*').order('name')
      ]);

      if (profilesResult.error) {
        console.error('Error loading profiles:', profilesResult.error);
      } else {
        setProfiles(profilesResult.data || []);
      }

      if (departmentsResult.error) {
        console.error('Error loading departments:', departmentsResult.error);
      } else {
        setDepartments(departmentsResult.data || []);
      }
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getDepartmentName = (departmentId?: string) => {
    if (!departmentId) return 'Sem departamento';
    const dept = departments.find(d => d.id === departmentId);
    return dept?.name || 'Sem departamento';
  };

  const getBirthdayStatus = (birthday: string) => {
    const today = new Date();
    const birthDate = parseISO(birthday);
    const thisYearBirthday = new Date(today.getFullYear(), birthDate.getMonth(), birthDate.getDate());
    
    if (isToday(thisYearBirthday)) {
      return { status: 'today', label: 'Hoje!', color: 'bg-red-500/20 text-red-300 border-red-500/30' };
    } else if (isTomorrow(thisYearBirthday)) {
      return { status: 'tomorrow', label: 'Amanhã', color: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30' };
    }
    return { status: 'normal', label: format(thisYearBirthday, 'dd/MM', { locale: ptBR }), color: 'bg-blue-500/20 text-blue-300 border-blue-500/30' };
  };

  const getProfilesWithBirthdays = () => {
    return profiles.filter(profile => profile.birthday);
  };

  const getProfilesByMonth = (month: number) => {
    return getProfilesWithBirthdays().filter(profile => {
      if (!profile.birthday) return false;
      const birthDate = parseISO(profile.birthday);
      return birthDate.getMonth() === month;
    }).sort((a, b) => {
      const dateA = parseISO(a.birthday!);
      const dateB = parseISO(b.birthday!);
      return dateA.getDate() - dateB.getDate();
    });
  };

  const getTodaysBirthdays = () => {
    return getProfilesWithBirthdays().filter(profile => {
      if (!profile.birthday) return false;
      return getBirthdayStatus(profile.birthday).status === 'today';
    });
  };

  const getUpcomingBirthdays = () => {
    const today = new Date();
    const nextWeek = new Date();
    nextWeek.setDate(today.getDate() + 7);

    return getProfilesWithBirthdays().filter(profile => {
      if (!profile.birthday) return false;
      const birthDate = parseISO(profile.birthday);
      const thisYearBirthday = new Date(today.getFullYear(), birthDate.getMonth(), birthDate.getDate());
      
      return thisYearBirthday >= today && thisYearBirthday <= nextWeek;
    }).sort((a, b) => {
      const dateA = parseISO(a.birthday!);
      const dateB = parseISO(b.birthday!);
      const today = new Date();
      const thisYearA = new Date(today.getFullYear(), dateA.getMonth(), dateA.getDate());
      const thisYearB = new Date(today.getFullYear(), dateB.getMonth(), dateB.getDate());
      return thisYearA.getTime() - thisYearB.getTime();
    });
  };

  const months = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin h-8 w-8 border-4 border-white border-t-transparent rounded-full"></div>
      </div>
    );
  }

  const todaysBirthdays = getTodaysBirthdays();
  const upcomingBirthdays = getUpcomingBirthdays();
  const monthlyBirthdays = getProfilesByMonth(selectedMonth);

  return (
    <div className="space-y-6">
      {/* Aniversários de Hoje */}
      {todaysBirthdays.length > 0 && (
        <Card className="bg-gradient-to-r from-red-500/20 to-pink-500/20 backdrop-blur-xl border border-red-500/30">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <Gift className="h-5 w-5 text-red-400" />
              🎉 Aniversários de Hoje!
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {todaysBirthdays.map((member) => (
                <Card key={member.id} className="bg-black/20 border border-red-500/20 animate-pulse">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <ProfileAvatar
                        src={member.profile_image}
                        alt={member.name}
                        fallbackText={member.name}
                        size="lg"
                      />
                      <div className="flex-1">
                        <h4 className="font-bold text-white text-lg">{member.name}</h4>
                        <p className="text-sm text-white/70">{getDepartmentName(member.department_id)}</p>
                        <Badge className="mt-1 bg-red-500/30 text-red-200 border-red-500/50">
                          🎂 Parabéns!
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Próximos Aniversários */}
      {upcomingBirthdays.length > 0 && (
        <Card className="bg-black/40 backdrop-blur-xl border border-white/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <Calendar className="h-5 w-5" />
              Próximos 7 Dias
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {upcomingBirthdays.map((member) => {
                const birthdayInfo = getBirthdayStatus(member.birthday!);
                return (
                  <div key={member.id} className="flex items-center gap-3 p-3 bg-black/20 rounded-lg border border-white/10">
                    <ProfileAvatar
                      src={member.profile_image}
                      alt={member.name}
                      fallbackText={member.name}
                      size="md"
                    />
                    <div className="flex-1">
                      <h4 className="font-medium text-white">{member.name}</h4>
                      <p className="text-sm text-white/70">{getDepartmentName(member.department_id)}</p>
                    </div>
                    <Badge className={birthdayInfo.color}>
                      {birthdayInfo.label}
                    </Badge>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Seletor de Mês */}
      <Card className="bg-black/40 backdrop-blur-xl border border-white/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-white">
            <Cake className="h-5 w-5" />
            Aniversários por Mês
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <div className="flex flex-wrap gap-2">
              {months.map((month, index) => (
                <Button
                  key={month}
                  variant={selectedMonth === index ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedMonth(index)}
                  className={`${
                    selectedMonth === index
                      ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                      : 'bg-black/20 text-white border-white/30 hover:bg-white/10'
                  }`}
                >
                  {month}
                </Button>
              ))}
            </div>
          </div>

          {monthlyBirthdays.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {monthlyBirthdays.map((member) => (
                <Card key={member.id} className="bg-black/20 border border-white/10 hover:bg-black/30 transition-colors">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <ProfileAvatar
                        src={member.profile_image}
                        alt={member.name}
                        fallbackText={member.name}
                        size="md"
                      />
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-white truncate">{member.name}</h4>
                        <p className="text-sm text-white/70 truncate">{getDepartmentName(member.department_id)}</p>
                        <Badge className="mt-1 bg-blue-500/20 text-blue-300 border-blue-500/30 text-xs">
                          {format(parseISO(member.birthday!), 'dd/MM', { locale: ptBR })}
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Users className="h-12 w-12 text-white/30 mx-auto mb-4" />
              <p className="text-white/70">Nenhum aniversário em {months[selectedMonth]}</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default BirthdayList;
