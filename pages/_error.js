// pages/_error.js

function Error({ statusCode }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          {statusCode ? `Error ${statusCode}` : 'An error occurred'}
        </h1>
        <p className="text-gray-600 mb-8">
          {statusCode
            ? `A ${statusCode} error occurred on server`
            : 'An error occurred on client'}
        </p>
        <a
          href="/"
          className="inline-block bg-[#007BFF] text-white px-6 py-3 rounded-lg hover:bg-[#0069d9] transition-colors"
        >
          Go back home
        </a>
      </div>
    </div>
  );
}

Error.getInitialProps = ({ res, err }) => {
  const statusCode = res ? res.statusCode : err ? err.statusCode : 404;
  return { statusCode };
};

export default Error;

