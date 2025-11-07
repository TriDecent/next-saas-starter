import { SigninCard, SignupCard } from '@/features/auth';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/features/shared/components/ui';

export default function AuthPage() {
  return (
    <section className='space-y-8'>
      <h2 className='text-xl font-medium'>Authentication page</h2>

      <Tabs defaultValue='signin' className='mx-auto max-w-xl'>
        <TabsList>
          <TabsTrigger value='signin'>Sign In</TabsTrigger>
          <TabsTrigger value='signup'>Sign Up</TabsTrigger>
        </TabsList>

        <TabsContent value='signin'>
          <SigninCard />
        </TabsContent>

        <TabsContent value='signup'>
          <SignupCard />
        </TabsContent>
      </Tabs>
    </section>
  );
}
