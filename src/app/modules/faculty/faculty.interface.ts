import { Types } from 'mongoose';
import TUserName from '../../interface/userName';
import TGender from '../../interface/gender';
import TBloodGroup from '../../interface/bloodGroup';

export type TFaculty = {
  id: string;
  user: Types.ObjectId;
  designation: string;
  name: TUserName;
  gender: TGender;
  dateOfBirth?: Date;
  email: string;
  contactNo: string;
  emergencyContactNo: string;
  bloodGroup: TBloodGroup;
  presentAddress: string;
  permanentAddress: string;
  portfolioImage?: string;
  academicDepartment: Types.ObjectId;
  isDeleted: boolean;
};


