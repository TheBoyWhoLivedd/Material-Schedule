import { createSelector, createEntityAdapter } from "@reduxjs/toolkit";
import { apiSlice } from "../../app/api/apiSlice";

const schedulesAdapter = createEntityAdapter({
  sortComparer: (a, b) =>
    a.completed === b.completed ? 0 : a.completed ? 1 : -1,
});

const initialState = schedulesAdapter.getInitialState();

export const schedulesApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getSchedules: builder.query({
      query: () => ({
        url: "/schedules",
        validateStatus: (response, result) => {
          return response.status === 200 && !result.isError;
        },
      }),
      transformResponse: (responseData) => {
        const loadedSchedules = responseData.map((schedule) => {
          schedule.id = schedule._id;
          return schedule;
        });
        return schedulesAdapter.setAll(initialState, loadedSchedules);//This normalises our state
      },
      providesTags: (result, error, arg) => {
        if (result?.ids) {
          return [
            { type: "Schedule", id: "LIST" },
            ...result.ids.map((id) => ({ type: "Schedule", id })),
          ];
        } else return [{ type: "Schedule", id: "LIST" }];
      },
    }),
    addNewNote: builder.mutation({
      query: (initialNote) => ({
        url: "/schedules",
        method: "POST",
        body: {
          ...initialNote,
        },
      }),
      invalidatesTags: [{ type: "Schedule", id: "LIST" }],
    }),
    updateNote: builder.mutation({
      query: (initialNote) => ({
        url: "/schedules",
        method: "PATCH",
        body: {
          ...initialNote,
        },
      }),
      invalidatesTags: (result, error, arg) => [{ type: "Note", id: arg.id }],
    }),
    deleteNote: builder.mutation({
      query: ({ id }) => ({
        url: `/schedules`,
        method: "DELETE",
        body: { id },
      }),
      invalidatesTags: (result, error, arg) => [{ type: "Note", id: arg.id }],
    }),
  }),
});

export const {
  useGetSchedulesQuery,
  useAddNewNoteMutation,
  useUpdateNoteMutation,
  useDeleteNoteMutation,
} = schedulesApiSlice;

// returns the query result object
export const selectSchedulesResult = schedulesApiSlice.endpoints.getSchedules.select();

// creates memoized selector
const selectSchedulesData = createSelector(
  selectSchedulesResult,
  (schedulesResult) => schedulesResult.data // normalized state object with ids & entities
);

//getSelectors creates these selectors and we rename them with aliases using destructuring
export const {
  selectAll: selectAllNotes,
  selectById: selectScheduleById,
  selectIds: selectNoteIds,
  // Pass in a selector that returns the notes slice of state
} = schedulesAdapter.getSelectors(
  (state) => selectSchedulesData(state) ?? initialState
);
