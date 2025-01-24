import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover'
import React from 'react'
import { Link, useNavigate  } from 'react-router-dom'
import { Button } from "../ui/button"
import { LogOut, Store, User2 } from "lucide-react"
import { useDispatch, useSelector } from "react-redux"
import { USER_API_END_POINT } from "@/utils/constant"
import axios from "axios"
import { toast } from "sonner"
import { setUser } from "@/redux/authslice"


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
      toast.error(error.response.data.message);
    }
  }

  return (
    <div className='bg-white sticky top-0 z-50 shadow-sm'>
      <div className='flex items-center justify-between mx-auto max-w-4xl h-16'>
        <div>
          <h1 className='text-5xl font-bold'>Career<span className='text-[#F83002]'>Connect</span>
          </h1>
        </div>
        <div className='flex items-center gap-8'>
          <ul className='flex font-medium items-center gap-2'>
            <li><Link to="/"> Home </Link></li>
            <li><Link to="/jobs"> Jobs </Link></li>
            <li><Link to="/browse"> Browse </Link></li>
          </ul>
          {
            !user ? (
              <div className="flex items-center gap-2">
                <Link to="/Login"><Button variant="outline">LogIn</Button></Link>
                <Link to="/signup"><Button className="bg-[#6A38C2] hover:bg-[#6A38C2]">SignUp</Button></Link>
              </div>
            ) : (
              <Popover>
                <PopoverTrigger asChild>
                  <Avatar className="cursor-pointer">
                    <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
                  </Avatar>
                </PopoverTrigger>
                <PopoverContent className="w-80">
                  <div>
                    <div className="flex gap-2 space-y-2">
                      <Avatar className="cursor-pointer">
                        <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
                      </Avatar>
                      <div>
                        <h4 className="font-medium">AADK CareerConnect</h4>
                        <p>Hello welcome to AADK CareerConnect.</p>
                      </div>
                    </div>
                    <div className="flex flex-col my-2 text-gray-600">
                      <div className="flex w-fit items-center gap-2 cursor-pointer">
                        <User2 />
                        <Button variant="link"><Link to="/profile">View Profile</Link></Button>
                      </div>
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
  )
}

export default Navbar;
