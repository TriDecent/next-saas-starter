import { LoaderPinwheel } from 'lucide-react';

export function Loader() {
  return (
    <div className='flex justify-center'>
      <LoaderPinwheel className='h-8 w-8 animate-spin text-center' />
    </div>
  );
}
