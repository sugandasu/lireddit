import { useEffect } from "react";
import { useRouter } from "next/router";
import { useMeQuery } from "../generated/graphql";

export const useIsAuth = () => {
    const [{ data, fetching }] = useMeQuery();
    const router = useRouter();
    useEffect(() => {
        if (!fetching && !data?.me) {
            router.replace("/login?next=" + router.pathname);
        }
        // console.log(data, fetching);
    }, [fetching, data, router]);
};
