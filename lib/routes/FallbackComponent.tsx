import { Button } from '@lib/ui/Button';
import { H1, P } from '@lib/ui/Typography';

type Props = {
  messages: {
    title: string;
    reloadButton: string;
  };
  error: Error | null;
};

const FallbackContent = ({ messages, error }: Readonly<Props>) => {
  return (
    <div className="h-screen w-screen flex justify-center items-center overflow-hidden">
      <div className="m-10 rounded-xl bg-red-400 p-12">
        <H1 className="text-center text-red-900">{messages.title}</H1>
        <P className="text-center text-red-400">{error?.message}</P>
        <div className="mx-auto mt-8 w-fit">
          <Button onClick={() => window.location.reload()}>{messages.reloadButton}</Button>
        </div>
      </div>
    </div>
  );
};

export const FallbackComponent = () => {
  return <FallbackContent messages={{ title: 'Something went wrong', reloadButton: 'Reload' }} error={null} />;
};
