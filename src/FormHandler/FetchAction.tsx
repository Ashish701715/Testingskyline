export const FetchData = async (Url: any, body: any, method: any, Header: any) => {
    const res = await fetch(Url, {
        method: method,
        headers:Header,
        body: body
    });
    const response = await res.json();
    return response;
};
