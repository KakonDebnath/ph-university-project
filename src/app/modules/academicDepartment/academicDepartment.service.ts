import { TAcademicDepartment } from './academicDepartment.interface';
import { AcademicDepartment } from './academicDepartment.model';

const createAcademicDepartmentIntoDB = async (payload: TAcademicDepartment) => {
  const isAcademicDepartmentExist = await AcademicDepartment.findOne({
    name: payload.name,
  });
  if (isAcademicDepartmentExist) {
    throw new Error('This Faculty is already exists!');
  }
  const result = await AcademicDepartment.create(payload);
  return result;
};

const getAllAcademicDepartmentFormDB = async () => {
  const result = await AcademicDepartment.find();
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
      timestamps: true,
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
