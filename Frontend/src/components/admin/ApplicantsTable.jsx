import React, { useState } from 'react';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { MoreHorizontal, Loader2 } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'sonner';
import axios from 'axios';
import { APPLICATION_API_END_POINT } from '@/utils/constant';
import { updateApplicantStatus } from '@/redux/applicationSlice';

const shortlistingStatus = ["Accepted", "Rejected"];

const ApplicantsTable = () => {
    const { applicants } = useSelector(store => store.application);
    const dispatch = useDispatch();
    
    const [loading, setLoading] = useState({ id: null, status: null }); // Store both applicant ID and status

    const statusHandler = async (status, id) => {
        setLoading({ id, status }); // Track which applicant & status is loading
        axios.defaults.withCredentials = true;

        try {
            const res = await axios.post(`${APPLICATION_API_END_POINT}/applicant/${id}/status/${status.toLowerCase()}`);

            if (res.data.success) {
                dispatch(updateApplicantStatus({ applicantId: id, status }));
                toast.success(res.data.message);
            } else {
                toast.error(res.data.message);
            }
        } catch (error) {
            console.error(error);
            toast.error(error.response?.data?.message || "An error occurred");
        } finally {
            setLoading({ id: null, status: null }); // Reset loading state after API call
        }
    };

    return (
        <div>
            <Table>
                <TableCaption>A list of your recent applied users</TableCaption>
                <TableHeader>
                    <TableRow>
                        <TableHead>FullName</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Contact</TableHead>
                        <TableHead>Resume</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead className="text-right">Action</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {applicants && applicants?.applications?.map((item) => (
                        <TableRow key={item._id}>
                            <TableCell>{item?.applicant?.fullname}</TableCell>
                            <TableCell>{item?.applicant?.email}</TableCell>
                            <TableCell>{item?.applicant?.phoneNumber}</TableCell>
                            <TableCell>
                                {item.applicant?.profile?.resume ? (
                                    <a className="text-blue-600 cursor-pointer" href={item?.applicant?.profile?.resume} target="_blank" rel="noopener noreferrer">
                                        {item?.applicant?.profile?.resumeOriginalName}
                                    </a>
                                ) : <span>NA</span>}
                            </TableCell>
                            <TableCell>{item?.applicant.createdAt.split("T")[0]}</TableCell>
                            <TableCell className="text-right">
                                {item.status === "pending" || !item.status ? (
                                    <Popover>
                                        <PopoverTrigger>
                                            <MoreHorizontal className="cursor-pointer" />
                                        </PopoverTrigger>
                                        <PopoverContent className="w-32">
                                            {shortlistingStatus.map((status, index) => (
                                                <div
                                                    onClick={() => statusHandler(status, item._id)}
                                                    key={index}
                                                    className={`flex items-center my-2 cursor-pointer ${loading.id === item._id && loading.status === status ? "opacity-50 cursor-not-allowed" : ""}`}
                                                    disabled={loading.id === item._id && loading.status === status}
                                                >
                                                    {loading.id === item._id && loading.status === status ? (
                                                        <Loader2 className="animate-spin w-4 h-4 mr-2" />
                                                    ) : null}
                                                    <span>{status}</span>
                                                </div>
                                            ))}
                                        </PopoverContent>
                                    </Popover>
                                ) : (
                                    <button
                                        className={`px-3 py-1 rounded-md text-white cursor-not-allowed ${item.status === "Accepted" ? "bg-green-500" : "bg-red-500"}`}
                                        disabled
                                    >
                                        {item.status}
                                    </button>
                                )}
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
};

export default ApplicantsTable;
