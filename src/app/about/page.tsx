import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Logo } from '@/components/ui/logo';
import Link from 'next/link';

export default function AboutPage() {
  return (
    <div className="container mx-auto max-w-4xl py-10 px-4">
      <div className="flex flex-col items-center text-center mb-12">
        <Logo />
        <h1 className="text-4xl font-bold tracking-tight font-headline mt-4">About ZainLingo Lite</h1>
        <p className="mt-2 text-lg text-muted-foreground">Your departmental vocabulary companion.</p>
      </div>

      <div className="space-y-8">
        <Card>
          <CardHeader>
            <CardTitle>Our Mission</CardTitle>
          </CardHeader>
          <CardContent className="text-muted-foreground space-y-4">
            <p>ZainLingo Lite is designed to enhance inter-departmental communication and understanding within our organization. By providing daily, department-specific vocabulary, we aim to break down jargon barriers, foster a more collaborative environment, and empower every team member with the language of our business.</p>
            <p>Whether you're in Finance, Engineering, or Marketing, ZainLingo Lite helps you master the key terms that drive our success.</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>How It Works</CardTitle>
          </CardHeader>
          <CardContent className="text-muted-foreground space-y-4">
            <ul className="list-disc list-inside space-y-2">
              <li><strong>Word of the Day:</strong> Each day, you'll receive a new word relevant to your selected department, complete with a clear definition and practical usage examples.</li>
              <li><strong>Interactive Quizzes:</strong> Test your knowledge and reinforce your learning with simple quizzes based on recent words. (Coming Soon)</li>
              <li><strong>Track Your Progress:</strong> Stay motivated by tracking your learning streak, the number of words you've learned, and your average quiz scores. (Coming Soon)</li>
              <li><strong>Word Archive:</strong> Need a refresher? Browse the archive for a complete list of past words from your department. (Coming Soon)</li>
            </ul>
          </CardContent>
        </Card>
        
        <div className="text-center text-sm text-muted-foreground">
            <p>Built with ❤️ for the Zain team.</p>
            <Link href="/dashboard" className="text-primary hover:underline">Back to Dashboard</Link>
        </div>
      </div>
    </div>
  );
}
