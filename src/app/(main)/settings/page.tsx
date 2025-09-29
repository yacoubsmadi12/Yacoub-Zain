'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { updateUserProfile } from '@/lib/firebase/firestore';
import { Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { ProgressSummaryCard } from '@/components/dashboard/ProgressSummaryCard';
import { Badge } from '@/components/ui/badge';

const formSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters.' }),
  department: z.string({ required_error: "Please select a department." }),
});

const departments = [
    "Finance", 
    "Human Resources", 
    "Engineering", 
    "Marketing", 
    "Sales",
    "Governance, Risk, and Compliance",
    "Consumer Business",
    "Legal and Regulatory",
    "Technology & Digital Innovation",
    "Corporate Communications & Sustainability"
];

export default function SettingsPage() {
  const { user, refreshUserProfile } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    values: {
      name: user?.profile?.name || '',
      department: user?.profile?.department || '',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!user) return;
    setIsLoading(true);
    try {
      await updateUserProfile(user.uid, values);
      await refreshUserProfile();
      toast({
        title: 'Profile Updated',
        description: 'Your settings have been saved successfully.',
      });
    } catch (error: any) {
      toast({
        title: 'Update Failed',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight font-headline">
          My Profile & Settings
        </h1>
        <p className="text-muted-foreground">Manage your account and see your progress at a glance.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)}>
                <Card>
                    <CardHeader>
                    <CardTitle>Profile Settings</CardTitle>
                    <CardDescription>This is how your name and department appear in the app.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                    <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                        <FormItem>
                            <FormLabel>Full Name</FormLabel>
                            <FormControl>
                            <Input placeholder="John Doe" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="department"
                        render={({ field }) => (
                        <FormItem>
                            <FormLabel>Department</FormLabel>
                            <Select onValuechange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                                <SelectTrigger>
                                <SelectValue placeholder="Select your department" />
                                </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                                {departments.map(dep => <SelectItem key={dep} value={dep}>{dep}</SelectItem>)}
                            </SelectContent>
                            </Select>
                            <FormMessage />
                        </FormItem>
                        )}
                    />
                    </CardContent>
                    <CardFooter className="border-t px-6 py-4">
                        <Button type="submit" disabled={isLoading}>
                            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Save Changes
                        </Button>
                    </CardFooter>
                </Card>
                </form>
            </Form>
        </div>
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>Your Department</CardTitle>
                </CardHeader>
                <CardContent>
                    <Badge variant="secondary" className="text-lg py-2 px-4">{user?.profile?.department || 'Not set'}</Badge>
                </CardContent>
            </Card>
            <ProgressSummaryCard />
        </div>
      </div>

    </div>
  );
}
