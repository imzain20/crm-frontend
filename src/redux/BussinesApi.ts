import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
const baseUrl = "https://backend-b.cinqd.com/";

export const crmApi = createApi({
  reducerPath: "businessAPI",
  baseQuery: fetchBaseQuery({ baseUrl }),
  endpoints: (business) => ({
    getCompanyProfileByCRN: business.query({
      query: ({ token, crn }) => ({
        url: `/setup/get-business-by-CRN/${crn}`,
        method: "GET",
        headers: {
          "auth-token": token,
        },
      }),
    }),
  }),
});

export const { useGetCompanyProfileByCRNQuery } = crmApi;
