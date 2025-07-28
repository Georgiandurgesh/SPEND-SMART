import React from 'react';
import { Input } from "@nextui-org/react";

export default function OtpInput({ value, onChange, onComplete, length = 6, ...props }) {
  const handleChange = (e) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, length);
    onChange?.(value);
    if (value.length === length) {
      onComplete?.(value);
    }
  };

  return (
    <Input
      {...props}
      type="text"
      inputMode="numeric"
      pattern="\d*"
      value={value}
      onChange={handleChange}
      maxLength={length}
      placeholder="0 0 0 0 0 0"
      classNames={{
        input: "text-center text-2xl font-bold tracking-widest",
      }}
    />
  );
}
