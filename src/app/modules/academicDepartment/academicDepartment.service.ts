import httpStatus from 'http-status';
import AppError from '../../errors/AppError';
import { TAcademicDepartment } from './academicDepartment.interface';
import { AcademicDepartment } from './academicDepartment.model';

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
