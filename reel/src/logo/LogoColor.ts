import { createContext } from 'react';

/**
 * When set, every <Logo> draws as a flat mark in this colour (no deboss,
 * texture fill or fade). Used by the orange stills series; the reel never sets it.
 */
export const LogoColorContext = createContext<string | null>(null);
