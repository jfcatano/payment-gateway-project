import React from 'react';
import { useRouteError, isRouteErrorResponse, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const ErrorPage: React.FC = () => {
  const error = useRouteError();
  console.error(error);

  let errorMessage: string;
  let errorStatus: number | undefined;

  if (isRouteErrorResponse(error)) {
    errorStatus = error.status;
    errorMessage = error.statusText || error.data?.message || 'An error occurred on the route.';
  } else if (error instanceof Error) {
    errorMessage = error.message;
  } else if (typeof error === 'string') {
    errorMessage = error;
  } else {
    errorMessage = 'An unexpected error has occurred.';
  }

  return (
    <div id="error-page" className="flex flex-col items-center justify-center min-h-screen text-center p-4">
      <h1 className="text-4xl font-bold mb-4">Oops!</h1>
      {errorStatus && <p className="text-xl text-muted-foreground mb-2">Error {errorStatus}</p>}
      <p className="text-lg text-red-600 mb-6">
        <i>{errorMessage}</i>
      </p>
      <p className="text-muted-foreground mb-4">Sorry, something went wrong.</p>
      <Link to="/">
        <Button variant="outline">Back to Home</Button>
      </Link>
    </div>
  );
};

export default ErrorPage;