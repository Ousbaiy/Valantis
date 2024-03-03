"use client";

import React from 'react';
import { Input } from './ui/input';

interface CustomInputProps {
  type: string;
  value: string | number | undefined;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder: string;
  className?: string;
}

const CustomInput: React.FC<CustomInputProps> = ({
  type,
  value,
  onChange,
  placeholder,
  className,
}) => (
  <Input
    type={type}
    onChange={onChange}
    value={value}
    className={className}
    placeholder={placeholder}
  />
);

export default CustomInput;
