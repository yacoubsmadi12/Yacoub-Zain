import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Archive as ArchiveIcon } from "lucide-react";

export default function ArchivePage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight font-headline">
          Word Archive
        </h1>
        <p className="text-muted-foreground">Browse all past words for your department.</p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Coming Soon</CardTitle>
          <CardDescription>The full word archive is under construction.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center text-center text-muted-foreground min-h-[300px]">
          <ArchiveIcon className="h-16 w-16 mb-4" />
          <p>This section will allow you to search and filter all previously featured words.</p>
        </CardContent>
      </Card>
    </div>
  );
}
