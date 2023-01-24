import { User } from "firebase/auth";
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { LoadingScreen } from "../components";
import { auth } from "../config/firebase";
import {
  getRegisters,
  getUserSettings,
} from "../library/firebase/firestoreModel";
import { ICup, IRecord, ISettings } from "../pages";
import moment from "moment";

interface ISession {
  loggedIn: boolean;
  user: User | null;
  settings: ISettings;
  record: IRecord;
  setSession: React.Dispatch<React.SetStateAction<ISession>>;
}

const cups: ICup[] = [
  { id: 0, name: "small", maxAmount: 100 },
  { id: 1, name: "medium", maxAmount: 200 },
  { id: 2, name: "large", maxAmount: 300 },
  { id: 3, name: "1xl", maxAmount: 400 },
  { id: 4, name: "2xl", maxAmount: 500 },
  { id: 5, name: "3xl", maxAmount: 600 },
  { id: 6, name: "4xl", maxAmount: 700 },
  { id: 7, name: "5xl", maxAmount: 800 },
  { id: 8, name: "custom", maxAmount: 1000 },
];

export const initialSettings: ISettings = {
  unit: { volume: "ml" as "ml", weight: "kg" as "kg", lenght: "cm" },
  intake: 0,
  weight: 0,
  height: 0,
  birthDay: new Date(),
  exercise: "no-active",
  gender: "female",
  cup: 2,
  audioToggle: true,
  cups,
};

const initialRecord = {
  id: `${auth.currentUser?.uid}-${moment().format("yyyyMMD")}`,
  cups: [],
  date: new Date(),
  userId: auth.currentUser?.uid,
  intake: { amount: initialSettings.intake, unit: initialSettings.unit.volume },
};

const initialState: ISession = {
  user: null,
  loggedIn: false,
  settings: initialSettings,
  record: initialRecord,
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
        const register = await getRegisters(
          `${auth.currentUser?.uid}-${moment().format("yyyyMMD")}`,
          initialRecord
        );
        setSession({
          user,
          loggedIn: true,
          settings: settings ? settings : initialSettings,
          record: register,
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
        <div className="min-h-screen">
          <LoadingScreen />
        </div>
      ) : (
        children
      )}
    </AuthContext.Provider>
  );
}
