export interface ServerErrorProps {
  error: Error;
}

export function ServerError({ error }: ServerErrorProps) {
  return (
    <div>
      <h1>Oops!</h1>
      <p>Sorry, an unexpected error has occurred.</p>
      <p>{error.name}</p>
      <p>
        <i>{error.message}</i>
      </p>
    </div>
  );
}
