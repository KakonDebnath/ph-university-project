import mongoose from 'mongoose';
import config from '../../config';
import { AcademicSemester } from '../academicSemester/academicSemester.model';
import { TStudent } from '../student/student.interface';
import { Student } from '../student/student.model';
import { TUser } from './user.interface';
import { User } from './user.model';
import { generatedId } from './user.utils';
import AppError from '../../errors/AppError';
import httpStatus from 'http-status';
import { TFaculty } from '../faculty/faculty.interface';
import { Faculty } from '../faculty/faculty.model';
import { Admin } from '../admin/admin.model';
import { AcademicDepartment } from '../academicDepartment/academicDepartment.model';

const createStudentIntoDB = async (password: string, payload: TStudent) => {
  // find academic semester info
  const admissionSemester = await AcademicSemester.findById(
    payload?.admissionSemester,
  );

  // check admission semester exists or not
  if (!admissionSemester) {
    throw new AppError(httpStatus.NOT_FOUND, 'Academic Semester not found');
  }

  // check academic Department exists or not
  const isAcademicDepartmentExists = await AcademicDepartment.findById(
    payload.academicDepartment,
  );

  if (!isAcademicDepartmentExists) {
    throw new AppError(httpStatus.NOT_FOUND, 'Academic Department not found');
  }
  // create a user object
  const userData: Partial<TUser> = {};

  //if password is not given , use default password
  userData.password = password || (config.default_password as string);

  //set student role
  userData.role = 'student';
  //set student email
  userData.email = payload?.email;

  //set manually generated it
  userData.id = await generatedId(admissionSemester, 'student');

  const session = await mongoose.startSession();

  try {
    session.startTransaction();
    // create a user
    // Start transaction-1
    const newUser = await User.create([userData], { session });

    if (!newUser.length) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Failed to create user');
    }

    // set id , _id as user
    payload.id = newUser[0].id;
    payload.user = newUser[0]._id; //reference _id

    //create a student
    // Start transaction -2
    const newStudent = await Student.create([payload], { session });
    if (!newStudent.length) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Failed to create student');
    }

    await session.commitTransaction();
    await session.endSession();

    return newStudent;
  } catch (err) {
    await session.abortTransaction();
    await session.endSession();
    throw new AppError(httpStatus.BAD_REQUEST, 'Failed to Create student');
  }
};

const createdFacultyIntoDB = async (password: string, payload: TFaculty) => {
  // check academic department is already exists or is not
  const isAcademicDepartmentExists = await AcademicDepartment.findById(
    payload.academicDepartment,
  );

  if (!isAcademicDepartmentExists) {
    throw new AppError(httpStatus.NOT_FOUND, 'Academic Department not found');
  }

  const userData: Partial<TUser> = {};
  // set faculty password
  userData.password = password || (config.default_password as string);
  // set faculty role
  userData.role = 'faculty';
  //set faculty email
  userData.email = payload?.email;
  // set faculty id
  userData.id = await generatedId(null, 'faculty');

  const session = await mongoose.startSession();

  try {
    session.startTransaction();
    // start transaction-1
    const newUser = await User.create([userData], { session });

    if (!newUser.length) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Failed to create user!');
    }
    // set id , _id as user
    payload.id = newUser[0].id;
    payload.user = newUser[0]._id; //reference _id

    // start transaction-2
    const newFaculty = await Faculty.create([payload], { session });
    if (!newFaculty.length) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Failed to create Faculty!');
    }

    await session.commitTransaction();
    await session.endSession();
    return newFaculty;
  } catch (err) {
    await session.abortTransaction();
    await session.endSession();
    throw new AppError(httpStatus.BAD_REQUEST, 'Failed to Create Faculty');
  }
};

const createdAdminIntoDB = async (password: string, payload: TFaculty) => {
  // check academic department is already exists or is not
  const isAcademicDepartmentExists = await AcademicDepartment.findById(
    payload.academicDepartment,
  );

  if (!isAcademicDepartmentExists) {
    throw new AppError(httpStatus.NOT_FOUND, 'Academic Department not found');
  }
  const userData: Partial<TUser> = {};
  // set admin password
  userData.password = password || (config.default_password as string);
  // set admin role
  userData.role = 'admin';
  // set admin email
  userData.email = payload?.email;
  // set admin id
  userData.id = await generatedId(null, 'admin');

  const session = await mongoose.startSession();

  try {
    session.startTransaction();
    // start transaction-1
    const newUser = await User.create([userData], { session });

    if (!newUser.length) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Failed to create user!');
    }
    // set id , _id as user
    payload.id = newUser[0].id;
    payload.user = newUser[0]._id; //reference _id

    // start transaction-2
    const newAdmin = await Admin.create([payload], { session });
    if (!newAdmin.length) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Failed to create Admin!');
    }

    await session.commitTransaction();
    await session.endSession();
    return newAdmin;
  } catch (err) {
    await session.abortTransaction();
    await session.endSession();
    throw new AppError(httpStatus.BAD_REQUEST, 'Failed to Create Admin');
  }
};

export const UserServices = {
  createStudentIntoDB,
  createdFacultyIntoDB,
  createdAdminIntoDB,
};
