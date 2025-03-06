'use client'

import { useState } from "react";
import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import { Card, CardHeader, CardBody} from "@heroui/card";
import { form } from "@heroui/theme";


interface UserLogin {
  email: string;
  password: string;
}

export default function Login() {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  async function loginHandler(e:any){
    e.preventDefault();
    console.log("Hola, estoy en el login");
    const login:UserLogin = {email,password};
    const response = await fetch("/api/login", {method:"POST", body:JSON.stringify(login)})
  }


  return (
    <main className="container mx-auto max-w-7xl pt-16 px-6 flex-grow">
      <Card className="mx-auto w-80 py-4">
        <CardHeader className="pb-0 pt-2 px-4 flex-col items-start">
          <h4 className="font-bold text-large">Login Viansa</h4>
        </CardHeader>
        <CardBody onSubmit={loginHandler} className="overflow-visible py-2" as="form">
          <Input className = "my-2" label="Email" placeholder="Enter your email" type="email" onValueChange={setEmail} />
          <Input className = "my-2" label="Password" placeholder="Enter your password" type="password" onValueChange={setPassword}/>
          <Button className = "w-full mx-auto my-2" color="primary" type="submit">Login</Button>
        </CardBody>
      </Card>
    </main>
  );
}
