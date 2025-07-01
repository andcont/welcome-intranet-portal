
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { Users, Building2 } from "lucide-react";
import ProfileAvatar from "@/components/ui/ProfileAvatar";

interface Profile {
  id: string;
  name: string;
  email: string;
  role: string;
  department_id?: string;
  profile_image?: string;
}

interface Department {
  id: string;
  name: string;
  description?: string;
}

const TeamList = () => {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      // Load profiles and departments
      const [profilesResult, departmentsResult] = await Promise.all([
        supabase.from('profiles').select('*').order('name'),
        supabase.from('departments').select('*').order('name')
      ]);

      if (profilesResult.error) {
        console.error('Error loading profiles:', profilesResult.error);
      } else {
        console.log('Loaded profiles:', profilesResult.data);
        setProfiles(profilesResult.data || []);
      }

      if (departmentsResult.error) {
        console.error('Error loading departments:', departmentsResult.error);
      } else {
        console.log('Loaded departments:', departmentsResult.data);
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

  const groupByDepartment = () => {
    const grouped: Record<string, Profile[]> = {};
    
    profiles.forEach(profile => {
      const deptName = getDepartmentName(profile.department_id);
      if (!grouped[deptName]) {
        grouped[deptName] = [];
      }
      grouped[deptName].push(profile);
    });

    return grouped;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin h-8 w-8 border-4 border-white border-t-transparent rounded-full"></div>
      </div>
    );
  }

  const groupedProfiles = groupByDepartment();

  return (
    <div className="space-y-6">
      <Card className="bg-black/40 backdrop-blur-xl border border-white/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-white">
            <Users className="h-5 w-5" />
            Equipe AndCont
          </CardTitle>
          <p className="text-white/70">
            Total: {profiles.length} {profiles.length === 1 ? 'pessoa' : 'pessoas'}
          </p>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6">
            {Object.entries(groupedProfiles).map(([departmentName, teamMembers]) => (
              <div key={departmentName} className="space-y-4">
                <div className="flex items-center gap-2 pb-2 border-b border-white/20">
                  <Building2 className="h-4 w-4 text-white/70" />
                  <h3 className="text-lg font-semibold text-white">{departmentName}</h3>
                  <Badge variant="secondary" className="bg-white/10 text-white">
                    {teamMembers.length} {teamMembers.length === 1 ? 'pessoa' : 'pessoas'}
                  </Badge>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {teamMembers.map((member) => (
                    <Card key={member.id} className="bg-black/20 border border-white/10 hover:bg-black/30 transition-colors">
                      <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                          <ProfileAvatar
                            src={member.profile_image}
                            alt={member.name}
                            fallbackText={member.name}
                            size="lg"
                          />
                          <div className="flex-1 min-w-0">
                            <h4 className="font-medium text-white truncate">{member.name}</h4>
                            <p className="text-sm text-white/70 truncate">{member.email}</p>
                            <div className="flex items-center gap-2 mt-1">
                              <Badge 
                                variant={member.role === 'admin' ? 'default' : 'secondary'}
                                className={`text-xs ${
                                  member.role === 'admin' 
                                    ? 'bg-red-500/20 text-red-300 border-red-500/30' 
                                    : member.role === 'collaborator'
                                    ? 'bg-blue-500/20 text-blue-300 border-blue-500/30'
                                    : 'bg-gray-500/20 text-gray-300 border-gray-500/30'
                                }`}
                              >
                                {member.role === 'admin' ? 'Admin' : 
                                 member.role === 'collaborator' ? 'Colaborador' : 'Usuário'}
                              </Badge>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TeamList;
