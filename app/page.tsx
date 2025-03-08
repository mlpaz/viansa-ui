"use client";
import { useState } from "react";
import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import { Card, CardHeader, CardBody } from "@heroui/card";
import { form } from "@heroui/theme";
import { Logo } from "@/components/icons";
import { useRouter } from "next/navigation";

interface UserLogin {
  email: string;
  password: string;
}

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [messageError, setMessageError] = useState<string>("");

  async function loginHandler(e: any) {
    e.preventDefault();
    const login: UserLogin = { email, password };
    const response = await fetch("/api/login", {
      method: "POST",
      body: JSON.stringify(login),
    });

    if (!response.ok) {
      setMessageError("Invalid Email or Password");
    }
    router.push("/home");
  }

  return (
    <main className="container mx-auto max-w-7xl pt-16 px-6 flex-grow">
      <Card className="mx-auto w-80 py-4">
        <CardHeader className="pb-0 pt-2 px-4 flex-row">
          <Logo />
          <h4 className="px-2 font-bold text-large">Login Viansa</h4>
        </CardHeader>
        <CardBody
          onSubmit={loginHandler}
          className="overflow-visible px-4 py-0"
          as="form"
        >
          <Input
            className="my-2"
            label="Email"
            placeholder="Enter your email"
            type="email"
            onValueChange={setEmail}
          />
          <Input
            className="my-2"
            label="Password"
            placeholder="Enter your password"
            type="password"
            onValueChange={setPassword}
          />
          <Button className="w-full mx-auto mt-2" color="primary" type="submit">
            Login
          </Button>
          <p className="text-red-500 text-md mt-2 mb-0 mx-auto">
            {messageError}
          </p>
        </CardBody>
      </Card>
    </main>
  );
}
