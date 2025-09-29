'use client';

import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from '@/components/ui/input';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Badge } from '@/components/ui/badge';
import { Search, Archive as ArchiveIcon } from 'lucide-react';
import type { Word } from '@/types';

export function ArchivedWordsClient({ words }: { words: Word[] }) {
    const [searchTerm, setSearchTerm] = useState('');

    const filteredWords = useMemo(() => {
        return words.filter(word => 
            word.word.toLowerCase().includes(searchTerm.toLowerCase()) ||
            word.definition.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [words, searchTerm]);

    if (words.length === 0) {
        return (
            <Card>
                <CardHeader>
                <CardTitle>Archive is Empty</CardTitle>
                <CardDescription>No words have been archived for your department yet.</CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col items-center justify-center text-center text-muted-foreground min-h-[300px]">
                <ArchiveIcon className="h-16 w-16 mb-4" />
                <p>Check back later to see past words of the day.</p>
                </CardContent>
            </Card>
        );
    }

    return (
        <div className="space-y-4">
            <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                    placeholder="Search archive..."
                    className="pl-10"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>
            
            <Card>
                <CardContent className="p-0">
                   <Accordion type="single" collapsible className="w-full">
                        {filteredWords.map((word) => (
                            <AccordionItem value={word.id} key={word.id} className="px-6">
                                <AccordionTrigger>
                                    <div className="flex items-center justify-between w-full pr-4">
                                        <div className="text-left">
                                            <p className="font-semibold text-lg capitalize">{word.word}</p>
                                            <p className="text-sm text-muted-foreground">{word.pronunciation}</p>
                                        </div>
                                        <Badge variant="outline">{new Date(word.date).toLocaleDateString()}</Badge>
                                    </div>
                                </AccordionTrigger>
                                <AccordionContent className="space-y-4">
                                    <p>{word.definition}</p>
                                     <div>
                                        <h4 className="font-semibold mb-2 text-sm">Usage Examples:</h4>
                                        <ul className="list-disc list-inside space-y-2 text-muted-foreground text-sm">
                                            {word.examples.map((example, index) => (
                                            <li key={index}>"{example}"</li>
                                            ))}
                                        </ul>
                                    </div>
                                </AccordionContent>
                            </AccordionItem>
                        ))}
                    </Accordion>
                </CardContent>
            </Card>
             {filteredWords.length === 0 && (
                <div className="text-center text-muted-foreground py-10">
                    <p>No words match your search.</p>
                </div>
            )}
        </div>
    );
}
