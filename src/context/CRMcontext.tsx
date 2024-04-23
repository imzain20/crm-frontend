import React, { createContext, useContext, useState, ReactNode } from "react";

interface MyContextType {
  contactType: string;
  setContactType: React.Dispatch<React.SetStateAction<string>>;
  contactId: string;
  setContactId: React.Dispatch<React.SetStateAction<string>>;
  mainContactType: string;
  setMainContactType: React.Dispatch<React.SetStateAction<string>>;
}

const crmContext = createContext<MyContextType | undefined>(undefined);

export const CrmContextProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [contactType, setContactType] = useState("");
  const [contactId, setContactId] = useState("");
  const [mainContactType, setMainContactType] = useState("");
  return (
    <crmContext.Provider
      value={{
        contactType,
        setContactType,
        contactId,
        setContactId,
        mainContactType,
        setMainContactType,
      }}
    >
      {children}
    </crmContext.Provider>
  );
};
export const useCrmContext = (): MyContextType => {
  const context = useContext(crmContext);
  if (!context) {
    throw new Error("useMyContext must be used within a MyContextProvider");
  }
  return context;
};