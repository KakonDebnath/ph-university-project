import httpStatus from 'http-status';
import AppError from '../../errors/AppError';
import { AcademicSemester } from '../academicSemester/academicSemester.model';
import { TSemesterRegistration } from './semesterRegistration.interface';
import { SemesterRegistration } from './semesterRegistration.model';
import QueryBuilder from '../../builder/QueryBuilders';

const createSemesterRegistration = async (payload: TSemesterRegistration) => {
  const academicSemester = payload?.academicSemester;

  // check if there are any registered semester that is already "UPCOMING" OR "ONGOING"

  const isAnySemesterUpcomingOrOnGOING = await SemesterRegistration.findOne({
    $or: [{ status: 'UPCOMING' }, { status: 'ONGOING' }],
  });

  if (isAnySemesterUpcomingOrOnGOING) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      `There is all ready an ${isAnySemesterUpcomingOrOnGOING.status} semester`,
    );
  }

  // Check if academic semester is existing or not
  if (academicSemester) {
    const isAcademicSemesterExists =
      await AcademicSemester.findById(academicSemester);

    if (!isAcademicSemesterExists) {
      throw new AppError(
        httpStatus.NOT_FOUND,
        `this ${academicSemester} is not found on academic semester collection`,
      );
    }
  }
  // check if The semester registration is already exists or not
  const isAcademicSemesterExists = await SemesterRegistration.findOne({
    academicSemester: academicSemester,
  });

  if (isAcademicSemesterExists) {
    throw new AppError(
      httpStatus.CONFLICT,
      'This Semester Registration is Already Exists',
    );
  }

  const result = await SemesterRegistration.create(payload);
  return result;
};

const getAllSemesterRegistrationFromDB = async (
  query: Record<string, unknown>,
) => {
  const semesterRegistrationQuery = new QueryBuilder(
    SemesterRegistration.find().populate('academicSemester'),
    query,
  )
    .filter()
    .sort()
    .pagination()
    .fields();

  const result = await semesterRegistrationQuery.modelQuery;
  if (!result.length) {
    throw new AppError(httpStatus.NOT_FOUND, 'No Data Found');
  }
  return result;
};

const getSinglesSemesterRegistrationFromDB = async (id: string) => {
  const result = await SemesterRegistration.findById(id);
  return result;
};

const updateSemesterRegistrationIntoDB = async (
  id: string,
  payload: Partial<TSemesterRegistration>,
) => {
  const isAcademicSemesterExists = await SemesterRegistration.findById(id);

  // check if The semester is already exists or not

  if (!isAcademicSemesterExists) {
    throw new AppError(httpStatus.NOT_FOUND, 'This Semester is not found');
  }

  // if the requested semester registration is ended, we will not update anything this semester registration

  const currentSemesterStatus = isAcademicSemesterExists?.status;
  const requestedSemesterStatus = payload?.status;

  if (currentSemesterStatus === 'ENDED') {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      `This semester is already ${currentSemesterStatus}`,
    );
  }

  // semester status "UPCOMING" ==> "ONGOING" ==> "ENDED"

  if (
    currentSemesterStatus === 'UPCOMING' &&
    requestedSemesterStatus === 'ENDED'
  ) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      ` You can't directly change the status ${currentSemesterStatus} to ${requestedSemesterStatus}`,
    );
  }
  if (
    currentSemesterStatus === 'ONGOING' &&
    requestedSemesterStatus === 'UPCOMING'
  ) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      ` You can't directly change the status ${currentSemesterStatus} to ${requestedSemesterStatus}`,
    );
  }

  const result = await SemesterRegistration.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
  });

  return result;
};

const deleteSemesterRegistrationFromDB = async (id: string) => {
  const result = await SemesterRegistration.findByIdAndUpdate(
    id,
    { isDeleted: true },
    { new: true },
  );
  return result;
};

export const SemesterRegistrationServices = {
  createSemesterRegistration,
  getAllSemesterRegistrationFromDB,
  getSinglesSemesterRegistrationFromDB,
  updateSemesterRegistrationIntoDB,
  deleteSemesterRegistrationFromDB,
};
