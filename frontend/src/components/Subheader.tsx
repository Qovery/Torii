export interface SubheaderProps {
  pageTitle: string;
}

export function Subheader({ pageTitle }: SubheaderProps) {
  return (
    <header>
      <h1 className="text-3xl font-bold leading-tight tracking-tight text-gray-900">
        {pageTitle}
      </h1>
    </header>
  );
}

export default Subheader;
