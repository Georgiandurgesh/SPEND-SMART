import React, { useState } from 'react';
import { Button, Card, CardBody, CardHeader } from '@nextui-org/react';
import { OtpInput } from '../Inputs';

export default function OtpForm({ onSubmit, onResend, loading = false }) {
  const [otp, setOtp] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (otp.length === 6) {
      onSubmit(otp);
    }
  };

  return (
    <Card className="max-w-md w-full p-6">
      <CardHeader className="flex flex-col items-start pb-4">
        <h2 className="text-2xl font-bold">Verify OTP</h2>
        <p className="text-foreground-500 text-sm">
          Enter the 6-digit code sent to your email
        </p>
      </CardHeader>
      <CardBody>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex justify-center">
            <OtpInput
              value={otp}
              onChange={setOtp}
              onComplete={onSubmit}
              isRequired
              className="w-full max-w-xs"
              aria-label="OTP Code"
            />
          </div>
          
          <div className="flex flex-col gap-4">
            <Button 
              type="submit" 
              color="primary"
              isLoading={loading}
              isDisabled={otp.length !== 6}
              fullWidth
            >
              Verify OTP
            </Button>
            
            <div className="text-center text-sm">
              Didn't receive a code?{' '}
              <button
                type="button"
                onClick={onResend}
                className="text-primary-500 hover:underline focus:outline-none"
                disabled={loading}
              >
                Resend OTP
              </button>
            </div>
          </div>
        </form>
      </CardBody>
    </Card>
  );
}
