import { SVGProps } from "react";

export type IconSvgProps = SVGProps<SVGSVGElement> & {
  size?: number;
};

export type UserLogin = {
  id?: string;
  email: string;
  password: string;
};

export type ISelectOption = {
  key: string;
  label: string;
};

export type Plant = {
  id?: string;
  name?: string;
  type?: string;
};

export type City = {
  id?: string;
  name: string;
};

export type Location = {
  id?: string;
  name?: string;
  city?: City;
};

export type Client = {
  id?: string;
  coordG?: string;
  name: string;
  surname: string;
  email?: string;
  cellphone: string;
  notation?: string;
  cuitCuil: number;
  location: Location;
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
