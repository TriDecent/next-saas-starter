import {
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/shared/components/ui';
import { ROUTES } from '@/shared/constants';
import { Download, FileJson, FileSpreadsheet, FileText } from 'lucide-react';
import Link from 'next/link';
import { EXPORT_TYPES } from './schema';

const EXPORT_ICONS = {
  json: <FileJson />,
  txt: <FileText />,
  csv: <FileSpreadsheet />,
} satisfies Record<(typeof EXPORT_TYPES)[number], React.ReactElement>;

export function ExportUsersButton({ className }: { className?: string }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button className={className}>
            <Download /> Export
          </Button>
        }
      />
      <DropdownMenuContent className={'w-full'}>
        <DropdownMenuGroup>
          <DropdownMenuLabel>Export Options</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {EXPORT_TYPES.map(type => (
            <DropdownMenuItem
              key={type}
              nativeButton={false}
              render={<Link href={ROUTES.api.export.users.href({ type })} />}
            >
              {EXPORT_ICONS[type]} Export as <b className='uppercase'>{type}</b>
            </DropdownMenuItem>
          ))}
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
