import React, { createContext, useContext, useState, ReactNode } from "react";

// Defina o tipo para o contexto
const LembreteContext = createContext(null);

export const useLembretes = () => {
  const context = useContext(LembreteContext);
  if (!context) {
    throw new Error(
      "useLembretes deve ser usado dentro de um LembreteProvider"
    );
  }
  return context;
};

export const LembreteProvider = ({ children }: { children: ReactNode }) => {
  const [lembretes, setLembretes] = useState([
    {
      id: 1,
      tipo: "Remédio",
      nome: "Dipirona",
      dosagem: "1 comprimido - @8h",
      data: "Hoje",
      horario: "19:00",
      membro: "",
    },
    {
      id: 2,
      tipo: "Vacina",
      nome: "Tétano",
      dosagem: "",
      data: "Anual",
      horario: "10:00",
      membro: "Pedro (Filho)",
    },
  ]);

  const adicionarLembrete = (novoLembrete) => {
    const lembreteComId = {
      ...novoLembrete,
      id: Date.now(),
    };
    setLembretes((prev) => [...prev, lembreteComId]);
  };

  const removerLembrete = (id) => {
    setLembretes((prev) => prev.filter((lembrete) => lembrete.id !== id));
  };

  return (
    <LembreteContext.Provider
      value={{
        lembretes,
        adicionarLembrete,
        removerLembrete,
      }}
    >
      {children}
    </LembreteContext.Provider>
  );
};
