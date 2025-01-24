import React, { useEffect, useState } from 'react'
import Navbar from '../shared/Navbar'
import { Label } from '../ui/label'
import { Input } from '../ui/input'
import { RadioGroup } from '../ui/radio-group'
import { Button } from '../ui/button'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { USER_API_END_POINT } from '@/utils/constant'
import { toast } from 'sonner'
import { useDispatch, useSelector } from 'react-redux'
import { setLoading } from '../../redux/authslice';
import { Loader2 } from 'lucide-react'

const Signup = () => {

    const [input, setInput] = useState({
        fullname: "",
        email: "",
        phoneNumber: "",
        password: "",
        role: "",
        file: ""
    });
    const [otp, setOtp] = useState("");
    const [isOtpSent, setIsOtpSent] = useState(false);
    const {loading,user} = useSelector(store=>store.auth);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const changeEventHandler = (e) => {
        setInput({ ...input, [e.target.name]: e.target.value });
    }
    const changeFileHandler = (e) => {
        setInput({ ...input, file: e.target.files?.[0] });
    }
    const submitHandler = async (e) => {
        e.preventDefault();
        
        // Prepare the data as a plain object
        const requestData = {
            fullname: input.fullname,
            email: input.email,
            phoneNumber: input.phoneNumber,
            password: input.password,
            role: input.role,
            file: input.file ? input.file.name : null, 
        };

        try {
            dispatch(setLoading(true));
            const res = await axios.post(`${USER_API_END_POINT}/register`, requestData, {
                headers: { 'Content-Type': 'application/json' },
                withCredentials: true,
            });
            if (res.data.success) {
                setIsOtpSent(true);
                toast.success("OTP sent to your email. Please verify.");
            }
        } catch (error) {
            console.log(error);
            toast.error(error.response?.data?.message || "An error occurred.");
        } finally {
            dispatch(setLoading(false));
        }
    }

    const verifyOtpHandler = async (e) => {
        e.preventDefault();
        try {
            dispatch(setLoading(true));
            const res = await axios.post(`${USER_API_END_POINT}/verify-otp`,{
                email: input.email,
                otp: otp
            }, {
                headers: { 'Content-Type': 'application/json' },
                withCredentials: true,
            });
            if (res.data.success) {
                navigate("/login");
                toast.success("Email verified successfully.");
            }
        } catch (error) {
            console.log(error);
            toast.error(error.response?.data?.message || "An error occurred.");
        } finally {
            dispatch(setLoading(false));
        }
    }

    useEffect(()=>{
        if(user){
            navigate("/");
        }
    },[])

    return (
        <div>
            <Navbar />
            <div className='flex items-center justify-center max-w-7xl mx-auto'>
                {isOtpSent ? (
                    <form onSubmit={verifyOtpHandler} className='w-1/2 border border-gray-200 rounded-md p-4 my-10'>
                        <h1 className='font-bold text-xl mb-5'>Verify OTP</h1>
                        <div className='my-2'>
                            <Label>OTP</Label>
                            <Input
                                type="text"
                                value={otp}
                                name="otp"
                                onChange={(e) => setOtp(e.target.value)}
                                placeholder="Enter OTP"
                            />
                        </div>
                        {
                            loading ? <Button className="w-full my-4"> <Loader2 className='mr-2 h-4 w-4 animate-spin' /> Verifying </Button> : <Button type="submit" className="w-full my-4">Verify OTP</Button>
                        }
                    </form>
                ) : (
                    <form onSubmit={submitHandler} className='w-1/2 border border-gray-200 rounded-md p-4 my-10'>
                        <h1 className='font-bold text-xl mb-5'>Sign Up</h1>
                        <div className='my-2'>
                            <Label>Full Name</Label>
                            <Input
                                type="text"
                                value={input.fullname}
                                name="fullname"
                                onChange={changeEventHandler}
                                placeholder="Full Name "
                            />
                        </div>
                        <div className='my-2'>
                            <Label>Email</Label>
                            <Input
                                type="email"
                                value={input.email}
                                name="email"
                                onChange={changeEventHandler}
                                placeholder="Email"
                            />
                        </div>
                        <div className='my-2'>
                            <Label>Phone Number</Label>
                            <Input
                                type="text"
                                value={input.phoneNumber}
                                name="phoneNumber"
                                onChange={changeEventHandler}
                                placeholder="XXXXXXXX"
                            />
                        </div>
                        <div className='my-2'>
                            <Label>Password</Label>
                            <Input
                                type="password"
                                value={input.password}
                                name="password"
                                onChange={changeEventHandler}
                                placeholder="Password"
                            />
                        </div>
                        <div className='flex items-center justify-between'>
                            <RadioGroup className="flex items-center gap-4 my-5">
                                <div className="flex items-center space-x-2">
                                    <Input
                                        type="radio"
                                        name="role"
                                        value="student"
                                        checked={input.role === 'student'}
                                        onChange={changeEventHandler}
                                        className="cursor-pointer"
                                    />
                                    <Label htmlFor="r1">Student</Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <Input
                                        type="radio"
                                        name="role"
                                        value="recruiter"
                                        checked={input.role === 'recruiter'}
                                        onChange={changeEventHandler}
                                        className="cursor-pointer"
                                    />
                                    <Label htmlFor="r2">Recruiter</Label>
                                </div>
                            </RadioGroup>
                            <div className='flex items-center gap-2'>
                                <Label>Profile</Label>
                                <Input
                                    accept="image/*"
                                    type="file"
                                    onChange={changeFileHandler}
                                    className="cursor-pointer"
                                />
                            </div>
                        </div>
                        {
                            loading ? <Button className="w-full my-4"> <Loader2 className='mr-2 h-4 w-4 animate-spin' /> Please wait </Button> : <Button type="submit" className="w-full my-4">Signup</Button>
                        }
                        <span className='text-sm'>Already have an account? <Link to="/login" className='text-blue-600'>Login</Link></span>
                    </form>
                )}
            </div>
        </div>
    )
}

export default Signup