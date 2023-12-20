import mongoose from 'mongoose';
import { Student } from './student.model';
import AppError from '../../errors/AppError';
import httpStatus from 'http-status';
import { User } from '../user/user.model';
import { TStudent } from './student.interface';
import QueryBuilder from '../../builder/QueryBuilders';
import { searchAbleField } from './student.constant';

// raw way
// const getAllStudentsFromDB = async (query: Record<string, unknown>) => {
//   const queryObj: Record<string, unknown> = { ...query };

//   let searchTerm: string = '';

//   const searchAbleField: string[] = [
//     'email',
//     'name.firstName',
//     'presentAddress',
//     'permanentAddress',
//   ];

//   if (query?.searchTerm) {
//     searchTerm = query?.searchTerm as string;
//   }

//   // for searchTerm query

//   const searchTermQuery = Student.find({
//     $or: searchAbleField.map((field) => ({
//       [field]: {
//         $regex: searchTerm,
//         $options: 'i',
//       },
//     })),
//   });

//   const excludeFields = ['searchTerm', 'sort', 'limit', 'page', 'fields'];
//   excludeFields.forEach((el) => delete queryObj[el]);

//   // for filtering without searchTerm field

//   const searchFilterQuery = searchTermQuery
//     .find(queryObj)
//     .populate('admissionSemester')
//     .populate({
//       path: 'academicDepartment',
//       populate: {
//         path: 'academicFaculty',
//       },
//     });

//   let sort: string = '-createdAt';
//   if (query?.sort) {
//     sort = query?.sort as string;
//   }

//   const searchSortQuery = searchFilterQuery.sort(sort);

//   let page: number = 1;
//   let limit: number = 0;
//   let skip: number = 0;

//   if (query?.limit) {
//     limit = Number(query?.limit) as number;
//   }

//   if (query?.page) {
//     page = Number(query?.page) as number;
//     skip = (page - 1) * limit;
//   }

//   const paginationQuery = searchSortQuery.skip(skip);

//   const limitQuery = paginationQuery.limit(limit);

//   // fields limit

//   let fields: string = '-__v';

//   if (query?.fields) {
//     fields = (query?.fields as string).split(',').join(' ');
//   }

//   const result = await limitQuery.select(fields);

//   if (!result.length) {
//     throw new AppError(httpStatus.NOT_FOUND, 'No Data Found');
//   }

//   return result;
// };
const getAllStudentsFromDB = async (query: Record<string, unknown>) => {
  const studentQuery = new QueryBuilder(
    Student.find()
    .populate('user')
      .populate('admissionSemester')
      .populate({
        path: 'academicDepartment',
        populate: {
          path: 'academicFaculty',
        },
      }),
    query,
  )
    .search(searchAbleField)
    .filter()
    .sort()
    .pagination()
    .fields();

  const result = await studentQuery.modelQuery;

  if (!result.length) {
    throw new AppError(httpStatus.NOT_FOUND, 'No Data Found');
  }
  return result;
};

const getSingleStudentFromDB = async (id: string) => {
  // const result = await Student.aggregate([{ $match: { id } }]);
  const result = await Student.findOne({ id })
    .populate('admissionSemester')
    .populate({
      path: 'academicDepartment',
      populate: {
        path: 'academicFaculty',
      },
    });

  if (!result) {
    throw new AppError(httpStatus.NOT_FOUND, 'No Data Found');
  }

  return result;
};

const updateStudentIntoDB = async (id: string, payload: Partial<TStudent>) => {


  const session = await mongoose.startSession();
  try {
    const { name, guardian, localGuardian, ...remainingStudentData } = payload;

    const modifiedUpdatedData: Record<string, unknown> = {
      ...remainingStudentData,
    };
  
    /*
      guardain: {
        fatherOccupation:"Teacher"
      }
  
      guardian.fatherOccupation = Teacher
  
      name.firstName = 'Mezba'
      name.lastName = 'Abedin'
    */
  
    if (name && Object.keys(name).length) {
      for (const [key, value] of Object.entries(name)) {
        modifiedUpdatedData[`name.${key}`] = value;
      }
    }
  
    if (guardian && Object.keys(guardian).length) {
      for (const [key, value] of Object.entries(guardian)) {
        modifiedUpdatedData[`guardian.${key}`] = value;
      }
    }
  
    if (localGuardian && Object.keys(localGuardian).length) {
      for (const [key, value] of Object.entries(localGuardian)) {
        modifiedUpdatedData[`localGuardian.${key}`] = value;
      }
    }
  
    // console.log(modifiedUpdatedData);
  // transaction -1 
  session.startTransaction();
    const updateStudentData = await Student.findOneAndUpdate({ id }, modifiedUpdatedData, {
      new: true,
      runValidators: true,
      session
    });

    
    if (!updateStudentData) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Failed to Update Student');
    }


    // transition -2 update user
    const userId = updateStudentData.user;

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
  
    return updateStudentData;
    
  } catch (error: any) {
    await session.abortTransaction();
    await session.endSession();
    throw new Error(error);
  }
};

const deleteStudentFromDB = async (id: string) => {
  const isStudentExists = await Student.isUserExists(id);

  if (!isStudentExists) {
    throw new AppError(httpStatus.NOT_FOUND, 'this student does not exist');
  }

  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    const deletedStudent = await Student.findOneAndUpdate(
      { id },
      { isDeleted: true },
      { new: true, session },
    );

    if (!deletedStudent) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Failed to delete student');
    }

    const deletedUser = await User.findOneAndUpdate(
      { id },
      { isDeleted: true },
      { new: true, session },
    );

    if (!deletedUser) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Failed to delete user');
    }

    await session.commitTransaction();
    await session.endSession();

    return deletedStudent;
  } catch (err) {
    await session.abortTransaction();
    await session.endSession();

    throw new AppError(httpStatus.BAD_REQUEST, 'Failed to delete student');
  }
};

export const StudentServices = {
  getAllStudentsFromDB,
  getSingleStudentFromDB,
  updateStudentIntoDB,
  deleteStudentFromDB,
};
