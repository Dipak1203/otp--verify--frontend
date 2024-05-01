import { ChangeEvent, FormEvent, KeyboardEvent, useRef, useState } from "react";

export function OtpVerify({ email }: { email: string }) {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [errorMessage, setErrorMessage] = useState("");
  const inputRefs = useRef<HTMLInputElement[]>([]);

  const handleChange = (index: number, value: string) => {
    if (/\d/.test(value) && value.length <= 1) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);

      // Move to next input box if there's a digit entered
      if (value.length === 1 && index < 5 && inputRefs.current[index + 1]) {
        inputRefs.current[index + 1].focus();
      }
    }
  };

  const handleKeyPress = (
    index: number,
    event: KeyboardEvent<HTMLInputElement>
  ) => {
    if (event.key === "Backspace" && index > 0 && !otp[index]) {
      inputRefs.current[index - 1].focus();
    }
  };

  const handlePaste = (
    index: number,
    event: React.ClipboardEvent<HTMLInputElement>
  ) => {
    const pastedData = event.clipboardData.getData("Text").trim();
    const pastedDigits = pastedData
      .split("")
      .filter((char) => /\d/.test(char))
      .slice(0, 6 - index);
    const newOtp = [...otp];
    pastedDigits.forEach((digit, i) => {
      newOtp[index + i] = digit;
    });
    setOtp(newOtp);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const enteredOtp = otp.join("");
    // Validate the entered OTP
    if (enteredOtp.length !== 6) {
      setErrorMessage("Please enter a 6-digit OTP.");
    } else {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/otp/verify`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            otp: enteredOtp,
            email,
          }),
        }
      );
      console.log(response, "response");
      const message = await response.json();

      if (!response.ok) {
        setErrorMessage(message.error || "Failed to verify OTP.");
      }

      setErrorMessage("");
      alert(message.message);
      setOtp(["", "", "", "", "", ""]);
    }
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus(); // Focus on the first input box after submission
    }
  };

  return (
    <main className="container">
      <section>
        <h1>Verification Code:</h1>
        <p className="error__message">{errorMessage}</p>
        <form onSubmit={handleSubmit} className="form">
          <div>
            {otp?.map((digit, index) => (
              <input
                key={index}
                type="text"
                className="otp__input"
                value={digit}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  handleChange(index, e.target.value)
                }
                onKeyDown={(e: KeyboardEvent<HTMLInputElement>) =>
                  handleKeyPress(index, e)
                }
                onPaste={(e: React.ClipboardEvent<HTMLInputElement>) =>
                  handlePaste(index, e)
                }
                maxLength={1}
                ref={(ref: HTMLInputElement) =>
                  (inputRefs.current[index] = ref)
                }
              />
            ))}
          </div>
          <button type="submit" className="otp__button">
            SUBMIT
          </button>
        </form>
      </section>
    </main>
  );
}
