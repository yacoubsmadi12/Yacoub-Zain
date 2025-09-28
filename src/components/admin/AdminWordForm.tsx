'use client';

import { useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { addWord, logAdminAction } from '@/lib/firebase/firestore';
import { Loader2, Sparkles, PlusCircle, XCircle } from 'lucide-react';
import { defineWordWithGemini } from '@/ai/flows/define-word-with-gemini';

const formSchema = z.object({
  word: z.string().min(1, { message: 'Word is required.' }),
  department: z.string({ required_error: "Please select a department." }),
  date: z.string().min(1, { message: "Date is required." }),
  definition: z.string().min(10, { message: "Definition is required." }),
  examples: z.array(z.object({ value: z.string().min(5, { message: "Example must be at least 5 characters." }) })),
});

const departments = ["Finance", "Human Resources", "Engineering", "Marketing", "Sales", "General"];

export function AdminWordForm() {
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      word: '',
      date: new Date().toISOString().split('T')[0],
      definition: '',
      examples: [{ value: '' }, { value: '' }, { value: '' }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "examples",
  });

  const handleGenerateDefinition = async () => {
    const word = form.getValues('word');
    if (!word) {
      form.setError('word', { type: 'manual', message: 'Please enter a word to define.' });
      return;
    }
    setIsGenerating(true);
    try {
      const result = await defineWordWithGemini({ word });
      form.setValue('definition', result.definition, { shouldValidate: true });
      
      // Clear existing examples and add new ones
      remove();
      result.examples.forEach(example => append({ value: example }));

      toast({ title: 'Definition Generated', description: `AI-powered definition for "${word}" has been filled in.` });
    } catch (error) {
      toast({ title: 'Generation Failed', description: 'Could not generate a definition for this word.', variant: 'destructive' });
    } finally {
      setIsGenerating(false);
    }
  };

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!user) return;
    setIsSubmitting(true);
    try {
        const wordData = {
            ...values,
            examples: values.examples.map(e => e.value)
        }
      await addWord(wordData);
      await logAdminAction(user.uid, 'add_word', { word: values.word, department: values.department });
      toast({
        title: 'Word Added',
        description: `"${values.word}" has been successfully added for ${values.department}.`,
      });
      form.reset();
    } catch (error: any) {
      toast({
        title: 'Submission Failed',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <Card>
          <CardHeader>
            <CardTitle>Add New Word</CardTitle>
            <CardDescription>Fill in the details for the new word of the day.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-6 md:grid-cols-2">
             <div className="space-y-4">
                <FormField
                    control={form.control}
                    name="word"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>Word</FormLabel>
                        <FormControl>
                        <Input placeholder="e.g., Synergy" {...field} />
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
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                            <SelectTrigger>
                            <SelectValue placeholder="Select a department" />
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
                <FormField
                    control={form.control}
                    name="date"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>Date</FormLabel>
                        <FormControl>
                            <Input type="date" {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                    )}
                />
             </div>
             <div className="space-y-4">
                <FormField
                    control={form.control}
                    name="definition"
                    render={({ field }) => (
                    <FormItem>
                        <div className="flex justify-between items-center">
                            <FormLabel>Definition</FormLabel>
                            <Button type="button" variant="outline" size="sm" onClick={handleGenerateDefinition} disabled={isGenerating}>
                                {isGenerating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4 text-accent" />}
                                Generate with AI
                            </Button>
                        </div>
                        <FormControl>
                        <Textarea placeholder="The combined power of a group of things when they are working together..." rows={5} {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                    )}
                />
                 <div>
                    <FormLabel>Usage Examples</FormLabel>
                    <div className="space-y-2 mt-2">
                    {fields.map((field, index) => (
                        <FormField
                        key={field.id}
                        control={form.control}
                        name={`examples.${index}.value`}
                        render={({ field }) => (
                            <FormItem>
                                <div className="flex items-center gap-2">
                                <FormControl>
                                    <Input placeholder={`Example ${index + 1}`} {...field} />
                                </FormControl>
                                <Button type="button" variant="ghost" size="icon" onClick={() => remove(index)} className="shrink-0">
                                    <XCircle className="h-4 w-4 text-muted-foreground" />
                                </Button>
                                </div>
                                <FormMessage />
                            </FormItem>
                        )}
                        />
                    ))}
                    <Button type="button" variant="outline" size="sm" onClick={() => append({ value: "" })}>
                        <PlusCircle className="mr-2 h-4 w-4" />
                        Add Example
                    </Button>
                    </div>
                 </div>
             </div>
          </CardContent>
          <CardFooter className="border-t px-6 py-4">
              <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Add Word to Dictionary
              </Button>
          </CardFooter>
        </Card>
      </form>
    </Form>
  );
}
