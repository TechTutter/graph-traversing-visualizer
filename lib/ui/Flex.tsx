import { cn } from '@lib/utils/cn';
import { HTMLAttributes, ReactNode } from 'react';

type Props = HTMLAttributes<HTMLDivElement> & {
  children: ReactNode;
  dir?: 'row' | 'col';
  gap?: string;
  align?: string;
  justify?: string;
  className?: string;
};

const getBaseClasses = (attributes: Omit<Props, 'children' | 'className'>) => {
  const { dir = 'row', align, justify, gap } = attributes;
  return cn(
    'flex',
    gap && `gap-${gap}`,
    dir === 'col' && 'flex-col',
    align && `items-${align}`,
    justify && `justify-${justify}`,
  );
};

/**
 * @example
 * <Flex dir="col" gap="2" align="center" justify="center" className="h-screen">
 *  <H1>Title</H1>
 *  <P>Description</P>
 * </Flex>
 *
 * @example
 * <Flex gap="2">
 *  <Button>Button</Button>
 *  <Button>Button</Button>
 * </Flex>
 */

export function Flex(props: Props) {
  const { children, className, ...rest } = props;
  return (
    <div className={cn(getBaseClasses(props), className)} {...rest}>
      {children}
    </div>
  );
}
