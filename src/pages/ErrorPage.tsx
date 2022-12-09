import { Link, useRouteError } from "react-router-dom";

export const ErrorPage = () => {
  const error: any = useRouteError();
  console.log(error);
  return (
    <main className="h-screen w-full flex flex-col justify-center items-center ">
      <h1 className="text-9xl font-extrabold text-slate-600 tracking-widest">
        {error.status}
      </h1>
      {error.status === 404 && (
        <div className="bg-sky-300 px-2 text-sm rounded rotate-12 absolute">
          {error.statusText}
        </div>
      )}
      <button className="mt-5">
        <a className="relative inline-block text-sm font-medium text-slate-600 group active:text-sky-500 focus:outline-none focus:ring">
          <span className="absolute inset-0 transition-transform translate-x-0.5 translate-y-0.5 bg-slate-700 group-hover:translate-y-0 group-hover:translate-x-0"></span>
          <span className="relative block px-8 py-3 bg-slate-600 text-white border border-current">
            <Link to="/">Go Home</Link>
          </span>
        </a>
      </button>
      {error.status !== 404 && (
        <div className="bg-slate-500 p-3 rounded-lg mt-6 text-white font-semibold">
          {error.error.message}
        </div>
      )}
    </main>
  );
};
