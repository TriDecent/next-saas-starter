import { LoaderPinwheel } from 'lucide-react';

export default function AuthLoading() {
  return (
    <div className='flex justify-center'>
      <LoaderPinwheel className='animate-spin text-center h-8 w-8' />
    </div>
  );
}
