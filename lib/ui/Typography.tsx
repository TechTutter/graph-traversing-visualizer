import { cn } from '@lib/utils/cn';
import { HTMLAttributes, ReactNode } from 'react';

type HeadingProps = HTMLAttributes<HTMLHeadingElement> & {
  children: ReactNode;
  className?: string;
};

type ParagraphProps = HTMLAttributes<HTMLParagraphElement> & {
  children: ReactNode;
  className?: string;
};

type SpanProps = HTMLAttributes<HTMLSpanElement> & {
  children: ReactNode;
  className?: string;
};

type UlProps = HTMLAttributes<HTMLUListElement> & {
  children: ReactNode;
  className?: string;
};

const DEFAULT_CLASSNAME_H1 = 'scroll-m-20 text-4xl font-semibold tracking-tight lg:text-5xl';
const DEFAULT_CLASSNAME_H2 = 'scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0';
const DEFAULT_CLASSNAME_H3 = 'scroll-m-20 text-2xl font-semibold tracking-tight';

const DEFAULT_CLASSNAME_H4 = 'scroll-m-20 text-xl font-semibold tracking-tight';
const DEFAULT_CLASSNAME_P = 'leading-7 [&:not(:first-child)]:mt-6';
const DEFAULT_CLASSNAME_UL = 'my-6 ml-6 list-disc [&>li]:mt-2';

export const H1 = ({ children, className, ...props }: HeadingProps) => {
  return (
    <h1 className={cn(DEFAULT_CLASSNAME_H1, className)} {...props}>
      {children}
    </h1>
  );
};

export const H2 = ({ children, className, ...props }: HeadingProps) => {
  return (
    <h2 className={cn(DEFAULT_CLASSNAME_H2, className)} {...props}>
      {children}
    </h2>
  );
};

export const H3 = ({ children, className, ...props }: HeadingProps) => {
  return (
    <h3 className={cn(DEFAULT_CLASSNAME_H3, className)} {...props}>
      {children}
    </h3>
  );
};

export const H4 = ({ children, className, ...props }: HeadingProps) => {
  return (
    <h4 className={cn(DEFAULT_CLASSNAME_H4, className)} {...props}>
      {children}
    </h4>
  );
};

export const P = ({ children, className, ...props }: ParagraphProps) => {
  return (
    <p className={cn(DEFAULT_CLASSNAME_P, className)} {...props}>
      {children}
    </p>
  );
};

export const Span = ({ children, className, ...props }: SpanProps) => {
  return (
    <span className={cn('text-sm', className)} {...props}>
      {children}
    </span>
  );
};

export const Ul = ({ children, className, ...props }: UlProps) => {
  return (
    <ul className={cn(DEFAULT_CLASSNAME_UL, className)} {...props}>
      {children}
    </ul>
  );
};
