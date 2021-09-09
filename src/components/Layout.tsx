import React from "react";
import { Wrapper, WrapperVariant } from "./Wrapper";
import dynamic from "next/dynamic";

const NavBar = dynamic(() => import("./NavBar"), {
    ssr: false,
});

interface LayoutProps {
    variant?: WrapperVariant;
}

export const Layout: React.FC<LayoutProps> = ({ children, variant }) => {
    return (
        <>
            <NavBar />
            <Wrapper variant={variant}>{children}</Wrapper>
        </>
    );
};
