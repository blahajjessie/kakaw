import { createContext } from 'react';

// Context Types
export type playerListContextType = string[];

// Contexts
export const playerListContext = createContext<playerListContextType>([]);
