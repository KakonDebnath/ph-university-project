import httpStatus from 'http-status';
import AppError from '../../errors/AppError';
import { TAcademicDepartment } from './academicDepartment.interface';
import { AcademicDepartment } from './academicDepartment.model';
import { AcademicFaculty } from '../academicFaculty/academicFaculty.model';

const createAcademicDepartmentIntoDB = async (payload: TAcademicDepartment) => {
  const isAcademicDepartmentExist = await AcademicDepartment.findOne({
    name: payload.name,
  });
  if (isAcademicDepartmentExist) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      `This ${payload.name} Department is already exists!`,
    );
  }

  // check Academic Faculty exists or not
  const isAcademicFacultyExist = await AcademicFaculty.findById(
    payload?.academicFaculty,
  );

  if (!isAcademicFacultyExist) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      'This Academic Faculty does not exist',
    );
  }
  const result = await AcademicDepartment.create(payload);
  return result;
};

const getAllAcademicDepartmentFormDB = async () => {
  const result = await AcademicDepartment.find().populate('academicFaculty');
  return result;
};

const getSingleAcademicDepartmentFormDB = async (id: string) => {
  const result = await AcademicDepartment.findById(id);
  return result;
};

const updateAcademicDepartment = async (
  id: string,
  payload: Partial<TAcademicDepartment>,
) => {
  const result = await AcademicDepartment.findOneAndUpdate(
    { _id: id },
    payload,
    {
      new: true,
    },
  );
  return result;
};

export const AcademicDepartmentServices = {
  createAcademicDepartmentIntoDB,
  getAllAcademicDepartmentFormDB,
  getSingleAcademicDepartmentFormDB,
  updateAcademicDepartment,
};
