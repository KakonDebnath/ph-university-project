import { Schema, model } from 'mongoose';
import { TAdmin } from './admin.interface';
import userNameSchema from '../../schema/userName';

const adminSchema = new Schema<TAdmin>(
  {
    id: {
      type: String,
      required: [true, 'Id Is Required'],
      unique: true,
    },
    name: {
      type: userNameSchema,
      required: [true, 'Name is Required'],
    },
    email: {
      type: String,
      required: [true, 'Email is Required'],
      unique: true,
    },
    user: {
      type: Schema.Types.ObjectId,
      required: [true, 'User id is required'],
      unique: true,
      ref: 'User',
    },
    dateOfBirth: {
      type: Date,
    },
    designation: {
      type: String,
      required: [true, 'Designation is Required'],
    },
    bloodGroup: {
      type: String,
      required: [true, 'Blood Group is Required'],
    },
    gender: {
      type: String,
      required: [true, 'Gender is Required'],
    },
    contactNo: {
      type: String,
      required: [true, 'Contact No is Required'],
    },
    emergencyContactNo: {
      type: String,
      required: [true, 'Emergency Contact No is Required'],
    },
    academicDepartment: {
      type: Schema.Types.ObjectId,
      ref: 'AcademicDepartment',
    },
    presentAddress: {
      type: String,
      required: [true, 'Present Address is Required'],
    },
    permanentAddress: {
      type: String,
      required: [true, 'Permanent Address is Required'],
    },
    portfolioImage: {
      type: String,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
);

export const Admin = model<TAdmin>('Admin', adminSchema);
