import httpStatus from 'http-status';
import QueryBuilder from '../../builder/QueryBuilders';
import AppError from '../../errors/AppError';
import { AdminSearchableFields } from './admin.constant';
import { TAdmin } from './admin.interface';
import mongoose from 'mongoose';
import { User } from '../user/user.model';
import { Admin } from './admin.model';

const getAllAdminFromDB = async (query: Record<string, unknown>) => {
  const adminQuery = new QueryBuilder(
    Admin.find().populate({
      path: 'academicDepartment',
      populate: {
        path: 'academicFaculty',
      },
    }),
    query,
  )
    .search(AdminSearchableFields)
    .filter()
    .sort()
    .pagination()
    .fields();

  const result = await adminQuery.modelQuery;

  if (!result.length) {
    throw new AppError(httpStatus.NOT_FOUND, 'No Data Found');
  }

  return result;
};

const getSingleAdmin = async (id: string) => {
  const result = await Admin.findById(id);
  return result;
};

const updateAdmin = async (id: string, payload: Partial<TAdmin>) => {
  const { name, ...remainingAdminData } = payload;
  const modifiedUpdatedData: Record<string, unknown> = {
    ...remainingAdminData,
  };

  if (name && Object.keys(name).length) {
    for (const [key, value] of Object.entries(name)) {
      modifiedUpdatedData[`name.${key}`] = value;
    }
  }

  const result = await Admin.findByIdAndUpdate(id, modifiedUpdatedData, {
    new: true,
    runValidators: true,
  });

  return result;
};

const deleteAdmin = async (id: string) => {
  //   const isFacultyExists = await Faculty.findById(id);

  //   if (!isFacultyExists) {
  //     throw new AppError(httpStatus.NOT_FOUND, 'This Faculty does not exist');
  //   }
  const session = await mongoose.startSession();
  try {
    session.startTransaction();
    const deletedAdmin = await Admin.findByIdAndUpdate(
      id,
      { isDeleted: true },
      { new: true, session },
    );

    if (!deletedAdmin) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Failed to delete Admin');
    }

    const userId = deletedAdmin.user;

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

    return deletedAdmin;
  } catch (error: any) {
    await session.abortTransaction();
    await session.endSession();
    throw new Error(error);
  }
};

export const AdminServices = {
  getAllAdminFromDB,
  getSingleAdmin,
  updateAdmin,
  deleteAdmin,
};
