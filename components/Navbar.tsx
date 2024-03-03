import React from 'react';
import { ModeToggle } from './ModeToggle';

const Navbar = () => {
  return (
    <div className="container flex justify-between items-center py-4">
      <h1 className="text-3xl font-bold">Valantis</h1>
      <ModeToggle />
    </div>
  );
};

export default Navbar;
