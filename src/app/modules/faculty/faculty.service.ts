import httpStatus from 'http-status';
import QueryBuilder from '../../builder/QueryBuilders';
import AppError from '../../errors/AppError';
import { FacultySearchableFields } from './faculty.constant';
import { Faculty } from './faculty.model';
import { TFaculty } from './faculty.interface';
import mongoose from 'mongoose';
import { User } from '../user/user.model';

const getAllFacultyFromDB = async (query: Record<string, unknown>) => {
  const facultyQuery = new QueryBuilder(
    Faculty.find().populate({
      path: 'academicDepartment',
      populate: {
        path: 'academicFaculty',
      },
    }),
    query,
  )
    .search(FacultySearchableFields)
    .filter()
    .sort()
    .pagination()
    .fields();

  const result = await facultyQuery.modelQuery;

  if (!result.length) {
    throw new AppError(httpStatus.NOT_FOUND, 'No Data Found');
  }

  return result;
};

const getSingleFaculty = async (id: string) => {
  const result = await Faculty.findById(id);
  return result;
};

const updateFaculty = async (id: string, payload: Partial<TFaculty>) => {
  const { name, ...remainingFacultyData } = payload;
  const modifiedUpdatedData: Record<string, unknown> = {
    ...remainingFacultyData,
  };

  if (name && Object.keys(name).length) {
    for (const [key, value] of Object.entries(name)) {
      modifiedUpdatedData[`name.${key}`] = value;
    }
  }

  const session = await mongoose.startSession();
  try {
    session.startTransaction();
    // transition -1 update faculty
    const facultyUpdate = await Faculty.findByIdAndUpdate(
      id,
      modifiedUpdatedData,
      {
        new: true,
        runValidators: true,
        session,
      },
    );

    if (!facultyUpdate) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Failed to Update Faculty');
    }

    // transition -2 update user
    const userId = facultyUpdate.user;

    const updateUser = await User.findByIdAndUpdate(
      userId,
      modifiedUpdatedData,
      {
        new: true,
        runValidators: true,
        session,
      },
    );

    if (!updateUser) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Failed to Update User');
    }

    await session.commitTransaction();
    await session.endSession();

    return facultyUpdate;
  } catch (error: any) {
    await session.abortTransaction();
    await session.endSession();
    throw new Error(error);
  }
};

const deleteFaculty = async (id: string) => {
  //   const isFacultyExists = await Faculty.findById(id);

  //   if (!isFacultyExists) {
  //     throw new AppError(httpStatus.NOT_FOUND, 'This Faculty does not exist');
  //   }
  const session = await mongoose.startSession();
  try {
    session.startTransaction();
    const deletedFaculty = await Faculty.findByIdAndUpdate(
      id,
      { isDeleted: true },
      { new: true, session },
    );

    if (!deletedFaculty) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Failed to delete Faculty');
    }

    const userId = deletedFaculty.user;

    const deletedUser = await User.findByIdAndUpdate(
      userId,
      { isDeleted: true },
      { new: true, session },
    );

    if (!deletedUser) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Failed to delete user');
    }

    await session.commitTransaction();
    await session.endSession();

    return deletedFaculty;
  } catch (error: any) {
    await session.abortTransaction();
    await session.endSession();
    throw new Error(error);
  }
};

export const FacultyServices = {
  getAllFacultyFromDB,
  getSingleFaculty,
  updateFaculty,
  deleteFaculty,
};
