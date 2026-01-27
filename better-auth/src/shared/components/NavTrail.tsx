'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Fragment } from 'react';
import {
  Breadcrumb,
  BreadcrumbEllipsis,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './ui';

const MAX_VISIBLE = 5;

export function NavTrail() {
  const pathname = usePathname();
  const pathSegments = pathname.split('/').filter(segment => segment !== '');

  return (
    <Breadcrumb className={`${pathname === '/' ? 'hidden' : undefined}`}>
      <BreadcrumbList>
        <NavTrailHome />
        {pathSegments.length > MAX_VISIBLE ? (
          <>
            <NavTrailFirst segment={pathSegments[0]} />
            <NavTrailDropdown
              segments={pathSegments.slice(1, -2)}
              pathSegments={pathSegments}
            />
            <NavTrailLast
              segments={pathSegments.slice(-2)}
              pathSegments={pathSegments}
            />
          </>
        ) : (
          pathSegments.map((segment, index) => {
            if (!/^[a-zA-Z0-9-_]+$/.test(segment)) return null;
            const href = '/' + pathSegments.slice(0, index + 1).join('/');
            return (
              <Fragment key={href}>
                <BreadcrumbItem>
                  <BreadcrumbLink asChild>
                    <Link href={href}>{toUpperCaseFirstLetter(segment)}</Link>
                  </BreadcrumbLink>
                </BreadcrumbItem>
                {pathSegments.length !== index + 1 ? (
                  <BreadcrumbSeparator />
                ) : null}
              </Fragment>
            );
          })
        )}
      </BreadcrumbList>
    </Breadcrumb>
  );
}

function toUpperCaseFirstLetter(word: string): string {
  return word.charAt(0).toUpperCase() + word.slice(1);
}

function NavTrailHome() {
  return (
    <>
      <BreadcrumbItem>
        <BreadcrumbLink asChild>
          <Link href='/'>Home</Link>
        </BreadcrumbLink>
      </BreadcrumbItem>
      <BreadcrumbSeparator />
    </>
  );
}

function NavTrailFirst({ segment }: { segment: string }) {
  return (
    <>
      <BreadcrumbItem>
        <BreadcrumbLink asChild>
          <Link href={`/${segment}`}>{toUpperCaseFirstLetter(segment)}</Link>
        </BreadcrumbLink>
      </BreadcrumbItem>
      <BreadcrumbSeparator />
    </>
  );
}

function NavTrailDropdown({
  segments,
  pathSegments,
}: {
  segments: string[];
  pathSegments: string[];
}) {
  return (
    <>
      <BreadcrumbItem>
        <DropdownMenu>
          <DropdownMenuTrigger className='hover:cursor-pointer'>
            <BreadcrumbEllipsis />
            <span className='sr-only'>Toggle menu</span>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            {segments.map((segment, index) => {
              const href = '/' + pathSegments.slice(0, index + 2).join('/');
              return (
                <DropdownMenuItem
                  key={href}
                  asChild
                  className='hover:cursor-pointer'
                >
                  <Link href={href}>{toUpperCaseFirstLetter(segment)}</Link>
                </DropdownMenuItem>
              );
            })}
          </DropdownMenuContent>
        </DropdownMenu>
      </BreadcrumbItem>
      <BreadcrumbSeparator />
    </>
  );
}

function NavTrailLast({
  segments,
  pathSegments,
}: {
  segments: string[];
  pathSegments: string[];
}) {
  return (
    <>
      {segments.map((segment, index) => {
        const href =
          '/' +
          pathSegments.slice(0, pathSegments.length - 2 + index + 1).join('/');
        return (
          <Fragment key={href}>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link href={href}>{toUpperCaseFirstLetter(segment)}</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            {index !== 1 && <BreadcrumbSeparator />}
          </Fragment>
        );
      })}
    </>
  );
}
