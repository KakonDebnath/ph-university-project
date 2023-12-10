import httpStatus from 'http-status';
import QueryBuilder from '../../builder/QueryBuilders';
import AppError from '../../errors/AppError';
import { CourseSearchableFields } from './course.constant';
import { TCourse } from './course.interface';
import { Course } from './course.model';
import mongoose from 'mongoose';

const createCourse = async (payload: TCourse) => {
  const result = await Course.create(payload);
  return result;
};

const getAllCourseFromDB = async (query: Record<string, unknown>) => {
  const adminQuery = new QueryBuilder(
    Course.find().populate('preRequisiteCourse.course'),
    query,
  )
    .search(CourseSearchableFields)
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

const getSingleCourseFromDB = async (id: string) => {
  const result = await Course.findById(id).populate('preRequestCourse.course');
  return result;
};

const updateCourseIntoDB = async (id: string, payload: Partial<TCourse>) => {
  const { preRequisiteCourse, ...courseRemainingData } = payload;

  const session = await mongoose.startSession();
  try {
    session.startTransaction();

    // step 1: basic course information update

    const updateBasicInfo = await Course.findByIdAndUpdate(
      id,
      courseRemainingData,
      {
        new: true,
        runValidators: true,
        session,
      },
    );
    if (!updateBasicInfo) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Fail to update course');
    }

    // check if there is any pre requisite courses to update
    if (preRequisiteCourse && preRequisiteCourse.length > 0) {
      // filter out the deleted fields
      const deletedPrerequisitesId = preRequisiteCourse
        .filter((el) => el.course && el.isDeleted)
        .map((el) => el.course);

      const deletePreRequisiteCourse = await Course.findByIdAndUpdate(
        id,
        {
          $pull: {
            preRequisiteCourse: {
              course: { $in: deletedPrerequisitesId },
            },
          },
        },
        {
          new: true,
          runValidators: true,
          session,
        },
      );

      if (!deletePreRequisiteCourse) {
        throw new AppError(httpStatus.BAD_REQUEST, 'Fail to update course');
      }

      // filter out the new course fields
      const newPreRequisites = preRequisiteCourse?.filter(
        (el) => el.course && !el.isDeleted,
      );

      const newPreRequisiteCourse = await Course.findByIdAndUpdate(
        id,
        {
          $addToSet: {
            preRequisiteCourse: {
              $each: newPreRequisites,
            },
          },
        },
        {
          new: true,
          runValidators: true,
          session,
        },
      );

      if (!newPreRequisiteCourse) {
        throw new AppError(httpStatus.BAD_REQUEST, 'Fail to update course');
      }
    }

    const result = await Course.findById(id).populate(
      'preRequisiteCourse.course',
    );

    await session.commitTransaction();
    await session.endSession();

    return result;
  } catch (err: any) {
    session.abortTransaction();
    session.endSession();
    throw new AppError(httpStatus.BAD_REQUEST, err);
  }
};

const deleteCourseFromDB = async (id: string) => {
  const result = await Course.findByIdAndUpdate(
    id,
    { isDeleted: true },
    { new: true },
  );
  return result;
};

export const CourseServices = {
  createCourse,
  getAllCourseFromDB,
  getSingleCourseFromDB,
  updateCourseIntoDB,
  deleteCourseFromDB,
};
