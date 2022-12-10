import { User } from "firebase/auth";
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { Spinner } from "../components";
import { auth } from "../config/firebase";
import { getUserSettings } from "../library/firebase/firestoreModel";
import { ISettings } from "../pages";

interface ISession {
  loggedIn: boolean;
  user: User | null;
  settings: ISettings;
  setSession: React.Dispatch<React.SetStateAction<ISession>>;
}

export const cups = [
  { id: 0, name: "small", maxAmount: 100 },
  { id: 1, name: "medium", maxAmount: 200 },
  { id: 2, name: "large", maxAmount: 300 },
  { id: 3, name: "extreme", maxAmount: 1000 },
];

export const initialSettings: ISettings = {
  unit: { volume: "ml" as "ml", weight: "kg" as "kg" },
  bedTime: { hour: 0, minutes: 0 },
  wakeUpTime: { hour: 0, minutes: 0 },
  intake: 0,
  weight: 0,
  timers: [],
  gender: null,
  cup: cups[2],
};

const initialState: ISession = {
  user: null,
  loggedIn: false,
  settings: initialSettings,
  setSession: () => {},
};

const AuthContext = createContext<ISession>(initialState);

export function useSession() {
  return useContext(AuthContext);
}

export function SessionProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<ISession>(initialState);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribed = auth.onAuthStateChanged(async (user) => {
      setLoading(true);
      if (user) {
        const settings = await getUserSettings();
        setSession({
          user,
          loggedIn: true,
          settings: settings ? settings : initialSettings,
          setSession,
        });
      } else {
        setSession(initialState);
      }
      setLoading(false);
    });
    return () => {
      unsubscribed();
    };
  }, []);

  const value = { ...session, setSession };

  return (
    <AuthContext.Provider value={value}>
      {loading ? (
        <div className="w-full min-h-screen flex items-center justify-center">
          <Spinner />
          <h2>Loading....</h2>
        </div>
      ) : (
        children
      )}
    </AuthContext.Provider>
  );
}
