import { getArchivedWordsAction } from "@/app/actions/get-archived-words-action";
import { ArchivedWordsClient } from "@/components/archive/ArchivedWordsClient";

export default async function ArchivePage() {
  const words = await getArchivedWordsAction();
  
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight font-headline">
          Word Archive
        </h1>
        <p className="text-muted-foreground">Browse all past words for your department.</p>
      </div>
      <ArchivedWordsClient words={words} />
    </div>
  );
}
