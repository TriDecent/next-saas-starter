import type { ComponentProps, ReactElement, ReactNode } from 'react';
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from './ui/client';

type DrawerOpenerProps = {
  title: string;
  description: string;
  trigger: ReactElement;
  action?: ReactNode;
  children: ReactNode;
} & ComponentProps<typeof Drawer>;

export function DrawerOpener(props: DrawerOpenerProps) {
  return (
    <Drawer {...props}>
      <DrawerTrigger render={props.trigger} />
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>{props.title}</DrawerTitle>
          <DrawerDescription>{props.description}</DrawerDescription>
        </DrawerHeader>

        {props.children}

        {props.action ? <DrawerFooter>{props.action}</DrawerFooter> : null}
      </DrawerContent>
    </Drawer>
  );
}
