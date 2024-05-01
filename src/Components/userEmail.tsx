import { ChangeEvent, FormEvent, useState } from "react";

interface IProps {
  email: string;
  setEmail: (email: string) => void;
  onSubmit: () => void;
}
export function UserEmail({ email, setEmail, onSubmit }: IProps) {
  const [isValidEmail, setIsValidEmail] = useState(true);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!validateEmail(email)) {
      setIsValidEmail(false);
      return;
    }

    setEmail(email);
    const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/otp/send`,{
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
        }),
  
    });
    console.log(response, "response");
    if (response.status === 200) {
      onSubmit();
    }
    onSubmit();
  };

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleEmailChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    setEmail(value);
    setIsValidEmail(true); // Reset validation state when email input changes
  };

  return (
    <main className="container">
      <h1>Enter Your Email</h1>
      <form onSubmit={handleSubmit} className="form">
        <div>
          {!isValidEmail && (
            <p className="error__message">
              Please enter a valid email address.
            </p>
          )}
          <input
            type="text"
            className={`input ${isValidEmail ? "" : "invalid"}`}
            value={email}
            onChange={handleEmailChange}
          />
        </div>
        <button type="submit" className="otp__button">
          SUBMIT
        </button>
      </form>
    </main>
  );
}
