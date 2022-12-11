import { Spinner } from "./Spinner";

export const LoadingScreen = () => {
  return (
    <div className="w-full h-screen max-h-full flex items-center justify-center">
      <Spinner />
      <h2>Loading....</h2>
    </div>
  );
};
