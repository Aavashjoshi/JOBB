import React, { useState } from 'react';
import { Label } from '../ui/label';
import Navbar from '../shared/Navbar';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { useNavigate } from 'react-router-dom';
import { COMPANY_API_END_POINT } from '@/utils/constant';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { setSingleCompany } from '@/redux/companySlice';
import { toast } from 'sonner';

const CompanyCreate = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [companyName, setCompanyName] = useState('');
    const [loading, setLoading] = useState(false);

    const registerNewCompany = async () => {
        if (!companyName.trim()) {
            return toast.error('Company name cannot be empty.');
        }

        setLoading(true);
        
        try {
            const res = await axios.post(`${COMPANY_API_END_POINT}/register`, { companyName }, {
                headers: { 'Content-Type': 'application/json' },
                withCredentials: true
            });

            if (res?.data?.success) {
                dispatch(setSingleCompany(res.data.company));
                toast.success(res.data.message);
                navigate(`/admin/companies/${res.data.company._id}`);
            } else {
                toast.error('Failed to create the company. Please try again.');
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'An unexpected error occurred. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <Navbar />
            <div className='max-w-4xl mx-auto'>
                <div className='my-10'>
                    <h1 className='font-bold text-2xl'>Your Company Name</h1>
                    <p className='text-gray-500'>What would you like to name your company? You can change this later.</p>
                </div>

                <Label>Company Name</Label>
                <Input
                    type="text"
                    className="my-2"
                    placeholder="CareerConnect, Microsoft, etc."
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                />

                <div className='flex items-center gap-2 my-10'>
                    <Button variant="outline" onClick={() => navigate("/admin/companies")} disabled={loading}>
                        Cancel
                    </Button>
                    <Button onClick={registerNewCompany} disabled={loading} aria-disabled={loading}>
                        {loading ? 'Creating...' : 'Continue'}
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default CompanyCreate;
