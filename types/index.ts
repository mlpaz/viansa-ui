import { SVGProps } from "react";

export type IconSvgProps = SVGProps<SVGSVGElement> & {
  size?: number;
};

export type UserLogin = {
  id?: string;
  email: string;
  password: string;
};

export type Plant = {
  id?: string;
  name?: string;
  type?: string;
};

export type Stock = {
  id?: string;
  price: number;
  amount: number;
  plant?: Plant;
};

export type UserLoginResponse = {
  token: string;
  email: string;
  id: string;
};

export type Page<T> = {
  content: T[];
  totalElements: number;
};

export type AutocompleteField = {
  label: string;
  key: string;
  description?: string;
};
