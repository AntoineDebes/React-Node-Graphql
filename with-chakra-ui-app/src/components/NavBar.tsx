import React from "react";
import { useMeQuery } from "../generated/graphql";

interface NavBarProps {}

const NavBar: React.FC<NavBarProps> = () => {
  const { data, loading } = useMeQuery();
  return <>{data?.me.username}</>;
};

export default NavBar;
