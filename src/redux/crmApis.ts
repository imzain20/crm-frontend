import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
const baseUrl = "https://backend-d.cinqd.com/";

export const crmApi = createApi({
  reducerPath: "crmAPI",
  baseQuery: fetchBaseQuery({ baseUrl }),
  endpoints: (builder) => ({
    SubmitForm: builder.mutation({
      query: ({ bodyData, token }) => ({
        url: `/customer/create-customer`,
        method: "POST",
        body: bodyData,
        headers: {
          "auth-token": token,
        },
      }),
    }),
    getCustomerData: builder.query({
      query: ({ token }) => ({
        url: `/customer/get-customer-data`,
        method: "GET",
        headers: {
          "auth-token": token,
        },
      }),
    }),
    UploadCustomerSheet: builder.mutation({
      query: ({ bodyData, token }) => ({
        url: `/customer/upload-customer-sheet`,
        method: "POST",
        body: bodyData,
        headers: {
          "auth-token": token,
        },
      }),
    }),
    getCustomerDataById: builder.query({
      query: ({ token, id }) => ({
        url: `/customer/get-customer-data-by-id/${id}`,
        method: "GET",
        headers: {
          "auth-token": token,
        },
      }),
    }),
    createComment: builder.mutation({
      query: ({ bodyData, token }) => ({
        url: `/comments/create-comment`,
        method: "POST",
        body: bodyData,
        headers: {
          "auth-token": token,
        },
      }),
    }),
    getComments: builder.query({
      query: ({ token, id }) => ({
        url: `/comments/get-comments/${id}`,
        method: "GET",
        headers: {
          "auth-token": token,
        },
      }),
    }),
    createReply: builder.mutation({
      query: ({ bodyData, token, id }) => ({
        url: `/comments/add-reply/${id}`,
        method: "POST",
        body: bodyData,
        headers: {
          "auth-token": token,
        },
      }),
    }),
    getCommentById: builder.query({
      query: ({ token, id }) => ({
        url: `/comments/get-comment-by-id/${id}`,
        method: "GET",
        headers: {
          "auth-token": token,
        },
      }),
    }),
    createFile: builder.mutation({
      query: ({ bodyData, token }) => ({
        url: `/file/create-file`,
        method: "POST",
        body: bodyData,
        headers: {
          "auth-token": token,
        },
      }),
    }),
    getFilesData: builder.query({
      query: ({ id, token }) => ({
        url: `/file/get-data/${id}`,
        method: "GET",
        headers: {
          "auth-token": token,
        },
      }),
    }),
    createFolder: builder.mutation({
      query: ({ bodyData, token }) => ({
        url: `/folder/create-folder`,
        method: "POST",
        body: bodyData,
        headers: {
          "auth-token": token,
        },
      }),
    }),
    editFolder: builder.mutation({
      query: ({ bodyData, token, id }) => ({
        url: `/folder/edit-folder/${id}`,
        method: "PATCH",
        body: bodyData,
        headers: {
          "auth-token": token,
        },
      }),
    }),
    AddMultipleAttachments: builder.mutation({
      query: ({ bodyData, token, id }) => ({
        url: `/file/add-multiple-attachments/${id}`,
        method: "POST",
        body: bodyData,
        headers: {
          "auth-token": token,
        },
      }),
    }),
  }),
});

export const {
  useSubmitFormMutation,
  useGetCustomerDataQuery,
  useUploadCustomerSheetMutation,
  useGetCustomerDataByIdQuery,
  useCreateCommentMutation,
  useGetCommentsQuery,
  useCreateReplyMutation,
  useGetCommentByIdQuery,
  useCreateFileMutation,
  useGetFilesDataQuery,
  useCreateFolderMutation,
  useEditFolderMutation,
  useAddMultipleAttachmentsMutation,
} = crmApi;
