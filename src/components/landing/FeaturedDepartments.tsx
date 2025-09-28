import { Card, CardContent } from "@/components/ui/card";
import { Briefcase, Building, Cpu, DollarSign, Megaphone, Users } from "lucide-react";

const departments = [
  { name: "Finance", icon: <DollarSign className="h-8 w-8 text-primary" /> },
  { name: "Human Resources", icon: <Users className="h-8 w-8 text-primary" /> },
  { name: "Engineering", icon: <Cpu className="h-8 w-8 text-primary" /> },
  { name: "Marketing", icon: <Megaphone className="h-8 w-8 text-primary" /> },
  { name: "Sales", icon: <Briefcase className="h-8 w-8 text-primary" /> },
  { name: "General", icon: <Building className="h-8 w-8 text-primary" /> },
];

export function FeaturedDepartments() {
  return (
    <section className="w-full py-12 bg-secondary/50">
      <div className="container mx-auto text-center">
        <h2 className="text-3xl font-bold tracking-tight font-headline mb-4">Learn the Language of Any Department</h2>
        <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
          From finance to engineering, master the key terms you need to succeed in any role.
        </p>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {departments.map((dept) => (
            <Card key={dept.name} className="flex flex-col items-center justify-center p-6 hover:shadow-lg transition-shadow">
              <CardContent className="p-0 flex flex-col items-center justify-center space-y-2">
                {dept.icon}
                <p className="font-semibold">{dept.name}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
