import { NavLink, useNavigate } from 'react-router-dom';
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import React from 'react';
import { Button } from "../ui/button";
import { LogOut, User2 } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { USER_API_END_POINT } from "@/utils/constant";
import axios from "axios";
import { toast } from "sonner";
import { setUser } from "@/redux/authslice";

const Navbar = () => {
  const { user } = useSelector(store => store.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const logoutHandler = async () => {
    try {
      const res = await axios.get(`${USER_API_END_POINT}/logout`, { withCredentials: true });
      if (res.data.success) {
        dispatch(setUser(null));
        navigate("/");
        toast.success(res.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || "Logout failed");
    }
  };

  return (
    <div className='bg-white sticky top-0 z-50 shadow-sm'>
      <div className='flex items-center justify-between mx-auto max-w-4xl h-16'>
        <div>
          <h1 className='text-5xl font-bold'>Career<span className='text-[#F83002]'>Connect</span></h1>
        </div>
        <div className='flex items-center gap-8'>
          <ul className='flex font-medium items-center gap-2'>
            {
              user && user.role === 'recruiter' ? (
                <>
                  <li>
                    <NavLink
                      to="/admin/companies"
                      className={({ isActive }) =>
                        `px-3 py-1 rounded ${isActive ? 'bg-blue-200' : 'hover:bg-gray-100'}`
                      }
                    >
                      Companies
                    </NavLink>
                  </li>
                  <li>
                    <NavLink
                      to="/admin/jobs"
                      className={({ isActive }) =>
                        `px-3 py-1 rounded ${isActive ? 'bg-blue-200' : 'hover:bg-gray-100'}`
                      }
                    >
                      Jobs
                    </NavLink>
                  </li>
                </>
              ) : (
                <>
                  <li>
                    <NavLink
                      to="/"
                      className={({ isActive }) =>
                        `px-3 py-1 rounded ${isActive ? 'bg-blue-200' : 'hover:bg-gray-100'}`
                      }
                    >
                      Home
                    </NavLink>
                  </li>
                  <li>
                    <NavLink
                      to="/jobs"
                      className={({ isActive }) =>
                        `px-3 py-1 rounded ${isActive ? 'bg-blue-200' : 'hover:bg-gray-100'}`
                      }
                    >
                      Jobs
                    </NavLink>
                  </li>
                  <li>
                    <NavLink
                      to="/browse"
                      className={({ isActive }) =>
                        `px-3 py-1 rounded ${isActive ? 'bg-blue-200' : 'hover:bg-gray-100'}`
                      }
                    >
                      Browse
                    </NavLink>
                  </li>
                </>
              )
            }
          </ul>
          {
            !user ? (
              <div className="flex items-center gap-2">
                <NavLink to="/login"><Button variant="outline">LogIn</Button></NavLink>
                <NavLink to="/signup"><Button className="bg-[#6A38C2] hover:bg-[#6A38C2]">SignUp</Button></NavLink>
              </div>
            ) : (
              <Popover>
                <PopoverTrigger asChild>
                  <Avatar className="cursor-pointer">
                    <AvatarImage src={user?.profile?.profilePhoto} alt="@shadcn" />
                  </Avatar>
                </PopoverTrigger>
                <PopoverContent className="w-80">
                  <div>
                    <div className="flex gap-2 space-y-2">
                      <Avatar className="cursor-pointer">
                        <AvatarImage src={user?.profile?.profilePhoto} alt="@shadcn" />
                      </Avatar>
                      <div>
                        <h4 className='font-medium'>{user?.fullname}</h4>
                        <p className='text-sm text-muted-foreground'>{user?.profile?.bio}</p>
                      </div>
                    </div>
                    <div className="flex flex-col my-2 text-gray-600">
                      {
                        user && user.role === 'student' && (
                          <div className='flex w-fit items-center gap-2 cursor-pointer'>
                            <User2 />
                            <Button variant="link">
                              <NavLink to="/profile">View Profile</NavLink>
                            </Button>
                          </div>
                        )
                      }
                      <div className="flex w-fit items-center gap-2 cursor-pointer">
                        <LogOut />
                        <Button onClick={logoutHandler} variant="link">Logout</Button>
                      </div>
                    </div>
                  </div>
                </PopoverContent>
              </Popover>
            )
          }
        </div>
      </div>
    </div>
  );
};

export default Navbar;
