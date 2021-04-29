import { Session, User } from "@supabase/supabase-js";
import React, { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

const UserContext = createContext<{ user?: User; session?: Session }>({});

export const UserProvider: React.FC = (props) => {
  const [user, setUser] = useState(null);
  const [session, setSession] = useState(null);

  useEffect(() => {
    const session = supabase.auth.session();
    const fetchUserData = () =>
      supabase
        .from("users")
        .select("*")
        .filter("id", "eq", session.user.id)
        .single()
        .then((res) => res.data);

    let unsubscribe: () => void = () => {};
    (async () => {
      let details = await fetchUserData();
      setUser({ ...session?.user, details } || null);
      const { data } = supabase.auth.onAuthStateChange(
        async (event, session) => {
          setSession(session);
          details = await fetchUserData();
          setUser({ ...session?.user, details } || null);
        }
      );
      unsubscribe = data.unsubscribe;
    })();

    return () => unsubscribe();
  }, []);

  const context = { user, session };

  return <UserContext.Provider value={context} {...props} />;
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("Hook isn't located inside UserProvider");
  }
  return context;
};