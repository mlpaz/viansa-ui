import { SVGProps } from "react";

export type IconSvgProps = SVGProps<SVGSVGElement> & {
  size?: number;
};

export type UserLogin = {
  email: string;
  password: string;
};
export type UserLoginResponse = {
  token: string;
  email: string;
  id: string;
};
