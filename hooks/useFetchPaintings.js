import { useQuery, useInfiniteQuery } from "@tanstack/react-query";

export default function useFetchPaintings(page) {
    const getPaintings = async ({ pageParam = page,limit=10 }) => {
        const res = await (
            await fetch(
                `https://artmuse-617f4c1e3849.herokuapp.com/api/paintings_app/?limit=${limit}&page=${pageParam}`
            )
        ).json();
        
        return {
            data: res["paintings"],
            nextPage: pageParam + 1,
        };
    };
    return useInfiniteQuery(["paintings"], getPaintings, {
        getNextPageParam: (lastPage) => {
            if (lastPage.data.length < 10) return undefined;
            return lastPage.nextPage;
        },
    });
}

