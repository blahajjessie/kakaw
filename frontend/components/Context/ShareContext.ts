import { createContext } from "react";

// Context Types
type playerListContextType = string[];

// Contexts
const playerList = createContext<playerListContextType>([]);
