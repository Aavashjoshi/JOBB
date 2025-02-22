import { createSlice } from "@reduxjs/toolkit";

const applicationSlice = createSlice({
    name: 'application',
    initialState: {
        applicants: null,
    },
    reducers: {
        setAllApplicants: (state, action) => {
            state.applicants = action.payload;
        },
        updateApplicantStatus: (state, action) => {
            const { applicantId, status } = action.payload;
            
            // Find the applicant in the Redux store and update their status
            if (state.applicants && state.applicants.applications) {
                state.applicants.applications = state.applicants.applications.map(applicant =>
                    applicant._id === applicantId ? { ...applicant, status } : applicant
                );
            }
        }
    }
});

export const { setAllApplicants, updateApplicantStatus } = applicationSlice.actions;

export default applicationSlice.reducer;
