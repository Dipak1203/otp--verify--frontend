import { useState } from "react";
import { OtpVerify } from "./Components/OtpVerify";
import { UserEmail } from "./Components/userEmail";

function App() {
  const [email, setEmail] = useState("");
  const [emailEntered, setEmailEntered] = useState(false);

  const handleEmailSubmit = () => {
    setEmailEntered(true);
  };

  return (
    <div>
      {!emailEntered ? (
        <UserEmail email={email} setEmail={setEmail} onSubmit={handleEmailSubmit} />
      ) : (
        <OtpVerify email={email}/>
      )}
    </div>
  );
}

export default App;
