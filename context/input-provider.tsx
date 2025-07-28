"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";

type InputContextType = {
  input: string;
  setInput: (value: string) => void;
};

const InputContext = createContext<InputContextType | undefined>(undefined);

export const InputProvider = ({ children }: { children: ReactNode }) => {
  const [input, setInput] = useState<string>("");

  return (
    <InputContext.Provider value={{ input, setInput }}>
      {children}
    </InputContext.Provider>
  );
};

export const useInput = () => {
  const context = useContext(InputContext);
  if (!context) {
    throw new Error("useInput must be used within an InputProvider");
  }
  return context;
};
