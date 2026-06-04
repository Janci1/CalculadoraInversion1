import { createContext, useContext } from 'react';

export const BusinessContext = createContext();

export const useBusiness = () => useContext(BusinessContext);