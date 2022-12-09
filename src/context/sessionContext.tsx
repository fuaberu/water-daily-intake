import { User } from "firebase/auth";
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { auth } from "../config/firebase";

interface ISession {
  user: {
    loggedIn: boolean;
    data: User | null;
    settings: {
      unit: { volume: "ml" | "fl oz"; weight: "kg" | "lbs" };
    };
  };
}

const initialState: ISession = {
  user: {
    data: null,
    loggedIn: false,
    settings: { unit: { volume: "ml", weight: "kg" } },
  },
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
        setSession({
          user: {
            data: user,
            loggedIn: true,
            settings: { unit: { volume: "ml", weight: "kg" } },
          },
        });
      } else {
        setSession({
          user: {
            data: null,
            loggedIn: false,
            settings: { unit: { volume: "ml", weight: "kg" } },
          },
        });
      }
      setLoading(false);
    });
    return () => {
      unsubscribed();
    };
  }, []);

  return (
    <AuthContext.Provider value={session}>
      {loading ? (
        <div>
          <h2>loading....</h2>
        </div>
      ) : (
        children
      )}
    </AuthContext.Provider>
  );
}
